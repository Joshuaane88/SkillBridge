import type { Analysis } from "./analysis";

/** Fictional example inputs. Any resemblance to real people is coincidental. */
export const SAMPLE_RESUME = `Maya Okafor (fictional example)
B.S. Information Science, 2025

EXPERIENCE
Data Analyst Intern, Riverbend Health Clinic (Summer 2024)
- Built weekly Excel dashboards tracking patient appointment no-show rates for 3 clinic locations
- Wrote SQL queries to pull scheduling data from the clinic's PostgreSQL database
- Presented findings to the operations manager, which led to a reminder-text pilot

Research Assistant, University Library Analytics Lab (2023–2025)
- Cleaned and merged survey datasets in Python using pandas
- Created charts in matplotlib for a faculty report on study-space usage
- Documented data cleaning steps for other student assistants

PROJECTS
- Course project: predicted bike-share demand with linear regression in Python
- Personal site with a blog about learning data visualization

SKILLS
Excel, SQL, Python (pandas, matplotlib), Git basics, public speaking`;

export const SAMPLE_JOB = `Junior Data Analyst — Northfield Logistics (fictional example)

We are looking for a Junior Data Analyst to join our operations analytics team.

Responsibilities
- Build and maintain dashboards in Tableau for warehouse and delivery KPIs
- Write SQL to extract and transform data from our cloud data warehouse
- Analyze delivery performance and present recommendations to stakeholders
- Design and evaluate simple A/B tests for routing changes

Requirements
- Strong SQL skills
- Experience with a BI tool such as Tableau or Power BI
- Working knowledge of Python or R for data analysis
- Understanding of basic statistics and experiment design
- Clear written and verbal communication

Nice to have
- Experience with dbt or another data transformation tool
- Familiarity with logistics or supply chain data`;

