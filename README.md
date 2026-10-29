# skillbridge

Open-source, evidence-based skill gap analysis for students, recent graduates and early-career professionals. Add your resume (paste text or upload a PDF) and a job description; SkillBridge classifies each requirement as **demonstrated**, **partially demonstrated** or **no sufficient evidence**, quotes your own resume as proof, and builds a prioritized roadmap. MIT licensed.

## Features
- Two-panel workspace: paste text or upload a PDF (text extracted in your browser, never uploaded), fictional examples, and a clearly labeled demonstration mode (no AI call).
- Study preferences — weekly hours, timeline, career goal — so the roadmap fits the time you actually have.
- Real LLM analysis via a server endpoint, structured JSON output validated with Zod.
- Evidence verification: excerpts not found verbatim in the resume are discarded.
- Results: skills & evidence (filterable), mentor-style roadmap (one portfolio project, core vs advanced priorities, "this week" actions, free-resource categories), resume rewrite suggestions, limitations.
- Print / PDF and Markdown export. "Clear my data" wipes inputs, results and saved progress.

## Quick start
```bash
bun install
cp .env.example .env   # add LOVABLE_API_KEY, or skip and use demonstration mode
bun run dev            # http://localhost:8080
bunx vitest run        # tests
```

## Architecture
```text
src/routes/index.tsx        Landing page
src/routes/analyze.tsx      Workspace: resume upload, job field, study preferences, loading state, results host
src/routes/privacy.tsx      Privacy & security disclosure
src/routes/api/analyze.ts   POST endpoint: origin check, size cap, rate limit, validation
src/lib/analyze.server.ts   System prompt + model call (server only)
src/lib/analysis.ts         Shared Zod schemas, sanitizing, evidence verification, export
src/lib/pdf-resume.ts       Browser-only PDF text extraction (PDF.js, dynamically imported)
src/lib/rate-limit.ts       In-memory sliding-window limiter
src/lib/samples.ts          Fictional example inputs and demo result
src/components/             Logo (SB monogram), ResumeUpload, LoadingScreen, Results, SiteChrome
```
Stack: TanStack Start (React 19, TypeScript), Tailwind CSS v4, Vercel AI SDK, PDF.js. Nothing is persisted server-side.

## Configuring AI
The endpoint calls the Lovable AI Gateway (OpenAI-compatible Responses API) with model `openai/gpt-6-astra`, set in `src/lib/analyze.server.ts`.
- `LOVABLE_API_KEY` (server secret) is required. Without it the API returns a "not configured" message and the UI offers the demonstration.
- To use another provider, replace the `createOpenAI({...})` provider in `analyze.server.ts` with any AI SDK provider that supports structured output; keep the schema and `verifyAgainstResume` step.

## Tests
`bunx vitest run` covers request validation and sanitizing, anti-fabrication (evidence must appear verbatim in the resume), rate limiting, the loading overlay's request-driven lifecycle, and PDF extraction (validation, reading order, replacement and removal races).

## Deployment
Builds to an edge worker (Cloudflare Workers compatible). Set secrets in your host's secret manager, never as `VITE_` variables. Configure HTTPS, HSTS and a CSP at your host/CDN. See SECURITY.md.

Optional: set `VITE_GITHUB_URL=https://github.com/<owner>/<repo>` to show a "Source on GitHub" link in the site footer.

## Limitations & future work
- The analysis reflects only the text provided; it is not a hiring prediction.
- Rate limiting is per-instance and best-effort.
- PDF upload covers text PDFs up to 5 MB. Scanned (image-only) and password-protected PDFs are not supported, and complex multi-column layouts can extract in imperfect reading order — the text stays editable, so you can fix it before analyzing.
- No accounts and no saved targets; roadmap checkmarks live in your browser only.
- Future: OCR for scanned PDFs, multiple saved targets (local only), localization, accessibility audit.

## License
MIT — see LICENSE. Contributions welcome: see CONTRIBUTING.md.
