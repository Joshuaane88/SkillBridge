/**
 * Best-effort in-memory sliding-window limiter. State lives in a single server
 * instance, so it slows abuse but is not a global guarantee across instances.
 */
export function createRateLimiter(opts: { perKey: number; windowMs: number; globalPerWindow: number }) {
  const hits = new Map<string, number[]>();
  let global: number[] = [];
  return function check(key: string, now = Date.now()): { ok: true } | { ok: false; retryAfterSec: number } {
    const cutoff = now - opts.windowMs;
    global = global.filter((t) => t > cutoff);
    const mine = (hits.get(key) ?? []).filter((t) => t > cutoff);
    if (mine.length >= opts.perKey || global.length >= opts.globalPerWindow) {
      const oldest = mine.length >= opts.perKey ? mine[0] : global[0];
      return { ok: false, retryAfterSec: Math.max(1, Math.ceil(((oldest ?? now) + opts.windowMs - now) / 1000)) };
    }
    mine.push(now);
    global.push(now);
    hits.set(key, mine);
    if (hits.size > 5000) hits.clear();
    return { ok: true };
  };
}
