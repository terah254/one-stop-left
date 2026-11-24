# One Stop Left — release handoff

## Status

The game is complete and locally verified. Remaining work requires the owner's Reddit account.

### Working

- Devvit Web Interactive Post with lightweight splash and expanded React game.
- Contextual practice; six-move daily puzzle; large labeled stops and explicit available moves.
- Exact undo, retry, early/exact-budget wins and out-of-moves recovery.
- Move punches, traveled lines and expandable route history.
- Spoiler-free result copying and intentional Reddit-thread navigation.
- Fourteen original UTC-scheduled puzzles, December 7–20, with no cycling.
- Server UTC date, midnight session behavior, device persistence and validated Redis fallback.
- Mobile/desktop, keyboard, reduced motion and light/dark support.
- README, rules audit, puzzle review, playtest protocol, asset record and submission package.

### Verification

Run:

```sh
npm run verify
```

This runs TypeScript, ESLint, 13 rule/solver tests, 14-map validation, 9 Chromium browser scenarios and the production build. `npm audit --omit=dev` also reports zero runtime vulnerabilities.

## Owner actions

1. ~~Register or confirm the Devvit app slug~~ — **done**: `one-stop-left`, version 0.0.1 uploaded and installed.
2. ~~Run `npm run login`~~ — **done**: authenticated as u/Late-Towel-5495; `npx devvit whoami` succeeds.
3. ~~Provide a public test subreddit~~ — **done**: r/one_stop_left_dev is public with 2 members.
4. Follow the upload/install/playtest sequence in `README.md`. Do **not** request app publishing review during the hackathon.
5. Record the actual app listing, subreddit, exact normal post permalink and installed version in `SUBMISSION.md`.
6. Verify that permalink with a second Reddit account outside the development team.
7. Recruit five first-time mobile players and use `docs/PLAYTEST.md`; record genuine observations only.
8. Apply evidence-based fixes and rerun `npm run verify`.
9. Optionally record the real-Reddit 50-second demo from `SUBMISSION.md`.
10. Replace every **PENDING** placeholder; the owner makes the final Devpost submission.

## Dates

- Internal target: **December 7, 2026**
- Official deadline: **December 9, 2026 at 05:00 EAT** (02:00 UTC)
- Judge access through: **December 17, 2026 at 05:00 EAT** (02:00 UTC)

## Acceptance

**Local game: passed.**

**Public Reddit acceptance: unverified.** “Someone can open the public Reddit post and play without help” remains unmet until upload, installation, a real public post and the independent-account check exist.
