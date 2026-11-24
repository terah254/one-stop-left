# Five-player mobile playtest

**Recruitment request:** Please invite five people who have never seen One Stop Left. Use a mix of Android/iPhone if possible. At least one should use a Reddit account outside the development team. Share the exact public post URL, without a playtest query.

Status: **not yet conducted**. No player quotes, outcomes or engagement counts are available.

## Three-minute script per person

1. “Open this Reddit post on your phone. Try the game. Say what you’re thinking.” Do not explain the rules or point at a stop.
2. Observe the first 15 seconds: do they locate the start, understand a connection, and make a valid first move without coaching? Time only the observation, not the game.
3. Let them finish or fail. Ask: “What happened? What would you do differently?” Do not reveal the correct route.
4. Ask them to undo once, then retry if they want. “What did Undo change?”
5. After a win: “How did you do compared with the shortest route? How would you compare this with someone in the comments?”
6. Ask: “Would you try tomorrow’s map? What is the one thing you would change?” Record their actual words with permission.

If stuck, note the point of failure before offering help. Label any coached attempt.

## Record (one row per consenting tester)

| Player alias | Device / Reddit app or browser | First move without help? / seconds | Understood failure? | Undo clear? | Voluntary retry? | Found comparison? | Actual comment / friction |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | Pending | | | | | | |
| P2 | Pending | | | | | | |
| P3 | Pending | | | | | | |
| P4 | Pending | | | | | | |
| P5 | Pending | | | | | | |

Do not collect usernames or personal information unnecessarily.

## Fix priorities

- **P0:** Cannot open public post, launch, tap a stop, or finish; broken touch target; wrong puzzle/errands after undo/refresh.
- **P1:** First tap needs explanation; connections misunderstood; fail/result unclear; share action confusing.
- **P2:** Visual refinements and copy preferences.

Target: five of five can begin without coaching, explain the move cost and understand the end state. These are goals, not measured outcomes. Retest changed interactions with a fresh player when possible.

## Change log

| Date | Evidence | Change | Retest |
| --- | --- | --- | --- |
| Nov 22–23 | Solver: original graph made Market-first optimal | Revised opening connections, retaining seven stop names | BFS + exhaustive legal paths |
| Nov 23 | Geometry inspection found a line through unrelated Clinic on #005 | Moved Park; added overpass casing and explicit connection note | Browser/geometry checks |
| Nov 23 | Windows execution: starter lint script's single quotes were passed literally | Cross-platform double-quoted glob | ESLint rerun |
| Nov 23 | Responsive layout inspection found square map could be constrained to a non-square desktop height | Use max-width rather than max-height to keep SVG lines aligned with stop controls | 320/390/1280px browser checks passed |
| Nov 23 | Developer UX review: move use was only numeric; results appeared below the map | Added punched move ticket, traveled lines, expandable route history and automatic result focus | Eight browser tests passed; human clarity feedback still pending |
| Nov 23 | Developer UX review: sharing required manual text selection | Added clipboard copy with selectable-text fallback | Clipboard success and denial tested |
| Pending | Five first-time mobile sessions | Prioritize actual observations | Pending |

## Independent-account judge-access check

Record: UTC time, installed app version, exact post URL, subreddit visibility/member count, account is not developer/moderator, device/client, successful launch, valid move, completion, refresh, result discussion link. Have the tester paste the URL into a fresh session without `?playtest=`. Never mark this complete based only on the developer account.

## Draft thread prompt (owner posts intentionally)

“Today’s One Stop Left is up. Three errands, six moves. How many did you use? On #001, did heading straight to Market help or hurt? Share your count without the route; put stop-by-stop solutions inside Reddit spoiler tags. New map at 00:00 UTC.”
