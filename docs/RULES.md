# Organizer and platform source audit

Read November 22–23, 2026. Devpost initially returned HTTP 403 via text fetch; the in-app browser subsequently loaded the complete official rules, overview and resources. Recheck for amendments before submitting.

## Sources

- Overview: https://redditgameofday2026.devpost.com/
- Controlling rules: https://redditgameofday2026.devpost.com/rules
- Resources: https://redditgameofday2026.devpost.com/resources
- Devvit docs: https://developers.reddit.com/docs/
- Official templates: https://developers.reddit.com/docs/examples/template-library
- Quickstart: https://developers.reddit.com/docs/quickstart
- CLI: https://developers.reddit.com/docs/guides/tools/devvit_cli
- Testing: https://developers.reddit.com/docs/guides/tools/playtest
- Configuration: https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_configuration
- Persistence: https://developers.reddit.com/docs/capabilities/server/redis
- Web limitations: https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_overview
- Client effects (including user-initiated `navigateTo`): https://developers.reddit.com/docs/capabilities/client/overview

## Calendar

Pacific Time in December is PST (UTC−8); Kenya EAT is UTC+3.

| Event | Rules, Pacific | UTC | Kenya EAT |
| --- | --- | --- | --- |
| Submission/feedback opens | Nov 11, noon | Nov 11, 20:00 | Nov 11, 23:00 |
| Submission/feedback deadline | Dec 8, 18:00 | **Dec 9, 02:00** | **Wed Dec 9, 05:00** |
| Judging begins | Dec 9, 00:00 | Dec 9, 08:00 | Dec 9, 11:00 |
| Judging ends | Dec 16, 18:00 | **Dec 17, 02:00** | **Dec 17, 05:00** |
| Winners, on or around | Dec 17, 15:00 | Dec 17, 23:00 | Dec 18, 02:00 |

The overview displays December 9 at 05:00 GMT+3, consistent with the rules. Internal submission target: December 7. The daily schedule covers December 7–20 UTC, including the easily missed December 17 UTC judging tail.

## Formal requirements (rules §4)

- Working game built using Reddit's Developer Platform and Interactive Posts; Devvit Web is the recommended implementation.
- English text description of features/functionality.
- Unique Devvit app listing URL, created by upload.
- Detailed root README describing the game and how to play.
- Test subreddit URL **and exact playable post URL**.
- Public subreddit, or the documented `dr-admin-approve` option for admin access. Testing guidance says entrants **should** use a public subreddit with fewer than 200 members. This project follows the stronger public/no-special-access path.
- Free, unrestricted judge access through judging's end.
- Video is **optional**; should be less than one minute and show actual target-device functionality. If included, it must be publicly visible on YouTube, Vimeo, Facebook Video or Youku and linked in the form.
- Public source repository is optional.
- Developer feedback survey is optional. Registered entrants who have started a project may submit one actionable feedback form during the feedback period. Five $200 feedback awards.
- Rights to all code/assets/video materials; original work or authorized components.
- Complete every required field on the actual submission form; that form must still be checked by the owner.

Eligibility: age of majority, residency exclusions, no disqualifying organizer/judge relationship, and no prior Reddit-hackathon winning project. Kenya is not among the specifically named exclusions; the owner must confirm the full eligibility conditions applicable to them. This is an original project, not a port.

## Judging (rules §6)

Stage one is a viability/theme/platform **pass/fail** gate.

Stage two uses **equally weighted** Delightful UX, Polish, **Reddity**, and Daily Content. The overview spells the third criterion “Reddit-y”; the substance matches.

- UX: immediate playable map, contextual practice, no timer.
- Polish: legible stop labels, touch targets, keyboard support, clear result/loss, undo and retry.
- Reddity: fictional Nairobi-inspired transit identity; counts and route-choice discussion in the existing post.
- Daily Content: curated distinct graphs, checked minima, documented UTC schedule.

## Differences and implications

1. Overview says judges will score the demo link. Rules say judges **may choose not to test** and judge solely from text, images and video. Supply strong screenshots/description and preferably the short video, while still ensuring playable access.
2. Overview's abbreviated submission list omits root README and text description; rules require both.
3. Overview requests **no publishing review during the hackathon**. Private uploaded apps qualify. Generic Devvit quickstart recommends a `launch`/publish step for normal release; that is not the hackathon workflow. The starter's `launch` script has been removed.
4. Rules allow private subreddit admin access via `dr-admin-approve`; overview emphasizes a public demo. We choose a public subreddit under 200 members and independent-account testing.
5. Overview restricts Best Ported Daily Game to owned existing IP/ports; rules' prize table generically says “All Eligible Submissions.” No eligibility dependency here: One Stop Left is original and will not be represented as a port.
6. Rules §5 restrict changes to a submitted entry after the deadline except permitted modifications. Ship the full judging schedule before the deadline; ask organizers before substantive post-deadline fixes.

No deadline contradiction was found. For any newly discovered eligibility ambiguity, request written clarification before the deadline; §11 gives official rules precedence.
