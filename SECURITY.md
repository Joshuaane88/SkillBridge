# Security policy

## Reporting a vulnerability
Please report privately via GitHub's "Report a vulnerability" (Security Advisories) on this repository.
Do not open a public issue containing exploit details. We aim to respond within 7 days.

## Implemented controls (tested in `src/test/analysis.test.ts` where noted)
- No accounts, no database, no server-side storage of resumes or results.
- AI key is server-only (`process.env.LOVABLE_API_KEY`), never in the browser bundle.
- `/api/analyze`: same-origin check (plus `ALLOWED_ORIGINS`), 80 KB body cap, Zod validation of types/lengths, required consent flag (tested).
- Best-effort rate limiting: 5 analyses / 10 min per client IP, 100 / 10 min per server instance (tested).
- Prompt-injection defense: documents wrapped in tags and declared as data; tag-breaking sequences removed; output schema-validated with Zod.
- Anti-fabrication: quoted evidence and rewrite "originals" must appear verbatim in the resume or are discarded; unverified skills are downgraded (tested).
- Output rendered as React text only; markup stripped server-side (tested). No `dangerouslySetInnerHTML`.
- Logs contain only error categories, never content. Responses use `Cache-Control: no-store`, `nosniff`, `no-referrer`.

## Known gaps
- Rate limits are in-memory per server instance, not global; a distributed attacker can exceed them. Use a CDN/WAF rule or shared store in production.
- No site-wide CSP / HSTS headers are set by the app; configure them at your host/CDN. HTTPS depends on the host.
- No explicit request timeout: client Cancel aborts the upstream call; otherwise the platform's request limits apply.
- Prompt injection cannot be fully prevented; the controls above reduce, not eliminate, risk.
- Passing tests or scanners does not mean the app is secure.
