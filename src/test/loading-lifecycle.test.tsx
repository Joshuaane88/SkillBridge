import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Route } from "@/routes/analyze";
import { DEMO_ANALYSIS } from "@/lib/samples";

vi.mock("@/components/SiteChrome", () => ({ SiteHeader: () => null, SiteFooter: () => null }));

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

function finishTransition() {
  // jsdom has no TransitionEvent constructor; supply its real property explicitly.
  const event = new Event("transitionend", { bubbles: true });
  Object.defineProperty(event, "propertyName", { value: "opacity" });
  fireEvent(screen.getByRole("status"), event);
}

function start() {
  const Workspace = Route.options.component;
  if (!Workspace) throw new Error("Workspace is missing");
  render(<Workspace />);
  fireEvent.click(screen.getByRole("button", { name: "Load fictional example" }));
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Analyze my skills" }));
}

describe("Request-driven loading", () => {
  it("holds until the actual request completes, then exits with the transition", async () => {
    let resolve: ((value: Response) => void) | undefined;
    vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>((r) => { resolve = r; })));
    start();
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "New analysis" })).not.toBeInTheDocument();
    await act(async () => { resolve?.(new Response(JSON.stringify({ analysis: DEMO_ANALYSIS }), { status: 200 })); });
    await waitFor(() => expect(screen.getByRole("button", { name: "New analysis" })).toBeInTheDocument());
    finishTransition();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("cancel aborts the actual request without presenting a network error", async () => {
    let signal: AbortSignal | undefined;
    vi.stubGlobal("fetch", vi.fn((_url: string, options: RequestInit) => new Promise<Response>((_resolve, reject) => {
      signal = options.signal ?? undefined;
      signal?.addEventListener("abort", () => reject(new DOMException("Cancelled", "AbortError")));
    })));
    start();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await act(async () => { await Promise.resolve(); });
    expect(signal?.aborted).toBe(true);
    finishTransition();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});