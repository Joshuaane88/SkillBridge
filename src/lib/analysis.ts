import { z } from "zod";

/** Input limits shared by client and server. */
export const LIMITS = {
  resumeMin: 150,
  resumeMax: 20_000,
  jobMin: 100,
  jobMax: 12_000,
  bodyMaxBytes: 80_000,
} as const;

/** Study preferences that shape the roadmap workload. */
export const preferencesSchema = z.object({
  weeklyHours: z.number().int().min(1, "Choose at least 1 hour per week.").max(40, "Keep it realistic (40 hours per week max)."),
  timelineWeeks: z.number().int().min(2, "Give yourself at least 2 weeks.").max(52, "Keep the horizon under a year."),
  careerGoal: z.string().trim().max(200, "Keep your goal under 200 characters.").optional(),
});
export type Preferences = z.infer<typeof preferencesSchema>;

export const DEFAULT_PREFERENCES: Preferences = { weeklyHours: 5, timelineWeeks: 12 };

export const analyzeRequestSchema = z.object({
  resume: z.string().trim().min(LIMITS.resumeMin, "Your resume or experience needs a bit more detail (at least 150 characters).").max(LIMITS.resumeMax, "Your resume is too long (20,000 characters max)."),
  jobDescription: z.string().trim().min(LIMITS.jobMin, "The job description needs a bit more detail (at least 100 characters).").max(LIMITS.jobMax, "The job description is too long (12,000 characters max)."),
  acknowledged: z.literal(true, { errorMap: () => ({ message: "Please confirm you understand your text is sent to an AI provider." }) }),
  preferences: preferencesSchema.optional(),
});
export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

export const skillStatus = z.enum(["demonstrated", "partial", "not_demonstrated"]);
export type SkillStatus = z.infer<typeof skillStatus>;

/** Structured model output. All fields required (strict JSON schema). */
export const analysisSchema = z.object({
  roleTitle: z.string().max(200),
  summary: z.string().max(1500),
  /** Mentor-style opening: existing strengths, relevant experience, and the most important next steps. */
  mentorNote: z.string().max(1500),
  skills: z
    .array(
      z.object({
        name: z.string().max(120),
        category: z.enum(["technical", "domain", "tool", "interpersonal", "credential"]),
        importance: z.enum(["critical", "important", "nice_to_have"]),
        status: skillStatus,
        jobRequirement: z.string().max(600),
        resumeEvidence: z.array(z.string().max(600)).max(4),
        reasoning: z.string().max(900),
      }),
    )
    .max(30),
  /** One integrated project that ties the core priorities together. */
  portfolioProject: z.object({
    title: z.string().max(160),
    description: z.string().max(700),
    whyItFits: z.string().max(500),
  }),
  roadmap: z
    .array(
      z.object({
        skill: z.string().max(120),
        tier: z.enum(["core", "advanced"]),
        priority: z.number().int().min(1).max(30),
        whyItMatters: z.string().max(600),
        whatToLearn: z.string().max(600),
        howToLearn: z.string().max(600),
        buildOrPractice: z.string().max(700),
        doneWhen: z.string().max(400),
        estimatedEffort: z.string().max(80),
        resourceCategory: z.string().max(160),
      }),
    )
    .max(8),
  /** Concrete, manageable actions for the next 7 days. */
  thisWeek: z.array(z.string().max(300)).min(1).max(5),
  resumeSuggestions: z
    .array(
      z.object({
        original: z.string().max(600),
        suggestion: z.string().max(700),
        explanation: z.string().max(600),
      }),
    )
    .max(8),
  caveats: z.array(z.string().max(400)).max(6),
});
export type Analysis = z.infer<typeof analysisSchema>;

export type AnalysisResult = Analysis & { id: string; mode: "ai" | "demo"; createdAt: string };

