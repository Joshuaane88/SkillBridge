import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import { ResumeUpload } from "@/components/ResumeUpload";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Results, progressKey } from "@/components/Results";
import { analyzeRequestSchema, DEFAULT_PREFERENCES, LIMITS, type Analysis, type AnalysisResult } from "@/lib/analysis";
import { DEMO_ANALYSIS, SAMPLE_JOB, SAMPLE_RESUME } from "@/lib/samples";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze your skills — skillbridge" },
      { name: "description", content: "Paste your resume and a target job description to see evidence-based skill matches and a personal roadmap." },
      { property: "og:title", content: "Analyze your skills — skillbridge" },
      { property: "og:description", content: "Evidence-based skill comparison between your resume and a target job." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Workspace,
});

const newId = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));

function Field({ id, label, hint, value, onChange, min, max, children, disabled }: { id: string; label: string; hint: string; value: string; onChange: (v: string) => void; min: number; max: number; children?: ReactNode; disabled?: boolean }) {
  const len = value.trim().length;
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="font-display text-2xl">{label}</label>
        <span className={cn("font-mono text-xs", len > max ? "text-destructive" : "text-muted-foreground")}>
          {len.toLocaleString()} / {max.toLocaleString()}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
      {children}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        autoComplete="off"
        disabled={disabled}
        className="mt-4 min-h-[22rem] w-full resize-y rounded-sm border border-border bg-paper p-4 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground"
        placeholder={len < min ? "Paste text here…" : undefined}
      />
    </div>
  );
}

