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
  roadmap: [
    {
      skill: "BI dashboards (Tableau / Power BI)",
      priority: 1,
      objective: "Build and publish an interactive KPI dashboard in Tableau Public.",
      projectIdea: "Recreate your clinic no-show dashboard concept with a public delivery or transit dataset, with filters by region and week.",
      steps: [
        "Complete the free Tableau starter tutorials",
        "Pick a public operations dataset (e.g. city transit on-time data)",
        "Define 4–5 KPIs and sketch the layout on paper first",
        "Publish to Tableau Public and add the link to your resume",
      ],
      estimatedEffort: "2–3 weeks, ~5 hrs/week",
      resourceCategory: "Official vendor training and documentation",
    },
    {
      skill: "Statistics and experiment design",
      priority: 2,
      objective: "Be able to design, size, and evaluate a simple A/B test.",
      projectIdea: "Simulate an A/B test of two delivery routing rules in Python, then write a one-page results memo.",
      steps: [
        "Review hypothesis testing and confidence intervals",
        "Learn sample-size estimation for a two-proportion test",
        "Simulate data and analyze it with scipy",
        "Write the memo as if for an operations manager",
      ],
      estimatedEffort: "3 weeks, ~4 hrs/week",
      resourceCategory: "University open courseware in introductory statistics",
    },
    {
      skill: "dbt / data transformation tools",
      priority: 3,
      objective: "Understand how analysts model warehouse data with dbt.",
      projectIdea: "Build a small dbt project on DuckDB that transforms raw order data into a clean delivery-performance table.",
      steps: ["Follow the official dbt fundamentals material", "Set up dbt with DuckDB locally", "Add tests and documentation to your models"],
      estimatedEffort: "1–2 weeks, ~4 hrs/week",
      resourceCategory: "Official tool documentation and free courses",
    },
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
