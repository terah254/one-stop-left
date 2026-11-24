# One Stop Left — submission kit

## Title and one-line pitch

**One Stop Left**

**Three errands. Six moves. One matatu map.**

## English project description

### Inspiration

One Stop Left turns the everyday question “Which errand should I do first?” into a compact daily route-planning puzzle. Inspired by Nairobi's matatu culture, its fictional transit maps give a familiar journey a small strategic twist: the nearest errand may be the wrong first stop.

### How to play

Start at Terminus and tap connected stops. Every connection costs one move, in either direction. Visiting Market, Clinic or Library completes that errand automatically. Finish all three within six moves; there is no timer and no need to return to the start. Undo restores the exact previous route and errands. Retry lets you explore another order. Optional practice teaches the first tap on a tiny map.

### A fresh daily route

The game contains fourteen authored puzzles scheduled for December 7–20, 2026. Everyone gets the same map at 00:00 UTC. Maps introduce loops, branch returns, competing approaches and choices about which errand to finish on. An open session retains its original puzzle through midnight. Every map is checked by a shortest-path solver; a win shows your move count alongside the shortest possible count, without revealing a solution during play.

### The Reddit conversation

The game is packaged as a Devvit Interactive Post with a lightweight launch view and an expanded playable map. The result screen offers a spoiler-free message and a discussion link for the same post. Players choose whether to copy their count and join the conversation. No result is posted automatically. Comparing routes gives the thread a concrete question: did rushing straight to Market actually save a move?

### How it was built

We used Reddit's official Devvit Web React starter, TypeScript, Vite and Hono. Pure route rules power the game and tests. Breadth-first search tracks both position and completed errands; a separate exhaustive path check verifies the minimums within each budget. CSS and SVG create the original transit-map identity. Device storage supports refresh, with validated Redis saves for signed-in Reddit players. The UI supports large touch targets, keyboard input, light/dark preferences and reduced motion. There is no runtime AI, monetization, account setup or leaderboard.

### The hardest design problem

The original opening graph failed its own intended lesson: the solver found Market-first took five moves, while Junction-first needed seven. We changed the connections and checked them again. In the revised graph, clearing the Library branch first succeeds in six moves; starting at Market needs seven. That turned a claimed route-choice twist into a verifiable one. The second challenge was making transfers unambiguous on a small screen, with explicit available-stop markers and a rule that lines connect only at named stops.

**Deployment/playtest status before pasting:** Code and local tests are implemented; live Reddit integration and five-person playtesting are still pending. Do not present these as completed outcomes. Replace this status with actual deployment and verification facts before final submission. AI coding assistance was used; original design direction came from the entrant.

## Required live URLs — replace after deployment

| Field | Value |
| --- | --- |
| Devvit app listing | **PENDING UPLOAD.** Expected form: `https://developers.reddit.com/apps/<registered-app-slug>`; provisional slug is `one-stop-left`, not yet verified. |
| Public test subreddit | **PENDING OWNER SELECTION AND VISIBILITY CHECK** |
| Exact public playable Reddit post | **PENDING INSTALLATION / POST CREATION** |
| Installed version | **PENDING** |
| Independent account verification | **PENDING — account outside the development team** |
| Optional public source repository | **PENDING — do not use the upstream starter repository as this project's URL** |
| Optional public video | **PENDING RECORDING / UPLOAD** |

Do not submit placeholders.

## Optional demo — 50-second shot list and voiceover

Record actual gameplay on the **public Reddit post**, preferably before December 8 when #001 is available (pre-launch preview or December 7). Keep Reddit chrome visible in the opening shot. Do not record the localhost preview as a Reddit demo.

| Time | Shot | Voiceover |
| --- | --- | --- |
| 0–7s | Start inside the Reddit post's playable map. Show Terminus, three errand chips and six moves. | “Three errands. Six moves. One matatu map. This is One Stop Left, a daily puzzle you play right here on Reddit.” |
| 7–15s | Tap Market; show the move counter. Briefly follow toward Library, then retry. | “Market is right next door. Tempting. But the first errand isn't always the best first move.” |
| 15–28s | Retry; take Terminus → Junction → Library → Junction. Pause on the Library checkmark. | “Let's clear the Library branch first. Every connection costs one move. Errands check themselves off, and undo lets you rethink a turn.” |
| 28–36s | Tap Market → Depot → Clinic. | “Now cross to Market, transfer at Depot, and finish at Clinic. All three errands, exactly six moves.” |
| 36–44s | Hold the win card and shortest count. Open the comparison panel. | “The result shows the shortest possible count. Share your score without spoiling the route.” |
| 44–50s | Open the actual Reddit discussion; end on the game's name and UTC reset caption. | “Did you rush to Market too? Compare in the thread. Tomorrow, a new map at midnight UTC.” |

