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
- Roadmap generation is mentor-style: one integrated portfolio project, core vs advanced tiers, conversational fields (why/what/how/build/done-when), and workload adapted to user study preferences; resource references stay as categories, never invented titles, links, or prices.
- Demo results must always be labeled as demonstration (`mode: "demo"`); never present hardcoded output as AI analysis.
- Logo lettering is custom SVG paths in the shared Monogram component; keep its compact variant and public favicon geometry in sync so all brand placements remain editable and consistent.
- Loading assembly is one-shot CSS motion, while visibility follows the actual request; remove the overlay after its opacity transition, never use completion timers.
- PDF extraction uses a dynamically imported browser PDF.js worker and cancellable upload control feeding the existing resume state; keep files out of server/storage paths and invalidate replaced or removed jobs before updating text.
