import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & security — skillbridge" },
      { name: "description", content: "How skillbridge handles your resume: no accounts, no server storage, and clear disclosure of what is sent to an AI provider." },
      { property: "og:title", content: "Privacy & security — skillbridge" },
      { property: "og:description", content: "No accounts, no server-side resume storage, and explicit consent before anything is sent to an AI provider." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

const items = [
  ["What is sent", "When you run an AI analysis, your resume and job description text are sent to our server and forwarded to an AI provider through the Lovable AI Gateway. You must confirm this before anything is sent."],
  ["What is stored", "Nothing on our servers. Your text and results live only in this browser tab's memory. Roadmap checkmarks are saved in your browser's local storage, and Clear my data removes them."],
  ["What is logged", "Server logs record only error categories (for example, 'rate limited'). Resume content is never logged, placed in URLs, or sent to analytics."],
  ["Demonstration mode", "The demonstration uses fictional sample data and makes no network request to any AI provider."],
  ["Untrusted input", "Your documents are treated as data, never as instructions. Quoted evidence is checked against your actual resume text, and anything that doesn't match is discarded."],
  ["Limits", "Requests are size-limited and throttled per visitor. Throttling is best-effort per server instance; see the project's SECURITY.md for known gaps."],
];

function Privacy() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 pt-16 sm:px-8">
        <p className="eyebrow">Privacy & security</p>
        <h1 className="font-display mt-4 text-5xl font-light">Your resume is a personal document.</h1>
        <dl className="mt-12 divide-y divide-border border-y border-border">
          {items.map(([t, d]) => (
            <div key={t} className="grid gap-2 py-6 sm:grid-cols-3">
              <dt className="font-medium">{t}</dt>
              <dd className="leading-relaxed text-muted-foreground sm:col-span-2">{d}</dd>
            </div>
          ))}
        </dl>
      </main>
      <SiteFooter />
    </div>
  );
}
