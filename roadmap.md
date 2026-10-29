# PDF resume upload
- [x] Add browser-only extraction, validation and safe cancellation.
- [x] Add accessible upload controls connected to existing resume state.
- [x] Test document cases, replacement, mobile layout and actual AI analysis.
- [x] Check automated build signals and document limitations.

Verified: 16 tests pass; automated TypeScript/production build reports build OK; single-page, multipage, scanned, invalid, corrupt, oversized and replaced PDFs exercised in Chromium; uploaded and edited text produced a real AI report with 9 skills and 5 roadmap items; desktop/mobile screenshots show no overlap or overflow.

Limitations: no OCR or password-protected PDFs; complex columns can have imperfect reading order, so extracted text remains editable. No object URLs are created; PDF loading tasks and pages are cleaned up. Safari/Firefox were not tested.