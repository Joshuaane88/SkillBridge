import { Monogram } from "./Logo";

const messages = ["Analyzing your profile", "Mapping skill gaps", "Building your roadmap"];

/** Stays mounted for as long as the real request is pending. */
export function LoadingScreen({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="fade-up fixed inset-0 z-50 flex flex-col items-center justify-center bg-background" role="status" aria-live="polite">
      <Monogram animated className="h-28 w-28 text-foreground" title="Analysis in progress" />
      <div className="relative mt-10 h-6 w-72 text-center">
        {messages.map((m, i) => (
          <span
            key={m}
            className="font-display absolute inset-0 text-lg opacity-0"
            style={{ animation: `message-cycle 7.8s ease-in-out ${i * 2.6}s infinite` }}
          >
            {m}
          </span>
        ))}
        <span className="sr-only">Analyzing your profile, mapping skill gaps and building your roadmap.</span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">This usually takes 20–60 seconds.</p>
      <button onClick={onCancel} className="mt-10 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
        Cancel
      </button>
    </div>
  );
}