function Workspace() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [ack, setAck] = useState(false);
  const [weeklyHours, setWeeklyHours] = useState(DEFAULT_PREFERENCES.weeklyHours);
  const [timelineWeeks, setTimelineWeeks] = useState(DEFAULT_PREFERENCES.timelineWeeks);
  const [careerGoal, setCareerGoal] = useState("");
  const [error, setError] = useState<{ msg: string; notConfigured?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = async () => {
    if (pdfBusy || loading) return;
    setError(null);
    const parsed = analyzeRequestSchema.safeParse({
      resume,
      jobDescription: job,
      acknowledged: ack,
      preferences: { weeklyHours, timelineWeeks, careerGoal: careerGoal.trim() || undefined },
    });
    if (!parsed.success) return setError({ msg: parsed.error.issues[0]?.message ?? "Please check your input." });
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setLoadingVisible(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: ctrl.signal,
      });
      const data = (await res.json().catch(() => ({}))) as { analysis?: Analysis; error?: string; code?: string };
      if (!res.ok || !data.analysis) {
        setError({ msg: data.error ?? "Something went wrong. Please try again.", notConfigured: data.code === "not_configured" });
      } else {
        setResult({ ...data.analysis, id: newId(), mode: "ai", createdAt: new Date().toISOString() });
        window.scrollTo({ top: 0 });
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError({ msg: "Network error. Check your connection and try again." });
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const runDemo = () => {
    setResume(SAMPLE_RESUME);
    setJob(SAMPLE_JOB);
    setError(null);
    setResult({ ...DEMO_ANALYSIS, id: "demo", mode: "demo", createdAt: new Date().toISOString() });
    window.scrollTo({ top: 0 });
  };

  const clearAll = () => {
    abortRef.current?.abort();
    setUploadKey((key) => key + 1);
    setPdfBusy(false);
    setResume("");
    setJob("");
    setAck(false);
    setWeeklyHours(DEFAULT_PREFERENCES.weeklyHours);
    setTimelineWeeks(DEFAULT_PREFERENCES.timelineWeeks);
    setCareerGoal("");
    setError(null);
    setResult(null);
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("skillbridge:"))
        .forEach((k) => localStorage.removeItem(k));
      if (result) localStorage.removeItem(progressKey(result.id));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      {loadingVisible ? <LoadingScreen leaving={!loading} onExited={() => setLoadingVisible(false)} onCancel={() => abortRef.current?.abort()} /> : null}
      <div className="no-print mx-auto flex max-w-6xl justify-end px-5 pt-6 sm:px-8">
        <button onClick={clearAll} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
          Clear my data
        </button>
      </div>

      {result ? (
        <Results result={result} onReset={() => setResult(null)} />
      ) : (
        <main className="mx-auto max-w-6xl px-5 pt-6 sm:px-8">
          <p className="eyebrow">Analysis workspace</p>
          <h1 className="font-display mt-3 text-4xl font-light sm:text-5xl">Two documents. One honest comparison.</h1>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <button
               disabled={pdfBusy}
               onClick={() => { setUploadKey((key) => key + 1); setResume(SAMPLE_RESUME); setJob(SAMPLE_JOB); setError(null); }}
              className="rounded-sm border border-border px-3 py-1.5 hover:border-foreground"
            >
              Load fictional example
            </button>
            <button onClick={runDemo} disabled={pdfBusy} className="rounded-sm border border-border px-3 py-1.5 hover:border-foreground">
              View demonstration (no AI)
            </button>
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <Field id="resume" label="Resume / Experience" hint="Upload a PDF, paste your resume, or describe your experience." value={resume} onChange={setResume} min={LIMITS.resumeMin} max={LIMITS.resumeMax} disabled={pdfBusy}>
              <ResumeUpload key={uploadKey} onText={setResume} onBusy={setPdfBusy} />
              {!pdfBusy && resume.trim().length > 0 && (resume.trim().length < LIMITS.resumeMin || resume.trim().length > LIMITS.resumeMax) ? <p role="alert" className="mt-3 text-sm text-destructive">Resume text must be 150–20,000 characters. Edit the text below before analyzing.</p> : null}
            </Field>
            <Field id="job" label="Target job description" hint="Paste the full posting, including requirements." value={job} onChange={setJob} min={LIMITS.jobMin} max={LIMITS.jobMax} />
          </div>

          <fieldset className="mt-10 border-t border-border pt-8">
            <legend className="font-display pr-3 text-2xl">Your pace</legend>
            <p className="mt-1 text-sm text-muted-foreground">The roadmap adapts its workload to the time you actually have.</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="weekly-hours" className="text-sm font-medium">Hours per week</label>
                <input
                  id="weekly-hours"
                  type="number"
                  min={1}
                  max={40}
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="mt-2 w-full rounded-sm border border-border bg-paper px-3 py-2 text-sm outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label htmlFor="timeline-weeks" className="text-sm font-medium">Target timeline (weeks)</label>
                <input
                  id="timeline-weeks"
                  type="number"
                  min={2}
                  max={52}
                  value={timelineWeeks}
                  onChange={(e) => setTimelineWeeks(Number(e.target.value))}
                  className="mt-2 w-full rounded-sm border border-border bg-paper px-3 py-2 text-sm outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label htmlFor="career-goal" className="text-sm font-medium">Career goal <span className="text-muted-foreground">(optional)</span></label>
                <input
                  id="career-goal"
                  type="text"
                  maxLength={200}
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g. Get this job within 6 months"
                  className="mt-2 w-full rounded-sm border border-border bg-paper px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-foreground"
                />
              </div>
            </div>
          </fieldset>

          <div className="mt-10 grid gap-6 border-t border-border pt-8 md:grid-cols-12 md:items-start">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed md:col-span-8">
              <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-1 h-4 w-4 accent-primary" />
              <span>
                I understand that my resume and the job description will be sent to an AI provider (via the Lovable AI Gateway) to generate this analysis. skillbridge does not store them. Remove anything you would not want shared, such as your phone number or address.
              </span>
            </label>
            <div className="md:col-span-4 md:text-right">
              <Button
                onClick={run}
                disabled={loading || pdfBusy || resume.trim().length < LIMITS.resumeMin || resume.trim().length > LIMITS.resumeMax}
                className="w-full rounded-sm bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-opacity disabled:opacity-50 md:w-auto"
              >
                Analyze my skills
              </Button>
            </div>
          </div>

          {error ? (
            <div role="alert" className="mt-6 border-l-2 border-destructive bg-paper px-4 py-3 text-sm">
              <p>{error.msg}</p>
              <div className="mt-2 flex gap-4">
                <button onClick={run} className="underline underline-offset-4">Try again</button>
                {error.notConfigured ? <button onClick={runDemo} className="underline underline-offset-4">View demonstration</button> : null}
              </div>
            </div>
          ) : null}
        </main>
      )}
      <SiteFooter />
    </div>
  );
}
