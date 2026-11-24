# Puzzle design review — developer spoilers

All maps are original authored graphs with a six-move budget and three errands. Review below is a developer/solver review, **not a human playtest**. The ordering includes breathing-space days rather than monotonically increasing difficulty.

## Opening-map correction

The requested original connections give:

- Market first: Terminus → Market → Clinic → Junction → Depot → Library, **5**.
- Junction first: shortest **7**.

That contradicted the intended temptation. The original is retained as a regression fixture. The shipped opening connections are:

`Terminus–Market, Terminus–Junction, Market–Junction, Market–Depot, Depot–Clinic, Clinic–Park, Junction–Library`.

The optimal route is Terminus → Junction → Library → Junction → Market → Depot → Clinic, **6**. Starting at Market needs **7**, even with optimal subsequent choices. The unused Park makes the distinction between “visit all stops” and “finish errands” teachable.

## Calendar and decisions

| UTC day | # | Title | Minimum | Design/review |
| --- | --- | --- | --- | --- |
| Dec 7 | 001 | The Market temptation | 6 | Clear a side branch before crossing town. Immediate nearby errand is a trap. |
| Dec 8 | 002 | Along the line | 4 | Easy ring; compare directions. Spare moves let newcomers recover. |
| Dec 9 | 003 | Return ticket | 6 | A necessary return from Market; committing to the long Library arm early loses efficiency. |
| Dec 10 | 004 | Across the yard | 3 | Deliberate easy day. A visible three-errand chain and an unproductive lower corridor. |
| Dec 11 | 005 | Two bridges | 4 | Eastern loop versus diagonal Park approach. Moved Park west to avoid a line passing through unrelated Clinic. |
| Dec 12 | 006 | The long way home | 4 | Market acts as a transfer; decide which errand branch to finish on. |
| Dec 13 | 007 | Branch office | 6 | Three required arms; a bypass looks useful but costs more than returning through Junction. |
| Dec 14 | 008 | Park and ride | 5 | Competing approaches to Library; avoid stranding Market at the far end. |
| Dec 15 | 009 | Cross-town | 5 | Two plausible first errands; returning through Terminus can be as useful as the central connector. |
| Dec 16 | 010 | One more transfer | 5 | Order Clinic before the terminal Library; test apparent scenic shortcut against Depot transfer. |
| Dec 17 | 011 | End of the line | 5 | Finish on the Library spur rather than paying to leave it. Covers the final two UTC judging hours. |
| Dec 18 | 012 | Three corners | 5 | Wide perimeter and central spoke; optimal route ends at an outer errand. |
| Dec 19 | 013 | Bridge market | 6 | Eight-stop network; Bridge links competing eastern/western errand orders. |
| Dec 20 | 014 | Last connection | 6 | Nine-stop network; reject hillside detour in favor of the eastern Library link. |

The maps differ in edge topology, required-order decisions, backtracking, terminal branches and route lengths, not merely labels. All retain familiar names for scanability. Every required stop and every optional stop is reachable. No self-loops, duplicate edges or unknown endpoints are allowed.

## Review process

1. Run `npm run validate:puzzles` for BFS minima and sample optimal routes.
2. Run `npm test` for independent bounded path enumeration and invariants.
3. Run `npm run test:browser` for every rendered puzzle and responsive layouts.
4. Inspect line crossings: a white/paper-colored casing indicates overpasses; **only named stops connect**. No connection may pass through an unrelated stop's touch target.
5. Give five first-time players the public Reddit post. Record hesitation, wrong assumptions and retry intent in `PLAYTEST.md`.
6. Revalidate after each graph change and update this table, demo route and tests. Do not claim the difficulty curve is player-validated until those sessions occur.

Authored content ends December 20. There is no automatic cycling or runtime generated filler.
