import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "skillbridge — evidence-based skill gap analysis" },
      { name: "description", content: "Compare your resume to a target job, see which skills your experience actually demonstrates, and get a practical roadmap. Open source." },
      { property: "og:title", content: "skillbridge — bridge the gap to your next role" },
      { property: "og:description", content: "Evidence-based skill comparisons and personalized career roadmaps for students and early-career professionals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    n: "01",
    title: "Show us where you are",
    body: "Upload your resume or tell us about your experience, then add a job you're interested in.",
  },
  {
    n: "02",
    title: "Find what matters",
    body: "See the skills you already bring, what employers are looking for, and where you could grow.",
  },
  {
    n: "03",
    title: "Make your next move",
    body: "Get a learning plan with practical projects, helpful resources, and steps you can work through at your own pace.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-16 sm:px-8 md:grid-cols-12 md:pt-28">
          <div className="md:col-span-8">
            <p className="eyebrow fade-up">Career development, with receipts</p>
            <h1 className="font-display fade-up mt-6 text-5xl font-light leading-[1.02] sm:text-6xl md:text-7xl" style={{ animationDelay: "80ms" }}>
              Bridge the gap between your skills and your <em className="font-normal text-primary">next opportunity.</em>
            </h1>
          </div>
          <div className="fade-up flex flex-col justify-end md:col-span-4" style={{ animationDelay: "180ms" }}>
            <p className="text-lg leading-relaxed text-muted-foreground">
              skillbridge reads a job description, finds what your resume actually shows, and turns the honest gaps into a plan.
            </p>
            <Link
              to="/analyze"
              className="group mt-8 inline-flex w-fit items-center gap-3 rounded-sm bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Analyze my skills
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <p className="mt-4 text-xs text-muted-foreground">No account. Nothing stored on our servers.</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 sm:px-8" aria-labelledby="how">
          <div className="rule pt-8">
            <h2 id="how" className="font-display text-4xl leading-[1.08] sm:text-5xl">
              A clearer path to what's next.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              You know where you want to go. We'll help you figure out how to get there.
            </p>
            <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-0">
              {steps.map((s, i) => (
                <li key={s.n} className={i > 0 ? "md:border-l md:border-border md:pl-8" : "md:pr-8"}>
                  <span className="font-mono text-sm text-primary">{s.n}</span>
                  <h3 className="font-display mt-3 text-2xl">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
          <div className="grid gap-8 border-y border-border py-12 md:grid-cols-12">
            <h2 className="font-display text-3xl leading-snug md:col-span-7">
              Your resume doesn't tell your whole story.
            </h2>
            <p className="leading-relaxed text-muted-foreground md:col-span-5">
              A skill that doesn't appear on your resume isn't necessarily one you don't have. SkillBridge helps you spot what's missing from the page and gives you ideas for what to work on next. The decisions are always yours.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
