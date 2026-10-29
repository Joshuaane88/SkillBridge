import { useEffect, useMemo, useState } from "react";
import { Check, Download, Printer } from "lucide-react";
import { analysisToMarkdown, STATUS_LABEL, type AnalysisResult, type SkillStatus } from "@/lib/analysis";
import { cn } from "@/lib/utils";

export const progressKey = (id: string) => `skillbridge:progress:${id}`;

type Tab = "skills" | "roadmap" | "resume";
type Filter = "all" | SkillStatus;

const statusDot: Record<SkillStatus, string> = {
  demonstrated: "bg-status-demonstrated",
  partial: "bg-status-partial",
  not_demonstrated: "border border-foreground/40 bg-transparent",
};

export function Results({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  const [tab, setTab] = useState<Tab>("skills");
  const [filter, setFilter] = useState<Filter>("all");
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(progressKey(result.id));
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [result.id]);

  const toggle = (k: string) => {
    setDone((d) => {
      const next = { ...d, [k]: !d[k] };
      try {
        localStorage.setItem(progressKey(result.id), JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  };

  const counts = useMemo(() => {
    const c = { demonstrated: 0, partial: 0, not_demonstrated: 0 };
    result.skills.forEach((s) => c[s.status]++);
    return c;
  }, [result.skills]);
  const total = result.skills.length || 1;
  const shown = filter === "all" ? result.skills : result.skills.filter((s) => s.status === filter);
  const totalSteps = result.thisWeek.length + result.roadmap.length;
  const doneSteps = Object.values(done).filter(Boolean).length;
  const coreItems = result.roadmap.filter((r) => r.tier === "core");
  const advancedItems = result.roadmap.filter((r) => r.tier === "advanced");

  const exportMd = () => {
    const blob = new Blob([analysisToMarkdown(result, done)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "skillbridge-report.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-up mx-auto max-w-6xl px-5 pb-10 pt-12 sm:px-8">
      {result.mode === "demo" ? (
        <div className="mb-8 border-l-2 border-primary bg-accent px-4 py-3 text-sm text-accent-foreground">
          <strong className="font-medium">Demonstration.</strong> Fictional sample data, not an AI analysis of your materials. Nothing was sent to an AI provider.
        </div>
      ) : null}

      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="eyebrow">Skill analysis for</p>
          <h1 className="font-display mt-3 text-4xl font-light leading-tight sm:text-5xl">{result.roleTitle}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{result.summary}</p>
          {result.mentorNote ? <p className="mt-4 max-w-2xl leading-relaxed">{result.mentorNote}</p> : null}
        </div>
        <div className="no-print flex flex-wrap items-start gap-2 md:col-span-4 md:justify-end">
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm hover:border-foreground">
            <Printer className="h-4 w-4" aria-hidden /> Print / PDF
          </button>
          <button onClick={exportMd} className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm hover:border-foreground">
            <Download className="h-4 w-4" aria-hidden /> Export
          </button>
          <button onClick={onReset} className="inline-flex items-center gap-2 rounded-sm bg-foreground px-3 py-2 text-sm text-background">
            New analysis
          </button>
        </div>
      </div>

      {/* Evidence distribution — counts, not a score */}
      <div className="mt-10" aria-label="Evidence distribution">
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="bg-status-demonstrated" style={{ width: `${(counts.demonstrated / total) * 100}%` }} />
          <div className="bg-status-partial" style={{ width: `${(counts.partial / total) * 100}%` }} />
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-4 text-sm">
          {(Object.keys(counts) as SkillStatus[]).map((k) => (
            <div key={k}>
              <dt className="flex items-center gap-2 text-muted-foreground">
                <span className={cn("h-2.5 w-2.5 rounded-full", statusDot[k])} aria-hidden />
                {STATUS_LABEL[k]}
              </dt>
              <dd className="font-display mt-1 text-3xl">{counts[k]}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div role="tablist" aria-label="Result sections" className="no-print mt-12 flex gap-8 border-b border-border">
        {(
          [
            ["skills", "Skills & evidence"],
            ["roadmap", `Roadmap${totalSteps ? ` · ${doneSteps}/${totalSteps}` : ""}`],
            ["resume", "Resume improvements"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={cn(
              "-mb-px border-b-2 pb-3 text-sm transition-colors",
              tab === k ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <section className={cn("mt-8", tab !== "skills" && "hidden print:block")}>
        <h2 className="print-only font-display mb-4 text-2xl">Skills & evidence</h2>
        <div className="no-print mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter skills">
          {(["all", "demonstrated", "partial", "not_demonstrated"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                filter === f ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
              )}
            >
              {f === "all" ? `All (${result.skills.length})` : `${STATUS_LABEL[f]} (${counts[f]})`}
            </button>
          ))}
        </div>
        {shown.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">No skills in this category.</p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {shown.map((s) => (
              <li key={s.name} className="grid gap-4 py-6 md:grid-cols-12">
                <div className="md:col-span-4">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", statusDot[s.status])} aria-hidden />
                    <h3 className="font-display text-xl">{s.name}</h3>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {STATUS_LABEL[s.status]} · {s.importance.replace("_", " ")} · {s.category}
                  </p>
                </div>
                <div className="space-y-3 text-sm leading-relaxed md:col-span-8">
                  <p>
                    <span className="eyebrow mr-2">Job asks</span>
                    {s.jobRequirement}
                  </p>
                  {s.resumeEvidence.length ? (
                    s.resumeEvidence.map((e) => (
                      <blockquote key={e} className="border-l-2 border-primary pl-3 italic">
                        "{e}"
                      </blockquote>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No supporting excerpt found in your resume.</p>
                  )}
                  <p className="text-muted-foreground">{s.reasoning}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={cn("mt-8", tab !== "roadmap" && "hidden print:block")}>
        <h2 className="print-only font-display mb-4 mt-8 text-2xl">Roadmap</h2>

        {result.thisWeek.length ? (
          <div className="mb-12 border-l-2 border-primary bg-paper px-5 py-4">
            <h3 className="font-display text-xl">What to do this week</h3>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed">
              {result.thisWeek.map((t, i) => {
                const k = `week-${i}`;
                return (
                  <li key={k}>
                    <label className="flex cursor-pointer items-start gap-3">
                      <input type="checkbox" checked={!!done[k]} onChange={() => toggle(k)} className="peer sr-only" />
                      <span
                        aria-hidden
                        className={cn(
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-foreground/50 peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                          done[k] && "border-primary bg-primary text-primary-foreground",
                        )}
                      >
                        {done[k] ? <Check className="h-3 w-3" /> : null}
                      </span>
                      <span className={cn(done[k] && "text-muted-foreground line-through")}>{t}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {result.roadmap.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">No priority gaps were identified.</p>
        ) : (
          <>
            <div className="mb-12 rounded-sm border border-border bg-paper p-6">
              <p className="eyebrow">One project that ties it together</p>
              <h3 className="font-display mt-2 text-2xl">{result.portfolioProject.title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed">{result.portfolioProject.description}</p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{result.portfolioProject.whyItFits}</p>
            </div>

            {([
              ["Core priorities", coreItems],
              ["Optional, when you have room", advancedItems],
            ] as const).map(([heading, items]) =>
              items.length === 0 ? null : (
                <div key={heading} className="mb-12">
                  <h3 className="eyebrow mb-6">{heading}</h3>
                  <ol className="space-y-12">
                    {items.map((r) => {
                      const i = result.roadmap.indexOf(r);
                      const k = `item-${i}`;
                      return (
                        <li key={r.skill} className="grid gap-6 md:grid-cols-12">
                          <div className="md:col-span-4">
                            <span className="font-mono text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
                            <h4 className="font-display mt-2 text-2xl">{r.skill}</h4>
                            <p className="mt-2 text-sm text-muted-foreground">{r.estimatedEffort}</p>
                            <label className="no-print mt-4 flex cursor-pointer items-start gap-3 text-sm">
                              <input type="checkbox" checked={!!done[k]} onChange={() => toggle(k)} className="peer sr-only" />
                              <span
                                aria-hidden
                                className={cn(
                                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-foreground/50 peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                                  done[k] && "border-primary bg-primary text-primary-foreground",
                                )}
                              >
                                {done[k] ? <Check className="h-3 w-3" /> : null}
                              </span>
                              <span className={cn(done[k] && "text-muted-foreground line-through")}>Mark this step complete</span>
                            </label>
                          </div>
                          <div className="space-y-4 text-sm leading-relaxed md:col-span-8">
                            <p><span className="eyebrow mr-2">Why it matters</span>{r.whyItMatters}</p>
                            <p><span className="eyebrow mr-2">What to learn</span>{r.whatToLearn}</p>
                            <p><span className="eyebrow mr-2">How to learn it</span>{r.howToLearn}</p>
                            <p><span className="eyebrow mr-2">Build or practice</span>{r.buildOrPractice}</p>
                            <p><span className="eyebrow mr-2">You'll know it's done when</span>{r.doneWhen}</p>
                            <p className="text-muted-foreground"><span className="eyebrow mr-2">Where to look</span>{r.resourceCategory}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ),
            )}
          </>
        )}
      </section>

      <section className={cn("mt-8", tab !== "resume" && "hidden print:block")}>
        <h2 className="print-only font-display mb-4 mt-8 text-2xl">Resume improvements</h2>
        <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
          Ways to communicate experience you already have. Only add details marked like [X] if they are true.
        </p>
        {result.resumeSuggestions.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">No rewrite suggestions for this resume.</p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {result.resumeSuggestions.map((r) => (
              <li key={r.original} className="grid gap-4 py-6 text-sm leading-relaxed md:grid-cols-2">
                <div>
                  <p className="eyebrow">Currently</p>
                  <p className="mt-2 text-muted-foreground">{r.original}</p>
                </div>
                <div>
                  <p className="eyebrow text-primary">Consider</p>
                  <p className="mt-2">{r.suggestion}</p>
                  <p className="mt-3 text-muted-foreground">{r.explanation}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {result.caveats.length ? (
        <aside className="mt-16 border-t border-border pt-6 text-sm text-muted-foreground">
          <p className="eyebrow mb-3">Limitations</p>
          <ul className="list-disc space-y-1 pl-5">
            {result.caveats.map((c) => (
              <li key={c}>{c}</li>
            ))}
            <li>This comparison is not a prediction of hiring outcomes.</li>
          </ul>
        </aside>
      ) : null}
    </div>
  );
}