Approximately 125 words; rehearse at a comfortable pace to stay within 45–55 seconds. Show real actions and actual results. If recording a later daily map, adapt the route and score honestly; do not alter the production date for judges.

Public video URL: **[PENDING]**. Rules say video is optional, should be under one minute, and if supplied must be public on YouTube, Vimeo, Facebook Video or Youku.

## Final checklist

### Formal fields and access

- [x] Registered; Devpost draft exists (reported by entrant).
- [x] Root README describes game, controls and setup.
- [x] English description and title drafted above.
- [ ] Confirm personal/team eligibility against official rules; original project, not a port.
- [ ] Confirm registered app slug and upload installable final version.
- [ ] Supply actual app listing URL.
- [ ] Supply actual public subreddit URL and exact playable post URL.
- [ ] Verify subreddit is public and has fewer than 200 members.
- [ ] Verify a non-team, non-moderator account can open the normal permalink and play without developer help.
- [ ] Verify mobile Reddit and desktop Reddit, launch, save/refresh and result discussion.
- [ ] Complete all remaining required fields in the actual Devpost form.
- [ ] Keep app and playable post free and accessible through **December 17, 2026 at 05:00 EAT**.
- [ ] Owner completes final Devpost submission by internal target **December 7**; official cutoff **December 9 at 05:00 EAT**.

### Quality and optional materials

- [ ] Recruit five first-time mobile players; record real observations and fix the biggest onboarding problems.
- [ ] Review `docs/VERIFICATION.md`; resolve remaining live-only checks.
- [ ] Record/upload the optional 45–55 second demo and replace its link.
- [ ] Add genuine gameplay screenshots, including a mobile map and result card.
- [ ] Optionally link this project's public repository after owner publishes it.
- [ ] Verify rights to all final assets and video/audio; retain starter license.
- [ ] Optional feedback survey, one form per entrant, by the same deadline.
- [ ] **Do not send the app for publishing review until after the hackathon.**
- [ ] Recheck official rules for updates before submission.

### Organizer recommendations versus rules

Rules govern. The overview's abbreviated list omits the formally required text description and README. The overview emphasizes judging the demo link; the rules allow judges to rely solely on submitted materials, so make both the public game and description strong. Public repo and video are optional. The rules also allow a private admin-approved subreddit, but our acceptance test is a public post in a public subreddit under 200 members. The overview asks entrants to delay app publishing review; an uploaded, unpublished app qualifies. See `docs/RULES.md` for scoring language and source links.

## Optional Developer Platform feedback survey draft

**Scope:** Genuine setup/build observations only. Live Reddit testing is pending, so this is not a claim about runtime behavior.

“I built a TypeScript daily route puzzle from `reddit/devvit-template-react`, using Devvit 0.15.4 on Windows PowerShell and Node 24.21.0.

1. Reproduction: clone the current React template, install dependencies and run `npm run lint` on Windows. Its single-quoted glob is passed literally, producing `No files matching the pattern \"'src/**/*.{ts,tsx}'\"`. Changing the package script to use escaped double quotes fixes the command. Suggest shipping a cross-platform script or `eslint src`.

2. Documentation/entrypoint guidance: the hackathon overview explicitly asks entrants to upload/playtest rather than submit for publishing review, while the general quickstart ends with a launch/publish instruction. The starter includes a `launch` script that chains upload and publish. Suggest a hackathon-specific quickstart with clearly separated `upload`, `install`, `playtest` and later `publish` steps.

3. Public judge access: playtest documentation says the automatically created subreddit is private. The competition emphasizes public demo access. Suggest an explicit visibility checklist in the hackathon deployment guide and an outside-account permalink check.

The `(current stop, errand mask)` game logic and local browser tests are working independently of the platform. I still need to test the installed game, Redis persistence and navigation on real Reddit clients; I have not inferred those results from local mocks.”

Feedback is judged on completeness, viability and potential impact. There are **five $200 awards**. Submit only observations still accurate after completing deployment; append reproducible live findings if any. Use the survey linked from the official overview/rules, not an invented URL.
