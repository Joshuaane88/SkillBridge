import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { hasPdfSignature, pageText, PDF_MAX_BYTES, validatePdfFile } from "@/lib/pdf-resume";
import { ResumeUpload } from "@/components/ResumeUpload";

const { extract } = vi.hoisted(() => ({ extract: vi.fn() }));
vi.mock("@/lib/pdf-resume", async (original) => ({ ...await original<typeof import("@/lib/pdf-resume")>(), extractPdfResume: extract }));
afterEach(() => { cleanup(); extract.mockReset(); });

describe("PDF rules", () => {
  it("accepts .pdf at exactly 5 MB and rejects one byte above", () => {
    expect(PDF_MAX_BYTES).toBe(5 * 1024 * 1024);
    expect(() => validatePdfFile({ name: "resume.PDF", size: 5 * 1024 * 1024 })).not.toThrow();
    expect(() => validatePdfFile({ name: "resume.pdf", size: 5 * 1024 * 1024 + 1 })).toThrow("5 MB");
  });
  it("requires a PDF extension", () => {
    expect(() => validatePdfFile({ name: "resume.txt", size: 50 })).toThrow(".pdf");
  });
  it("requires a PDF signature rather than trusting the name", () => {
    expect(hasPdfSignature(new TextEncoder().encode("%PDF-1.7"))).toBe(true);
    expect(hasPdfSignature(new TextEncoder().encode("not a pdf"))).toBe(false);
  });
  it("retains text order with baseline and explicit line breaks", () => {
    expect(pageText([
      { str: "Joshua", transform: [1, 0, 0, 1, 0, 700] },
      { str: "Ane", transform: [1, 0, 0, 1, 60, 700], hasEOL: true },
      { str: "SQL analyst", transform: [1, 0, 0, 1, 0, 680] },
      { str: "Python projects", transform: [1, 0, 0, 1, 0, 650] },
    ])).toBe("Joshua Ane\nSQL analyst\nPython projects");
  });
});

describe("Upload races and privacy", () => {
  it("does not apply stale results after replacement", async () => {
    let first: ((text: string) => void) | undefined;
    extract.mockImplementationOnce(() => new Promise<string>((r) => { first = r; })).mockResolvedValueOnce("New resume");
    const onText = vi.fn();
    render(<ResumeUpload onText={onText} onBusy={vi.fn()} />);
    const input = screen.getByLabelText("Upload PDF resume");
    fireEvent.change(input, { target: { files: [new File(["%PDF-"], "old.pdf")] } });
    const oldSignal = extract.mock.calls[0]?.[1] as AbortSignal;
    fireEvent.change(input, { target: { files: [new File(["%PDF-"], "new.pdf")] } });
    await waitFor(() => expect(onText).toHaveBeenLastCalledWith("New resume"));
    first?.("Old resume");
    await Promise.resolve();
    expect(oldSignal.aborted).toBe(true);
    expect(onText).not.toHaveBeenCalledWith("Old resume");
  });
  it("removing a pending upload aborts and clears resume text", async () => {
    let resolve: ((text: string) => void) | undefined;
    extract.mockImplementation(() => new Promise<string>((r) => { resolve = r; }));
    const onText = vi.fn();
    render(<ResumeUpload onText={onText} onBusy={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Upload PDF resume"), { target: { files: [new File(["%PDF-"], "resume.pdf")] } });
    const signal = extract.mock.calls[0]?.[1] as AbortSignal;
    fireEvent.click(screen.getByRole("button", { name: "Remove PDF and extracted text" }));
    resolve?.("Stale text");
    await Promise.resolve();
    expect(signal.aborted).toBe(true);
    expect(onText).toHaveBeenLastCalledWith("");
    expect(onText).not.toHaveBeenCalledWith("Stale text");
  });
});