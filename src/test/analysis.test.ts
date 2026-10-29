import { describe, expect, it } from "vitest";
import { analyzeRequestSchema, toPlainText, verifyAgainstResume, type Analysis } from "@/lib/analysis";
import { createRateLimiter } from "@/lib/rate-limit";
import { DEMO_ANALYSIS, SAMPLE_JOB, SAMPLE_RESUME } from "@/lib/samples";

describe("input validation", () => {
  it("rejects empty and short input", () => {
    expect(analyzeRequestSchema.safeParse({ resume: "", jobDescription: "", acknowledged: true }).success).toBe(false);
  });
  it("rejects oversized resume", () => {
    expect(analyzeRequestSchema.safeParse({ resume: "a".repeat(20_001), jobDescription: SAMPLE_JOB, acknowledged: true }).success).toBe(false);
  });
  it("requires acknowledgment", () => {
    expect(analyzeRequestSchema.safeParse({ resume: SAMPLE_RESUME, jobDescription: SAMPLE_JOB, acknowledged: false }).success).toBe(false);
    expect(analyzeRequestSchema.safeParse({ resume: SAMPLE_RESUME, jobDescription: SAMPLE_JOB, acknowledged: true }).success).toBe(true);
  });
  it("accepts valid study preferences and rejects unrealistic ones", () => {
    const base = { resume: SAMPLE_RESUME, jobDescription: SAMPLE_JOB, acknowledged: true };
    expect(analyzeRequestSchema.safeParse({ ...base, preferences: { weeklyHours: 5, timelineWeeks: 12, careerGoal: "Get this job" } }).success).toBe(true);
    expect(analyzeRequestSchema.safeParse({ ...base, preferences: { weeklyHours: 0, timelineWeeks: 12 } }).success).toBe(false);
    expect(analyzeRequestSchema.safeParse({ ...base, preferences: { weeklyHours: 5, timelineWeeks: 1 } }).success).toBe(false);
    expect(analyzeRequestSchema.safeParse(base).success).toBe(true);
  });
});

describe("output safety", () => {
  it("strips html/script from AI text", () => {
    expect(toPlainText('<script>alert(1)</script>Hi <b>there</b>')).toBe("alert(1)Hi there");
  });
  it("drops fabricated evidence and downgrades the skill", () => {
    const fake: Analysis = {
      ...DEMO_ANALYSIS,
      skills: [{ ...DEMO_ANALYSIS.skills[0]!, status: "demonstrated", resumeEvidence: ["Led a team of 40 engineers at Google"] }],
    };
    const out = verifyAgainstResume(fake, SAMPLE_RESUME);
    expect(out.skills[0]!.resumeEvidence).toEqual([]);
    expect(out.skills[0]!.status).toBe("not_demonstrated");
  });
  it("keeps verbatim evidence", () => {
    const out = verifyAgainstResume(DEMO_ANALYSIS, SAMPLE_RESUME);
    expect(out.skills[0]!.resumeEvidence.length).toBe(1);
    expect(out.skills[0]!.status).toBe("demonstrated");
  });
  it("sanitizes mentor note, this-week actions and roadmap fields", () => {
    const dirty: Analysis = {
      ...DEMO_ANALYSIS,
      mentorNote: "<b>Great</b> work so far",
      thisWeek: ["<i>Do a tutorial</i>", "   ", "Read about A/B tests"],
      roadmap: [{ ...DEMO_ANALYSIS.roadmap[1]!, priority: 1 }, { ...DEMO_ANALYSIS.roadmap[0]!, priority: 2 }],
    };
    const out = verifyAgainstResume(dirty, SAMPLE_RESUME);
    expect(out.mentorNote).toBe("Great work so far");
    expect(out.thisWeek).toEqual(["Do a tutorial", "Read about A/B tests"]);
    expect(out.roadmap[0]!.skill).toBe("Statistics and experiment design");
    expect(out.roadmap.every((r) => r.whyItMatters && r.doneWhen && r.buildOrPractice)).toBe(true);
  });
});

describe("rate limiting", () => {
  it("blocks the 6th request from one client within the window", () => {
    const check = createRateLimiter({ perKey: 5, windowMs: 600_000, globalPerWindow: 100 });
    for (let i = 0; i < 5; i++) expect(check("ip", 1000 + i).ok).toBe(true);
    expect(check("ip", 2000).ok).toBe(false);
    expect(check("other", 2000).ok).toBe(true);
  });
});
