import { useEffect, useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { extractPdfResume } from "@/lib/pdf-resume";
import { cn } from "@/lib/utils";

export function ResumeUpload({ onText, onBusy }: { onText: (text: string) => void; onBusy: (busy: boolean) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const active = useRef<AbortController | null>(null);
  const [filename, setFilename] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ page: 0, total: 0 });
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => () => { active.current?.abort(); }, []);

  const remove = () => {
    active.current?.abort();
    active.current = null;
    setFilename("");
    setError("");
    setBusy(false);
    onBusy(false);
    onText("");
    if (input.current) input.current.value = "";
  };

  const choose = async (file: File) => {
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    setFilename(file.name);
    setError("");
    setProgress({ page: 0, total: 0 });
    setBusy(true);
    onBusy(true);
    onText("");
    try {
      const text = await extractPdfResume(file, controller.signal, (page, total) => {
        if (active.current === controller) setProgress({ page, total });
      });
      if (active.current === controller && !controller.signal.aborted) onText(text);
    } catch (e) {
      if (active.current === controller && !controller.signal.aborted) setError(e instanceof Error ? e.message : "Could not read this PDF. Try another file.");
    } finally {
      if (active.current === controller) {
        active.current = null;
        setBusy(false);
        onBusy(false);
      }
    }
  };

  return (
    <div className="mt-4">
      <input ref={input} type="file" accept=".pdf,application/pdf" aria-label="Upload PDF resume" className="sr-only" tabIndex={-1}
        onChange={(e) => { const file = e.target.files?.[0]; if (file) void choose(file); e.target.value = ""; }} />
      <div className={cn("border border-dashed bg-paper px-4 py-5 transition-colors", dragging ? "border-primary bg-accent" : "border-border")}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length !== 1) { setError("Choose one PDF resume at a time."); return; } const file = e.dataTransfer.files[0]; if (file) void choose(file); }}>
        <div className="flex flex-wrap items-center gap-3">
          <Upload className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0 flex-1 basis-40">
            <p className="text-sm font-medium">Drop your PDF resume here</p>
            <p className="mt-1 text-xs text-muted-foreground">Selectable text · Up to 5 MB</p>
          </div>
          <Button variant="outline" onClick={() => input.current?.click()} className="rounded-sm">{filename ? "Replace PDF" : "Browse Files"}</Button>
        </div>
        {filename ? (
          <div className="mt-4 flex min-w-0 items-start gap-2 border-t border-border pt-3">
            <FileText className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="break-all text-sm">{filename}</p>
              <p role="status" aria-live="polite" className="mt-1 text-xs text-muted-foreground">
                {busy ? progress.total ? `Extracting page ${progress.page} of ${progress.total}…` : "Opening PDF…" : error ? "PDF not imported" : "Text extracted"}
              </p>
              {busy && progress.total > 0 ? <progress aria-label="PDF extraction progress" value={progress.page} max={progress.total} className="mt-2 h-1.5 w-full accent-primary" /> : null}
            </div>
            <Button variant="ghost" size="icon" aria-label="Remove PDF and extracted text" title="Remove PDF and extracted text" onClick={remove}><X /></Button>
          </div>
        ) : null}
      </div>
      {error ? <p role="alert" className="mt-3 text-sm text-destructive">{error}</p> : null}
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Your PDF stays in this browser. Review or edit the extracted text below; only that text is sent to the AI provider when you choose Analyze.</p>
    </div>
  );
}