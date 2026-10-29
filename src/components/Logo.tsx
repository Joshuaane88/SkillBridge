import { cn } from "@/lib/utils";

// Custom outlined lettering stays editable and independent of installed fonts.
const LETTERS = "M42 15V27H37C36 21 33 19 28 19C23 19 20 22 20 25C20 29 24 30 30 32C39 35 44 38 44 45C44 53 37 57 28 57C23 57 18 55 15 53L14 56H10V42H15C17 49 21 52 27 52C32 52 35 50 35 46C35 42 31 41 25 39C16 36 11 33 11 26C11 18 18 14 27 14C32 14 36 15 39 17L40 15ZM49 15H69C81 15 86 19 86 26C86 31 83 34 78 35C85 36 89 40 89 46C89 53 83 56 71 56H49V52H54V19H49ZM64 20V32H68C74 32 77 30 77 26C77 22 74 20 68 20ZM64 37V51H70C77 51 80 49 80 44C80 39 77 37 70 37Z";

export function Monogram({ className, animated = false, compact = false, title = "SkillBridge" }: { className?: string; animated?: boolean; compact?: boolean; title?: string }) {
  return (
    <svg viewBox="0 0 100 96" className={cn("sb-logo h-8 w-8", animated && "sb-logo-assembling", compact && "sb-logo-compact", className)} role={title ? "img" : undefined} aria-label={title || undefined} aria-hidden={title ? undefined : true} fill="none">
      {title ? <title>{title}</title> : null}
      <g className="sb-bridge" strokeLinecap="square" strokeLinejoin="miter">
        <path className="sb-foundation" pathLength={1} d="M13 83H27M73 83H87M20 66V82M80 66V82" stroke="var(--logo-support)" strokeWidth="3" />
        <path className="sb-arch" pathLength={1} d="M20 79Q50 53 80 79" stroke="var(--logo-bridge)" strokeWidth={compact ? 4 : 2.5} />
        {!compact ? <path className="sb-spandrels" pathLength={1} d="M30 65V71M40 65V66M60 65V66M70 65V71" stroke="var(--logo-support)" strokeWidth="1.5" /> : null}
        <path className="sb-deck" pathLength={1} d="M12 62H88" stroke="var(--logo-bridge)" strokeWidth="4" />
        {!compact ? <path className="sb-deck" pathLength={1} d="M12 66H88" stroke="var(--logo-support)" strokeWidth="1" /> : null}
      </g>
      <g className="sb-letters" fillRule="evenodd">
        {!compact ? <path d={LETTERS} transform="translate(3 4)" fill="var(--logo-depth)" /> : null}
        <path d={LETTERS} transform="translate(1.5 2)" fill="var(--logo-bridge)" />
        <path d={LETTERS} fill="var(--logo-face)" />
      </g>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground", className)}>
      <Monogram compact className="h-8 w-8" title="" />
      <span className="font-display text-xl font-medium lowercase leading-none">skillbridge</span>
    </span>
  );
}
