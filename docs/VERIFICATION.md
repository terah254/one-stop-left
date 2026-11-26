# Verification ledger

## Local checks

Verified November 23, 2026 (Node 24.21.0, Windows):

- `npm run build`: passed after removing an invalid CSS import.
- `npm run type-check`: passed after enabling TypeScript relative-import rewriting and Node types for rule tests.
- `npm test`: 13 tests passed, including all authored maps and independent exhaustive path enumeration.
- `npm run validate:puzzles`: all 14 scheduled maps plus original-map regression valid; coverage December 7–20 UTC.
- `npm run lint`: passed after fixing the starter's Windows quoting issue and marking Node test registration promises explicitly.
- `npm run test:browser`: **8 passed** in Chromium 159. All 14 maps won using rendered controls; mobile loss/retry/undo/win/share/refresh; practice; keyboard-only completion and focus; all maps at 320/390/1280px in light/dark with reduced-motion preference; no horizontal overflow or overlapping stop hitboxes; mocked API failure recovery, save order, expired saves and unavailable storage; midnight keeps old session and opens a clean new day.
- Screenshots reviewed: 320px light, 390px dark and 1280px desktop. Files generated under `test-results/`.
- Initial keyboard test incorrectly waited for `:focus` while focus was between the page and browser chrome. Fixed the test's inspection (using `document.activeElement`), then the complete browser suite passed. This was a test harness issue, not a claimed game fix.
- `npm audit --omit=dev`: **0 vulnerabilities** after moving the CLI to devDependencies per official guidance. The full installation still reports 14 advisories in development tooling; do not force-upgrade Devvit across major versions to silence them.

Browser API responses are mocked for error/save/rollover cases. These results do not verify real Devvit services.

### Polish follow-up

After adding the original matatu mark, move punches, route history, traveled lines and score receipt:

- Build, type checks and lint passed.
- All 8 browser tests passed again, including every map and both color schemes.
- Added checks for automatic result focus, the shortest-route stamp, successful clipboard copying and the blocked-clipboard fallback.
- Visually reviewed the 390px dark map and the mobile result receipt. `test-results/result-mobile.png` is a local UI capture, not a Reddit deployment screenshot.
- The 13 rule tests remain applicable; the rules, solver and schedule were unchanged by this polish pass.
- November 24: added a ninth browser regression proving hover/press never moves stop hit targets; all 9 browser tests passed.

### Challenge-run follow-up

Verified November 26, 2026:

- Added 10 original Hard/Expert maps, extending unique daily content to 24 maps through December 30.
- Every new map has four errands, an exact seven- or eight-move optimum, and at least one first move that cannot finish within budget.
- `npm run type-check`, `npm run lint`, `npm run build`, and `npm run validate:puzzles` passed.
- `npm test`: **14 passed**, including exhaustive legal-path enumeration and challenge trap checks.
- `npm run test:browser`: **9 passed**. All 24 maps were completed through rendered controls and fit without overflow or overlapping stop targets at 320, 390 and 1280 px in light/dark themes.

### Visual refresh follow-up

Verified November 26, 2026:

- Added a circular remaining-moves gauge, clearer `GO` markers, four-color errand cards, animated active routes/stops, ticket notches, a stronger result receipt and a wider desktop game sheet.
- Confirmed the Expert four-errand layout visually at 390 px and the opening map at 1280 px.
- Reduced-motion mode disables the new pulses and route animation.
- Type checks, lint, build, 14 unit/solver tests and all 9 browser tests passed after the refresh.

## Real Reddit — PARTIALLY VERIFIED

Verified November 24, 2026, as u/Late-Towel-5495:

- [x] App registered and uploaded — slug `one-stop-left`, version 0.0.1, 1 install. https://developers.reddit.com/apps/one-stop-left
- [x] Public test subreddit selected and member count checked — r/one_stop_left_dev, public, 2 members.
- [x] App installed — install count 1.
- [x] Interactive Post created and public permalink recorded — https://www.reddit.com/r/one_stop_left_dev/comments/1y49g7g/one_stop_left_three_errands_six_moves_one_matatu/
- [ ] Inline launch → expanded game
- [ ] Authenticated context and server UTC date
- [ ] Redis persistence after refresh/update
- [ ] Guest/no-account flow where supported by Reddit
- [ ] `navigateTo` opens this post's discussion on mobile/desktop
- [ ] Reddit light/dark settings (OS preference emulation is not enough)
- [ ] Independent account outside development team opens and completes game
- [ ] Five first-time mobile playtests

The permalink opened as a Reddit post page in the owner's signed-in browser. That is **not** proof that the game is playable from an outside account, and no independent-account or mobile playtest result is claimed. The owner's earlier blocker (`npx devvit whoami` reporting no account) is resolved; the CLI now reports u/Late-Towel-5495.

## Honest acceptance threshold

“Someone can open the public Reddit post and play without my help” remains **unmet until the live post and independent-account check above pass**. A successful local build, API mock or screenshot does not satisfy this.
