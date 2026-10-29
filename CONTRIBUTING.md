# Contributing to SkillBridge

1. Fork and clone, then `bun install` and `bun run dev`.
2. Copy `.env.example` to `.env` and add a key (or use demonstration mode without one).
3. Keep changes small and typed. Run `bunx vitest run` and `bun run lint` before opening a PR.
4. Never commit secrets, real resumes, or personal data. Use fictional examples only.
5. Design rules: oat / ink / oxblood / stone palette tokens in `src/styles.css`; no hardcoded colors in components. The logo lettering is hand-drawn SVG in `src/components/Logo.tsx`; keep the compact variant and `public/favicon.svg` in sync with it.
6. AI behavior changes must keep: verbatim-evidence verification, plain-text output, the "absence of evidence is not absence of skill" framing, and the mentor voice (one portfolio project, core vs advanced priorities, no invented resource titles, links or prices).
7. PDF handling must stay browser-only: no file upload, no file storage, no server path for resume files. Extraction lives in `src/lib/pdf-resume.ts`; keep the PDF.js worker dynamically imported so it never enters the server bundle.

Security issues: see SECURITY.md — do not open public issues for vulnerabilities.
