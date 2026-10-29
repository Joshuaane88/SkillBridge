import { Monogram } from "./Logo";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

/** Stays mounted for as long as the real request is pending. */
export function LoadingScreen({ onCancel, leaving = false, onExited }: { onCancel: () => void; leaving?: boolean; onExited?: () => void }) {
  return (
    <div className={cn("analysis-loading fixed inset-0 z-50 flex flex-col items-center justify-center bg-background", leaving && "analysis-loading-leaving")} role="status" aria-live="polite" onTransitionEnd={(event) => { if (leaving && event.target === event.currentTarget && event.propertyName === "opacity") onExited?.(); }}>
      <Monogram animated className="h-36 w-36 text-foreground" title="Analysis in progress" />
      <p className="font-display mt-10 text-lg">Analyzing your profile</p>
      <p className="mt-4 text-sm text-muted-foreground">This usually takes 20–60 seconds.</p>
      <Button variant="link" disabled={leaving} onClick={onCancel} className="mt-10 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
        Cancel
      </Button>
    </div>
  );
}
