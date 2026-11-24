# One Stop Left

**Three errands. Six moves. One matatu map.**

A small, untimed daily route-planning game inspired by Nairobi's matatu culture. Follow the connections, finish the errands, and compare your move count in the Reddit thread. The maps are fictional, not real transport advice.

## Play

1. Start at **Terminus**, marked **YOU**.
2. Tap a connected stop. **Each connection costs one move**, in either direction. Stops marked **+** are available.
3. Visit the three **★ errand stops** in any order. They turn **✓** automatically.
4. Finish within six moves. You do not need to return to Terminus.
5. Undo reverses the last trip, including errand completion. Retry starts the same puzzle again.

No timer. Optional two-errand practice teaches the first tap. A win shows moves used and the shortest possible count. “Compare in the Reddit thread” reveals selectable, spoiler-free result text and a Devvit-powered discussion link. Nothing is posted automatically.

The punched ride ticket tracks each move. Traveled connections and an expandable **Your route so far** log help you understand detours. Completed rides receive a score receipt with a **Shortest route** stamp when optimal; results receive keyboard focus so they are immediately discoverable on mobile. **Copy result** copies only the spoiler-free message, with selectable text if clipboard access is blocked.

## Deployment status

**Not yet verified on Reddit.** The CLI is installed, but `npx devvit whoami` reports no authenticated account. The app slug `one-stop-left` is provisional until registered.

| Link | Status |
| --- | --- |
| Devvit app listing | **Pending upload and slug confirmation** |
| Public test subreddit | **Pending owner selection; fewer than 200 members** |
| Exact public playable post | **Pending installation/post creation** |
| Independent-account access | **Pending real Reddit test** |

Local functionality is not proof of Reddit integration. See [SUBMISSION.md](SUBMISSION.md), [docs/VERIFICATION.md](docs/VERIFICATION.md), and [docs/PLAYTEST.md](docs/PLAYTEST.md).

## Setup

Based on Reddit's official [Devvit Web React starter](https://github.com/reddit/devvit-template-react), with React 19, TypeScript, Vite, Hono and Devvit 0.15.4. This version of the actual starter uses Hono REST endpoints, not tRPC.

Use **Node 24.18+** (development environment: 24.21.0).

```sh
npm ci
npm run type-check
npm run lint
npm test
npm run validate:puzzles
npm run build
```

Or run every release check, including Chromium:

```sh
npm run verify
```

### Local UI preview

```sh
npm run preview:local
```

Open the printed local URL plus `/game.html`. Vite chooses another port if 5173 is occupied. This is explicitly labelled a local preview; it does not exercise Reddit APIs.

Development-only fixtures:

- `/game.html?date=2026-12-07` — opening puzzle
- `/game.html?date=2026-12-20` — final authored puzzle
- `/game.html?server` — use API responses (for browser-test mocks)

Production builds ignore these fixture parameters. Never use fixture footage as evidence of a functioning Reddit post.

### Browser checks

```sh
npx playwright install chromium
npm run test:browser
```

The suite starts a separate local preview on port 5181 and covers actual controls, all maps, 320/390/1280px widths, light/dark schemes, keyboard input, reduced-motion preference, refresh, mocked API errors and midnight rollover. Screenshots go to `test-results/`. Reddit authentication, Redis, expanded mode and `navigateTo` still need live verification.

## Run on Reddit