export const DEMO_ANALYSIS: Analysis = {
  roleTitle: "Junior Data Analyst — Northfield Logistics",
  summary:
    "The sample resume shows solid evidence of SQL, Python data work, and stakeholder communication. Evidence is lighter for BI tools and experiment design, and there is none for dbt or logistics data. These gaps are learnable with focused projects.",
  mentorNote:
    "You've already done the hardest part: real data work for real people. Your clinic internship shows you can pull data with SQL, turn it into something people look at, and present it in a way that changes a decision. That's exactly what this role pays for.\n\nWhat's missing from the page is Tableau and experiment design. The job asks for both explicitly, and your Excel dashboards and regression project are closer to them than you might think — you already know how to build a KPI view and how to model data, just not in these specific tools.\n\nFocus on two things: rebuild your dashboard thinking in Tableau Public, and learn just enough experiment design to run and read an A/B test. Everything else can wait.",
  skills: [
    {
      name: "SQL",
      category: "technical",
      importance: "critical",
      status: "demonstrated",
      jobRequirement: "Strong SQL skills; write SQL to extract and transform data from our cloud data warehouse",
      resumeEvidence: ["Wrote SQL queries to pull scheduling data from the clinic's PostgreSQL database"],
      reasoning: "Applied SQL against a production database in a real internship. Depth with transformations or warehouses is not shown.",
    },
    {
      name: "BI dashboards (Tableau / Power BI)",
      category: "tool",
      importance: "critical",
      status: "partial",
      jobRequirement: "Build and maintain dashboards in Tableau for warehouse and delivery KPIs",
      resumeEvidence: ["Built weekly Excel dashboards tracking patient appointment no-show rates for 3 clinic locations"],
      reasoning: "Dashboard building is demonstrated in Excel, an adjacent tool. No Tableau or Power BI work appears in the resume.",
    },
    {
      name: "Python for data analysis",
      category: "technical",
      importance: "important",
      status: "demonstrated",
      jobRequirement: "Working knowledge of Python or R for data analysis",
      resumeEvidence: ["Cleaned and merged survey datasets in Python using pandas", "Created charts in matplotlib for a faculty report on study-space usage"],
      reasoning: "Multiple concrete uses of pandas and matplotlib.",
    },
    {
      name: "Statistics and experiment design",
      category: "domain",
      importance: "important",
      status: "partial",
      jobRequirement: "Understanding of basic statistics and experiment design; design and evaluate simple A/B tests",
      resumeEvidence: ["Course project: predicted bike-share demand with linear regression in Python"],
      reasoning: "Regression shows statistical grounding. A/B testing or experiment design is not mentioned, which does not mean it is unknown to the candidate.",
    },
    {
      name: "Stakeholder communication",
      category: "interpersonal",
      importance: "important",
      status: "demonstrated",
      jobRequirement: "Present recommendations to stakeholders; clear written and verbal communication",
      resumeEvidence: ["Presented findings to the operations manager, which led to a reminder-text pilot"],
      reasoning: "A presentation that led to an operational change is strong evidence.",
    },
    {
      name: "dbt / data transformation tools",
      category: "tool",
      importance: "nice_to_have",
      status: "not_demonstrated",
      jobRequirement: "Experience with dbt or another data transformation tool",
      resumeEvidence: [],
      reasoning: "No evidence in the resume. This reflects what the text shows, not necessarily what the candidate knows.",
    },
    {
      name: "Logistics or supply chain data",
      category: "domain",
      importance: "nice_to_have",
      status: "not_demonstrated",
      jobRequirement: "Familiarity with logistics or supply chain data",
      resumeEvidence: [],
      reasoning: "Experience is in healthcare scheduling and library analytics; operational data is related but not logistics-specific.",
    },
  ],
  portfolioProject: {
    title: "Delivery performance dashboard with an A/B read-out",
    description:
      "Take a public delivery or transit dataset, model it with SQL, and build a Tableau Public dashboard tracking 4–5 on-time and cost KPIs. Then simulate a routing-change A/B test in Python on the same data and add a one-page memo summarizing what the test would tell an operations manager.",
    whyItFits:
      "It mirrors the job's three core duties — SQL extraction, Tableau KPI dashboards, and routing A/B tests — in one coherent piece of work, and it reuses the dashboard and Python skills the resume already shows.",
  },
  roadmap: [
    {
      skill: "BI dashboards (Tableau / Power BI)",
      tier: "core",
      priority: 1,
      whyItMatters: "The job's first responsibility is building and maintaining Tableau dashboards for warehouse and delivery KPIs — it's the tool you'll open every morning.",
      whatToLearn: "Tableau's data model, calculated fields, filters and parameters, and how to design a KPI layout people actually read.",
      howToLearn: "Work through the free Tableau starter tutorials, then recreate one chart from your clinic dashboard in Tableau each study session.",
      buildOrPractice: "Rebuild your no-show dashboard concept on a public delivery dataset, with region and week filters, as the first layer of the portfolio project.",
      doneWhen: "Your Tableau Public dashboard is published, loads from the raw dataset, and someone else can filter it without your help.",
      estimatedEffort: "2–3 weeks at ~5 hrs/week",
      resourceCategory: "Official vendor training (Tableau's free starter tutorials and Public gallery); Tableau Public itself is free",
    },
    {
      skill: "Statistics and experiment design",
      tier: "core",
      priority: 2,
      whyItMatters: "The role asks you to design and evaluate A/B tests for routing changes — your regression project shows the foundation, but experiments are a different muscle.",
      whatToLearn: "Hypothesis testing, confidence intervals, sample-size estimation, and the common ways A/B tests go wrong.",
      howToLearn: "A free university introductory statistics course, focusing on the testing chapters; take notes in the language of the job posting.",
      buildOrPractice: "Simulate two delivery routing rules in Python, run the test with scipy, and write the one-page memo that becomes the second half of your portfolio project.",
      doneWhen: "You can state the null hypothesis, justify the sample size, and explain the result to a non-technical operations manager in one page.",
      estimatedEffort: "3 weeks at ~4 hrs/week",
      resourceCategory: "University open courseware in introductory statistics; free scipy documentation",
    },
    {
      skill: "dbt / data transformation tools",
      tier: "advanced",
      priority: 3,
      whyItMatters: "It's a nice-to-have, not a requirement — but it signals you understand how warehouse data is modeled, which shortens your ramp-up.",
      whatToLearn: "What an analytics engineering workflow looks like: models, tests, and documentation.",
      howToLearn: "The official dbt fundamentals material, using the free dbt + DuckDB local setup rather than any paid cloud workspace.",
      buildOrPractice: "Add a small dbt layer to your portfolio project that turns the raw delivery data into one clean performance table.",
      doneWhen: "Your dbt project runs end to end locally with at least one test and a short README.",
      estimatedEffort: "1–2 weeks at ~4 hrs/week, after the core items",
      resourceCategory: "Official dbt documentation and free fundamentals course; DuckDB is free and local",
    },
  ],
  thisWeek: [
    "Create a free Tableau Public account and complete the first starter tutorial",
    "Download one public delivery or transit dataset and open it in Tableau",
    "Sketch your 4–5 KPIs and dashboard layout on paper",
    "Read one short explainer on A/B testing basics",
  ],
  resumeSuggestions: [
    {
      original: "Built weekly Excel dashboards tracking patient appointment no-show rates for 3 clinic locations",
      suggestion: "Built and maintained weekly Excel dashboards tracking appointment no-show rates across 3 clinic locations, used by the operations manager to [describe decision it informed].",
      explanation: "Frames the dashboard as a KPI tool for decisions, which mirrors the job's language. Only add the outcome if it is true.",
    },
    {
      original: "Presented findings to the operations manager, which led to a reminder-text pilot",
      suggestion: "Presented no-show analysis to the operations manager, leading to a reminder-text pilot; if known, add the pilot's result (e.g. no-shows reduced by [X]%).",
      explanation: "This is your strongest impact statement. A real measured result would make it more concrete.",
    },
  ],
  caveats: [
    "This is a fictional demonstration, not an AI analysis of your materials.",
    "A missing skill means the resume does not show it, not that the person lacks it.",
    "This comparison is not a prediction of hiring outcomes.",
  ],
};
