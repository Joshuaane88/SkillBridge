import { createFileRoute } from "@tanstack/react-router";
import { analyzeRequestSchema, LIMITS } from "@/lib/analysis";
import { createRateLimiter } from "@/lib/rate-limit";

// 5 analyses per client per 10 minutes, 100 per instance per 10 minutes.
const limiter = createRateLimiter({ perKey: 5, windowMs: 10 * 60_000, globalPerWindow: 100 });

const baseHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...baseHeaders, ...extra } });
}

function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const self = new URL(request.url).origin;
  const extra = (process.env["ALLOWED_ORIGINS"] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  try {
    const o = new URL(origin);
    if (o.origin === self || extra.includes(o.origin)) return true;
    // The request host may be rewritten by a proxy; compare against the forwarded host too.
    const fwd = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return !!fwd && o.host === fwd;
  } catch {
    return false;
  }
}

export const Route = createFileRoute("/api/analyze")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!originAllowed(request)) return json({ error: "Request origin not allowed." }, 403);

        const len = Number(request.headers.get("content-length") ?? "0");
        if (len > LIMITS.bodyMaxBytes) return json({ error: "Submitted text is too large." }, 413);

        const ip =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          "unknown";
        const rl = limiter(ip);
        if (!rl.ok)
          return json({ error: `Too many analyses. Please wait about ${Math.ceil(rl.retryAfterSec / 60)} minute(s).` }, 429, {
            "Retry-After": String(rl.retryAfterSec),
          });

        let raw: string;
        try {
          raw = await request.text();
        } catch {
          return json({ error: "Could not read request." }, 400);
        }
        if (raw.length > LIMITS.bodyMaxBytes) return json({ error: "Submitted text is too large." }, 413);

        let body: unknown;
        try {
          body = JSON.parse(raw);
        } catch {
          return json({ error: "Malformed request." }, 400);
        }
        const parsed = analyzeRequestSchema.safeParse(body);
        if (!parsed.success) return json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, 400);

        const { runAnalysis, AiConfigError, AiUpstreamError } = await import("@/lib/analyze.server");
        try {
          const analysis = await runAnalysis(
            parsed.data.resume,
            parsed.data.jobDescription,
            parsed.data.preferences ?? DEFAULT_PREFERENCES,
            request.signal,
          );
          return json({ analysis });
        } catch (err) {
          // Never log submitted content; log only the error category.
          if (err instanceof AiConfigError) {
            console.error("[analyze] AI not configured");
            return json({ error: "AI analysis is not configured on this server. Try the demonstration instead.", code: "not_configured" }, 503);
          }
          if (err instanceof AiUpstreamError) {
            console.error("[analyze] upstream status", err.status);
            if (err.status === 429) return json({ error: "The AI service is busy. Please try again in a minute." }, 429);
            if (err.status === 402 || err.status === 403)
              return json({ error: "AI usage for this site is currently paused. Please try again later." }, 503);
            return json({ error: "The AI service had a problem. Please try again." }, 502);
          }
          if (request.signal.aborted) return json({ error: "Cancelled." }, 499);
          console.error("[analyze] failed:", err instanceof Error ? err.name : "unknown");
          return json({ error: "We couldn't produce a reliable analysis. Please try again." }, 502);
        }
      },
    },
  },
});
