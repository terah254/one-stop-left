import './index.css';
import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { navigateTo } from '@devvit/web/client';
import {
  completed,
  current,
  initial,
  move,
  moves,
  neighbors,
  restore,
  shareText,
  undo,
  utcDate,
  won,
} from '../shared/game';
import type { Puzzle, State } from '../shared/game';
import { practice, scheduled, SCHEDULE_START } from '../shared/puzzles';
import { solve } from '../shared/solver';
import { MatatuMark } from './components/MatatuMark';

declare const __LOCAL_PREVIEW__: boolean;
const local = typeof __LOCAL_PREVIEW__ !== 'undefined' && __LOCAL_PREVIEW__;
// Development-only fixtures. Neither date overrides nor API mocking are enabled in Reddit builds.
const previewParams = local
  ? new URLSearchParams(window.location.search)
  : undefined;
const useLocalFixture = local && !previewParams?.has('server');
type Session = {
  date: string;
  p: Puzzle;
  state: State;
  thread?: string;
  player: string;
  canSave: boolean;
};
const readSaved = (key: string): unknown => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null');
  } catch {
    return undefined;
  }
};
const saveKey = (session: Session) =>
  `osl:v1:${session.player}:${session.date}:${session.p.id}`;

export const App = () => {
  const [session, setSession] = useState<Session>();
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState('');
  const [isPractice, setPractice] = useState(false);
  const [practiceState, setPracticeState] = useState(initial(practice));
  const [sharing, setSharing] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const [reload, setReload] = useState(0);
  const [today, setToday] = useState(utcDate());
  const saveQueue = useRef(Promise.resolve());
  const resultRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setToday(utcDate()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = useLocalFixture
          ? undefined
          : await fetch('/api/init', {
              signal: AbortSignal.any([
                controller.signal,
                AbortSignal.timeout(12000),
              ]),
            });
        if (response && !response.ok)
          throw new Error(
            'Could not load your Reddit session. Try again, or reopen the post.'
          );
        const data = response
          ? await response.json()
          : {
              date: previewParams?.get('date') ?? utcDate(),
              player: 'local',
              canSave: false,
            };
        if (typeof data.date !== 'string' || typeof data.player !== 'string')
          throw new Error('Unexpected session response. Reopen the post.');
        const p = scheduled(data.date);
        if (!p)
          throw new Error(
            'This season has finished. More routes are not scheduled yet. You can still try practice.'
          );
        const next: Session = {
          date: data.date,
          p,
          state: initial(p),
          player: data.player,
          canSave: data.canSave === true,
          thread: data.thread,
        };
        next.state =
          restore(p, readSaved(saveKey(next))) ??
          restore(p, data.route) ??
          initial(p);
        if (!controller.signal.aborted) {
          setSession(next);
          setError('');
          if (data.storageError)
            setSaving('Cloud save unavailable. Progress stays on this device.');
        }
      } catch (err) {
        if (!controller.signal.aborted)
          setError(
            err instanceof Error
              ? err.message
              : 'Could not load. Please try again.'
          );
      }
    }
    void load();
    return () => controller.abort();
  }, [reload]);

  const p = isPractice ? practice : session?.p;
  const state = isPractice ? practiceState : session?.state;
  const update = (next: State) => {
    setNotice('');
    setSharing(false);
    setCopyStatus('');
    if (isPractice) {
      setPracticeState(next);
      return;
    }
    if (!session) return;
    const updated = { ...session, state: next };
    setSession(updated);
    try {
      localStorage.setItem(saveKey(updated), JSON.stringify(next.route));
    } catch {
      setSaving('Device saving unavailable. Keep this game open to finish.');
    }
    if (session.canSave) {
      saveQueue.current = saveQueue.current.then(async () => {
        try {
          const result = await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: session.date, route: next.route }),
            signal: AbortSignal.timeout(10000),
          });
          if (result.status === 410)
            setSaving(
              'Session expired for cloud saving. Finish here, then open today’s puzzle.'
            );
          else if (!result.ok) throw new Error('Save failed');
          else setSaving('');
        } catch {
          setSaving('Cloud save unavailable. Progress stays on this device.');
        }
      });
    }
  };
  const takeRide = (id: string) => {
    if (!p || !state) return;
    const next = move(p, state, id);
    if (next === state) {
      setNotice(
        won(p, state)
          ? 'All done! Retry to explore another route.'
          : moves(state) >= p.budget
            ? 'No moves left. Undo a move or retry.'
            : id === current(state)
              ? 'You are here. Choose a connected stop.'
              : 'No direct connection. Follow a line to a stop marked +.'
      );
    } else {
      update(next);
      const stop = p.stops.find((s) => s.id === id)!;
      const newlyCompleted =
        p.errands.includes(id) && !state.route.includes(id);
      setNotice(
        `${newlyCompleted ? '✓ Errand done at ' : 'Arrived at '}${stop.name}. ${completed(p, next).length} of ${p.errands.length} errands done.`
      );
    }
  };
  const success = p && state && won(p, state);
  const lost = p && state && !success && moves(state) === p.budget;
  const text = p && state && session ? shareText(p, state, session.date) : '';
  const minimum = success && p ? solve(p)!.length - 1 : undefined;
  const finished = Boolean(success || lost);
  useEffect(() => {
    if (finished) resultRef.current?.focus();
  }, [finished, isPractice]);

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Copied! Paste it into the thread when you’re ready.');
    } catch {
      setCopyStatus(
        'Select the result text below and copy it. Nothing has been posted.'
      );
    }
  };

  return (
    <main className={`game ${finished ? 'game-finished' : ''}`}>
      <div className="ambient-shape ambient-one" aria-hidden="true" />
      <div className="ambient-shape ambient-two" aria-hidden="true" />
      <header className="masthead">
        <div className="brand-mark" aria-hidden="true">
          <MatatuMark />
        </div>
        <div>
          <p className="eyebrow">A DAILY MATATU PUZZLE</p>
          <h1>
            One Stop Left<span>.</span>
          </h1>
        </div>
        <span className="ticket">
          {isPractice ? 'P' : (p?.id ?? '001')}
          <br />
          <small>ROUTE</small>
        </span>
      </header>
      <p className="tagline">
        {isPractice
          ? 'Two errands. Three moves. Try your first ride.'
          : `${p?.errands.length ?? 3} errands. ${p?.budget ?? 6} moves. One matatu map.`}
      </p>
      <div className="route-board" aria-hidden="true">
        <span>NAIROBI</span>
        <i />
        <b>{isPractice ? 'PRACTICE LOOP' : 'TODAY’S ROUTE'}</b>
        <i />
        <span>ALL ABOARD</span>
      </div>
      {!isPractice && !session && (
        <section className="message" role="status">
          <h2>{error ? 'Route unavailable' : 'Finding your route…'}</h2>
          <p>{error || 'One moment, please.'}</p>
          {error && (
            <button
              onClick={() => {
                setError('');
                setReload((v) => v + 1);
              }}
            >
              Try loading again
            </button>
          )}
        </section>
      )}
      {p && state && (
        <>
          <section className="daily-heading route-summary">
            <div>
              <p className="eyebrow">
                {isPractice
                  ? 'PRACTICE · NO PRESSURE'
                  : `${session!.date < SCHEDULE_START ? 'PRE-LAUNCH PREVIEW · ' : ''}#${p.id} · ${session!.date} UTC`}
              </p>
              <h2>{p.title}</h2>
              <span
                className={`difficulty difficulty-${p.difficulty.toLowerCase()}`}
              >
                {p.difficulty}
              </span>
            </div>
            <div
              className="moves"
              style={{
                background: `conic-gradient(var(--orange) ${((p.budget - moves(state)) / p.budget) * 360}deg, color-mix(in srgb, var(--line) 28%, transparent) 0deg)`,
              }}
            >
              <strong>{p.budget - moves(state)}</strong>
              <span>moves left</span>
            </div>
          </section>
          <div
            className={`move-ticket ${p.budget > 6 ? 'long-ticket' : ''}`}
            aria-label={`${moves(state)} of ${p.budget} moves used`}
          >
            <span className="eyebrow">YOUR RIDE</span>
            <div className="punches" aria-hidden="true">
              {Array.from({ length: p.budget }, (_, i) => (
                <span
                  key={i}
                  className={`punch ${i < moves(state) ? 'used' : ''}`}
                >
                  {i < moves(state) ? '✓' : i + 1}
                </span>
              ))}
            </div>
            <span className="fare-caption">1 line = 1 move</span>
          </div>
          <div className="section-label">
            <span>ERRAND MANIFEST</span>
            <span>
              {completed(p, state).length}/{p.errands.length} complete
            </span>
          </div>
          <ul className="errands" aria-label="Errands">
            {p.errands.map((id) => (
              <li key={id} className={state.route.includes(id) ? 'done' : ''}>
                <span aria-hidden="true">
                  {state.route.includes(id) ? '✓' : '☆'}
                </span>{' '}
                {p.stops.find((s) => s.id === id)!.name}
                <span className="sr-only">
                  {state.route.includes(id) ? ' completed' : ' remaining'}
                </span>
              </li>
            ))}
          </ul>
          <p className="instruction">
            {success
              ? 'All errands done! Your result is below.'
              : lost
                ? 'No moves left. Undo or retry below.'
                : isPractice && moves(state) === 0
                  ? practice.note
                  : moves(state) === 0
                    ? 'Start at YOU. Tap a + stop to take your first ride.'
                    : `At ${p.stops.find((s) => s.id === current(state))!.name}. Follow a line to a + stop.`}
          </p>
          {!isPractice &&
            moves(state) === 0 &&
            (p.difficulty === 'Hard' || p.difficulty === 'Expert') && (
              <p className="challenge-warning">
                {p.difficulty === 'Expert'
                  ? 'Expert route · Every move counts. Plan all four errands before your first ride.'
                  : 'Hard route · The obvious first stop may be a trap.'}
              </p>
            )}
          <div className="map-frame">
            <div className="map-chrome" aria-hidden="true">
              <span>MATATU NETWORK</span>
              <span>FARE: 1 MOVE</span>
            </div>
            <section
              className="map"
              aria-label="Transit map. Connections are undirected. Lines crossing without a stop do not connect."
            >
              <svg viewBox="0 0 360 360" aria-hidden="true">
                {p.edges.map(([a, b]) => {
                  const from = p.stops.find((s) => s.id === a)!;
                  const to = p.stops.find((s) => s.id === b)!;
                  const active = a === current(state) || b === current(state);
                  const traveled = state.route.some(
                    (id, i) =>
                      i > 0 &&
                      ((state.route[i - 1] === a && id === b) ||
                        (state.route[i - 1] === b && id === a))
                  );
                  return (
                    <g key={`${a}${b}`}>
                      <line
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        className="line-casing"
                      />
                      <line
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        className={`line ${traveled ? 'traveled' : ''} ${active && !finished ? 'active' : ''}`}
                      />
                      <circle
                        cx={(from.x + to.x) / 2}
                        cy={(from.y + to.y) / 2}
                        r="10"
                        className="fare-dot"
                      />
                      <text
                        x={(from.x + to.x) / 2}
                        y={(from.y + to.y) / 2 + 4}
                        className="fare"
                      >
                        1
                      </text>
                    </g>
                  );
                })}
              </svg>
              {p.stops.map((stop) => {
                const here = stop.id === current(state);
                const available =
                  !success &&
                  !lost &&
                  neighbors(p, current(state)).includes(stop.id);
                const errand = p.errands.includes(stop.id);
                const done = errand && state.route.includes(stop.id);
                const status = here
                  ? 'You are here'
                  : available
                    ? 'Available, 1 move'
                    : 'Not directly connected';
                return (
                  <button
                    key={stop.id}
                    className={`stop ${here ? 'here' : ''} ${available ? 'available' : ''} ${done ? 'visited' : ''}`}
                    style={{
                      left: `${stop.x / 3.6}%`,
                      top: `${stop.y / 3.6}%`,
                    }}
                    aria-label={`${stop.name}. ${status}.${errand ? (done ? ' Errand completed.' : ' Errand remaining.') : ''} Connected to ${neighbors(
                      p,
                      stop.id
                    )
                      .map((id) => p.stops.find((s) => s.id === id)!.name)
                      .join(', ')}.`}
                    aria-current={here ? 'location' : undefined}
                    onClick={() => takeRide(stop.id)}
                  >
                    <span className="station-icon" aria-hidden="true">
                      {here
                        ? '●'
                        : done
                          ? '✓'
                          : errand
                            ? '★'
                            : available
                              ? '+'
                              : '○'}
                    </span>
                    <span className="stop-label">{stop.name}</span>
                    {here && <span className="here-label">YOU</span>}
                    {available && (
                      <span className="available-label" aria-hidden="true">
                        GO
                      </span>
                    )}
                  </button>
                );
              })}
            </section>
            <div className="map-footer" aria-hidden="true">
              <span>OSL TRANSIT</span>
              <span>● LIVE ROUTE</span>
            </div>
          </div>
          <p className="legend">
            <span>● You</span>
            <span>+ Can ride</span>
            <span>★ Errand</span>
            <span>✓ Done</span>
          </p>
          <p className="connection-note">
            Lines only connect at named stops. No need to return home.
          </p>
          <div className="feedback" aria-live="polite" aria-atomic="true">
            {notice || 'Visit every starred stop within the move budget.'}
          </div>
          {(success || lost) && (
            <section
              className={`result ${success ? 'success' : ''}`}
              aria-live="polite"
              aria-label={success ? 'Your completed ride' : 'Ride ended'}
              tabIndex={-1}
              ref={resultRef}
            >
              <div className="receipt-top">
                <span>
                  ONE STOP LEFT / {isPractice ? 'PRACTICE' : `#${p.id}`}
                </span>
                <span aria-hidden="true">{success ? '✓' : '↶'}</span>
              </div>
              <p className="eyebrow">
                {success ? 'ALL ERRANDS DONE' : 'END OF THE LINE'}
              </p>
              <h2>
                {success ? 'Nice route, conductor.' : 'One detour too many.'}
              </h2>
              <p>
                {success
                  ? `${moves(state)}/${p.budget} moves · Shortest possible: ${minimum}`
                  : `${completed(p, state).length}/${p.errands.length} errands done. Undo or retry — there’s a route that fits.`}
              </p>
              {success && (
                <div className="ride-score">
                  <div>
                    <strong>
                      {moves(state)}
                      <span>/{p.budget}</span>
                    </strong>
                    <small>MOVES USED</small>
                  </div>
                  <div className="score-verdict">
                    <span className="score-stamp">
                      {moves(state) === minimum
                        ? 'SHORTEST ROUTE'
                        : 'ERRANDS COMPLETE'}
                    </span>
                    <p>
                      {moves(state) === minimum
                        ? 'Not a move wasted. Nicely planned.'
                        : `${moves(state) - minimum!} ${moves(state) - minimum! === 1 ? 'move' : 'moves'} off the shortest route. Fancy another ride?`}
                    </p>
                  </div>
                </div>
              )}
              {lost && (
                <p className="loss-tip">
                  Every return trip costs a move too. Try a different errand
                  order.
                </p>
              )}
              {success && isPractice && (
                <button
                  className="primary"
                  onClick={() => {
                    setPractice(false);
                    setNotice('');
                  }}
                >
                  Play today’s puzzle →
                </button>
              )}
              {success && !isPractice && (
                <>
                  <button className="primary" onClick={() => setSharing(true)}>
                    Compare in the Reddit thread ↗
                  </button>
                  {sharing && (
                    <div className="share-panel">
                      <label htmlFor="share">
                        Your spoiler-free result — select and copy:
                      </label>
                      <textarea
                        id="share"
                        readOnly
                        value={text}
                        onFocus={(e) => e.currentTarget.select()}
                      />
                      <button
                        className="copy-button"
                        onClick={() => void copyResult()}
                      >
                        Copy result
                      </button>
                      <p className="copy-status" role="status">
                        {copyStatus}
                      </p>
                      <p>
                        Compare counts, not routes. Use spoiler tags for your
                        stops.
                      </p>
                      {session?.thread ? (
                        <button onClick={() => navigateTo(session.thread!)}>
                          Open discussion →
                        </button>
                      ) : (
                        <p>
                          Thread link becomes available when played on Reddit.
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </section>
          )}
          <nav className="controls action-deck" aria-label="Puzzle controls">
            <button
              disabled={moves(state) === 0}
              onClick={() => update(undo(state))}
            >
              ↶ Undo
            </button>
            <button
              disabled={moves(state) === 0}
              onClick={() => update(initial(p))}
            >
              ↻ Retry
            </button>
            <span>No timer. Take your time.</span>
          </nav>
          {moves(state) > 0 && (
            <details className="journey">
              <summary>
                Your route so far{' '}
                <span>
                  {moves(state)} {moves(state) === 1 ? 'ride' : 'rides'}
                </span>
              </summary>
              <ol aria-label="Your traveled route">
                {state.route.map((id, i) => (
                  <li key={i}>
                    <span className="journey-number">{i}</span>
                    {p.stops.find((s) => s.id === id)!.name}
                    {i === state.route.length - 1 && <strong>YOU</strong>}
                  </li>
                ))}
              </ol>
              <p>
                This is your route, not the solution. Undo takes back the last
                ride.
              </p>
            </details>
          )}
        </>
      )}
      {saving && (
        <p className="save-status" role="status">
          {saving}
        </p>
      )}
      <footer>
        <button
          className="text-button"
          onClick={() => {
            setPractice((v) => !v);
            setNotice('');
            setSharing(false);
          }}
        >
          {isPractice ? '← Back to today' : 'First ride? Try practice'}
        </button>
        <span>New route at 00:00 UTC</span>
      </footer>
      {local && (
        <p className="environment">
          Local preview · Reddit integration is not active
        </p>
      )}
      {session && today > session.date && (
        <p className="rollover">
          You’re finishing {session.date}.{' '}
          <button
            onClick={() => {
              setSession(undefined);
              setReload((v) => v + 1);
              setNotice('');
              setPractice(false);
              setSharing(false);
            }}
          >
            Open today’s puzzle
          </button>
        </p>
      )}
    </main>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