/** Strip anything that looks like markup or control characters. Output is still rendered as text. */
export function toPlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Keep only resume excerpts that actually appear in the resume, so the model
 * cannot fabricate evidence. A skill left with no verifiable evidence is
 * downgraded so it is never reported as "demonstrated".
 */
export function verifyAgainstResume(analysis: Analysis, resume: string): Analysis {
  const haystack = normalize(resume);
  const clean = (s: string) => toPlainText(s);
  const skills = analysis.skills.map((s) => {
    const evidence = s.resumeEvidence
      .map(clean)
      .filter((e) => {
        const n = normalize(e);
        return n.length >= 8 && haystack.includes(n);
      });
    let status = s.status;
    if (evidence.length === 0 && status !== "not_demonstrated") status = "not_demonstrated";
    return {
      ...s,
      name: clean(s.name),
      jobRequirement: clean(s.jobRequirement),
      reasoning: clean(s.reasoning),
      resumeEvidence: evidence,
      status,
    };
  });
  return {
    roleTitle: clean(analysis.roleTitle) || "Target role",
    summary: clean(analysis.summary),
    skills,
    roadmap: analysis.roadmap
      .map((r) => ({
        ...r,
        skill: clean(r.skill),
        objective: clean(r.objective),
        projectIdea: clean(r.projectIdea),
        steps: r.steps.map(clean).filter(Boolean),
        estimatedEffort: clean(r.estimatedEffort),
        resourceCategory: clean(r.resourceCategory),
      }))
      .sort((a, b) => a.priority - b.priority),
    resumeSuggestions: analysis.resumeSuggestions
      .map((r) => ({ original: clean(r.original), suggestion: clean(r.suggestion), explanation: clean(r.explanation) }))
      .filter((r) => normalize(r.original).length >= 8 && haystack.includes(normalize(r.original))),
    caveats: analysis.caveats.map(clean),
  };
}

export const STATUS_LABEL: Record<SkillStatus, string> = {
  demonstrated: "Demonstrated",
  partial: "Partially demonstrated",
  not_demonstrated: "No sufficient evidence",
};

export function analysisToMarkdown(a: AnalysisResult, done: Record<string, boolean>): string {
  const lines: string[] = [];
  lines.push(`# SkillBridge report — ${a.roleTitle}`);
  lines.push("");
  if (a.mode === "demo") lines.push("> Demonstration report using fictional sample data. Not an AI analysis.\n");
  lines.push(`Generated ${new Date(a.createdAt).toLocaleString()}`, "", a.summary, "");
  for (const st of ["demonstrated", "partial", "not_demonstrated"] as const) {
    lines.push(`## ${STATUS_LABEL[st]}`, "");
    for (const s of a.skills.filter((x) => x.status === st)) {
      lines.push(`### ${s.name} (${s.importance.replace("_", " ")})`);
      lines.push(`- Requirement: ${s.jobRequirement}`);
      s.resumeEvidence.forEach((e) => lines.push(`- Evidence: "${e}"`));
      lines.push(`- Reasoning: ${s.reasoning}`, "");
    }
  }
  lines.push("## Roadmap", "");
  a.roadmap.forEach((r, i) => {
    lines.push(`### ${i + 1}. ${r.skill} — ${r.estimatedEffort}`);
    lines.push(`Objective: ${r.objective}`, `Project: ${r.projectIdea}`, `Resources: ${r.resourceCategory}`);
    r.steps.forEach((s, j) => lines.push(`- [${done[`${i}-${j}`] ? "x" : " "}] ${s}`));
    lines.push("");
  });
  lines.push("## Resume suggestions", "");
  a.resumeSuggestions.forEach((r) => lines.push(`- Original: "${r.original}"`, `  Suggested: ${r.suggestion}`, `  Why: ${r.explanation}`));
  lines.push("", "## Caveats", "");
  a.caveats.forEach((c) => lines.push(`- ${c}`));
  lines.push("", "_This report reflects evidence in the text you provided. It is not a prediction of hiring outcomes._");
  return lines.join("\n");
}