Read the current [quickstart](https://developers.reddit.com/docs/quickstart), [CLI](https://developers.reddit.com/docs/guides/tools/devvit_cli), and [playtest guidance](https://developers.reddit.com/docs/guides/tools/playtest).

1. Register the app at https://developers.reddit.com/new with your Reddit developer account. Choose React. If using an initialization code, follow the wizard's `npx devvit init <code>` instruction in this existing project; preserve the implemented source. Do not use `--force` to replace it.
2. Confirm the registered app slug in `devvit.json` and `package.json`.
3. Authenticate:

   ```sh
   npm run login
   npx devvit whoami
   ```

4. Create or choose a **public** test subreddit you moderate with **fewer than 200 members**. The CLI's automatically generated test subreddit is normally **private**, so it does not meet our chosen public-access acceptance test.
5. Upload and install (replace `YOUR_TEST_SUBREDDIT`):

   ```sh
   npm run deploy
   npx devvit install YOUR_TEST_SUBREDDIT
   npm run dev -- YOUR_TEST_SUBREDDIT
   ```

   `deploy` type-checks, lints and calls `devvit upload`; Devvit runs the configured Vite build. `dev` runs `devvit playtest`.
6. Installation triggers creation of an Interactive Post. If another is needed, use the subreddit menu **Create One Stop Left**. Save the **exact post permalink**, not only the live-reload `?playtest=` URL.
7. Open that permalink on mobile and desktop. Launch the game, complete a route, refresh, undo, retry, and open the result discussion.
8. Stop the playtest watcher before finalizing the build. Upload and install the final version, then verify the same public permalink from an account outside the development team, without moderator privileges or a playtest query.
9. Record the real URLs and version in `SUBMISSION.md` and keep the post available through **2026-12-17 02:00 UTC / 05:00 EAT**.

**Do not run `devvit publish` during this hackathon.** Organizers explicitly request upload/playtest rather than app publishing review. Final Devpost submission belongs to the entrant.

## Daily schedule and persistence

- One global boundary: **00:00 UTC** (03:00 EAT).
- The server supplies the initial date. A mounted session keeps that puzzle through midnight; a banner lets the player intentionally open the new day.
- Refresh opens today's puzzle. Route storage keys include player, date and puzzle identity, so yesterday's completed result cannot become today's result.
- **14 authored puzzles, no cycling:** December 7–20, 2026 inclusive. Judging ends December 17 at 02:00 UTC, so all 11 UTC dates touched between the internal target and judging end are covered, with three extra days.
- Before December 7 the opening map is explicitly labelled a pre-launch preview. After December 20 a season-finished message appears, with practice still available. Add fresh puzzles before extending the season; no silent repeats.
- Device storage saves immediately where available. Signed-in players additionally save validated routes in subreddit-scoped Devvit Redis, expiring after seven days. Guest play does not require an app account.
- Save errors do not stop play. Old sessions can finish locally; cloud writes expire 48 hours after their puzzle's UTC midnight.
- The local route takes precedence over the cloud copy on the same device. This is refresh protection, not a multi-device synchronization guarantee. App updates change Devvit iframe origins and can clear local storage; Redis is the update-resistant fallback.

## Puzzle authoring and validation

`src/shared/puzzles.ts` contains hand-authored stops, coordinates, connections, errands, budgets and design notes. `src/shared/solver.ts` uses breadth-first search over **(current stop, completed-errand bitmask)**.

```sh
npm run validate:puzzles
```

This prints optimal routes for developers. Solutions are never displayed during normal play; only the minimum count appears after a win. Unit tests independently enumerate all legal paths up to the budget, compare minima, and test route restoration and undo for each transition.

The supplied first graph was checked rather than assumed: **Market-first 5, Junction-first 7**. The revised opening keeps the seven named stops but changes connections so **Junction-first 6, Market-first 7**. See [design review](docs/PUZZLES.md).

## Project structure

- `src/client/game.tsx` — daily/practice flow, map, results and device persistence
- `src/client/splash.tsx` — lightweight Reddit inline entry; expands to `game`
- `src/server/routes/api.ts` — server UTC date, player context and validated Redis saves
- `src/server/core/post.ts` — supported Interactive Post creation
- `src/shared/game.ts` — pure rules and saved-route validation
- `src/shared/puzzles.ts`, `solver.ts` — content and shortest-path search
- `tests/` — browser flow checks
- `docs/` — rules audit, puzzle review, playtest protocol and verification ledger

## Rights and credits

Maps, layout, copy and CSS/SVG transit graphics were created for this project. System fonts only; no downloaded art, music, photographs or real operator branding is used. The official starter's BSD-3-Clause notice is retained in `LICENSE`. See [ASSETS.md](ASSETS.md) for dependency and asset provenance.

This project was developed with AI coding assistance under the entrant's game brief. No runtime AI is used and no player study or engagement result is claimed.
