import { cn } from "@/lib/utils";

/**
 * SB monogram: the S and B share a baseline, joined by an arch that forms the
 * bridge. Pass `animated` to draw the arch from left to right.
 */
export function Monogram({ className, animated = false, title = "SkillBridge" }: { className?: string; animated?: boolean; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-8 w-8", className)} role="img" aria-label={title} fill="none">
      <title>{title}</title>
      {/* S */}
      <path
        d="M27 21.5c-1.4-2.2-3.7-3.5-6.6-3.5-3.8 0-6.4 2.2-6.4 5.4 0 7.3 13.4 4.4 13.4 12.6 0 3.6-3 6-7 6-3.3 0-5.9-1.6-7.2-4.2"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {/* B */}
      <path
        d="M36 18v24h7.6c4.2 0 6.9-2.4 6.9-6.2 0-3.4-2.4-5.6-6-5.8 3-.4 5-2.5 5-5.6 0-3.6-2.6-6.4-6.6-6.4H36Z M36 30h6.6"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* bridge arch + deck */}
      <path d="M8 50h48" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
      <path
        d="M10 50C18 41 46 41 54 50"
        pathLength={1}
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
        className={animated ? "arc-draw" : undefined}
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground", className)}>
      <Monogram className="h-8 w-8" title="" />
      <span className="font-display text-xl font-medium lowercase leading-none">skillbridge</span>
    </span>
  );
}
