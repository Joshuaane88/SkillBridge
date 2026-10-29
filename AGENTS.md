<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project rules
- AI analysis runs only in `src/routes/api/analyze.ts` → `src/lib/analyze.server.ts`; keeps secrets server-side and lets the route enforce origin, size and rate limits.
- No server-side persistence of resumes or results; privacy is a core product requirement.
- All AI output passes Zod validation and `verifyAgainstResume` before reaching the UI; prevents fabricated evidence.
- Demo results must always be labeled as demonstration (`mode: "demo"`); never present hardcoded output as AI analysis.
