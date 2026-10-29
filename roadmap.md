# Mentor-style roadmap generation
- [x] Extend request schema with study preferences (weekly hours, timeline, career goal).
- [x] Rework analysis schema: mentor note, one portfolio project, core/advanced roadmap items, this-week actions.
- [x] Rewrite system prompt for mentor voice, coherent sequencing, free-resource guidance.
- [x] Add preferences inputs to the workspace and render the new roadmap in Results.
- [x] Update demo analysis, Markdown export, and tests (18 passing).
- [x] Verify live: two fictional resumes for the same job produce meaningfully different roadmaps.

Verified: 18 tests pass; build OK. Live run with resume A (SQL/Python strong, no Tableau; 5 hrs/wk, 12 weeks) produced core priorities SQL transformations + Tableau + A/B testing; resume B (Tableau/A-B strong, no SQL; 10 hrs/wk, 8 weeks) produced SQL + Python + experiment rigor and explicitly skipped re-teaching Tableau. Both roadmaps name one integrated portfolio project, weekly-hour-sized "this week" actions, and free-resource categories with no invented links or prices.
