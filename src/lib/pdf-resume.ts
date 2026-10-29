export const PDF_MAX_BYTES = 5 * 1024 * 1024;

export function validatePdfFile(file: Pick<File, "name" | "size">) {
  if (!/\.pdf$/i.test(file.name)) throw new Error("Choose a PDF file ending in .pdf.");
  if (file.size > PDF_MAX_BYTES) throw new Error("This PDF is larger than 5 MB. Choose a smaller file.");
  if (!file.size) throw new Error("This file is empty. Choose a valid PDF.");
}

export function hasPdfSignature(bytes: Uint8Array) {
  return bytes.length >= 5 && bytes[0] === 37 && bytes[1] === 80 && bytes[2] === 68 && bytes[3] === 70 && bytes[4] === 45;
}

type TextFragment = { str: string; hasEOL?: boolean; transform: number[] };

/** Keep PDF content-stream order, adding line breaks at baseline changes. */
export function pageText(items: unknown[]): string {
  let text = "";
  let previousY: number | undefined;
  for (const item of items) {
    if (!item || typeof item !== "object" || !("str" in item) || typeof item.str !== "string") continue;
    const fragment = item as TextFragment;
    const y = fragment.transform?.[5];
    if (text && !text.endsWith("\n")) text += previousY !== undefined && y !== undefined && Math.abs(y - previousY) > 3 ? "\n" : " ";
    text += fragment.str;
    if (fragment.hasEOL) text += "\n";
    previousY = y;
  }
  return text.trim();
}

export async function extractPdfResume(file: File, signal: AbortSignal, onProgress: (page: number, total: number) => void): Promise<string> {
  validatePdfFile(file);
  signal.throwIfAborted();
  const bytes = new Uint8Array(await file.arrayBuffer());
  signal.throwIfAborted();
  if (!hasPdfSignature(bytes)) throw new Error("This file does not contain a valid PDF. Choose another file.");
  // Dynamic imports keep PDF.js and its browser worker out of the SSR graph.
  const [pdfjs, worker] = await Promise.all([
    import("pdfjs-dist"),
    import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
  ]);
  signal.throwIfAborted();
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const task = pdfjs.getDocument({ data: bytes, isEvalSupported: false, useSystemFonts: true });
  const cancel = () => { void task.destroy().catch(() => undefined); };
  signal.addEventListener("abort", cancel, { once: true });
  try {
    const doc = await task.promise;
    const pages: string[] = [];
    let length = 0;
    onProgress(0, doc.numPages);
    for (let i = 1; i <= doc.numPages; i++) {
      signal.throwIfAborted();
      const page = await doc.getPage(i);
      try {
        const content = await page.getTextContent();
        const text = pageText(content.items);
        pages.push(text);
        length += text.length;
        if (length > 100_000) throw new Error("This document contains too much text. Use a shorter PDF or paste the relevant resume text.");
        signal.throwIfAborted();
        onProgress(i, doc.numPages);
      } finally {
        page.cleanup();
      }
    }
    const text = pages.join("\n\n").trim();
    if (!text) throw new Error("No selectable text was found. Scanned or image-only PDFs need OCR, which is not supported yet. Paste your resume text instead.");
    return text;
  } catch (error) {
    signal.throwIfAborted();
    if (error instanceof Error && (error.message.startsWith("No selectable") || error.message.startsWith("This document"))) throw error;
    throw new Error("This PDF could not be read. It may be corrupt, password-protected or unsupported. Try another PDF or paste your text.");
  } finally {
    signal.removeEventListener("abort", cancel);
    await task.destroy().catch(() => undefined);
  }
}