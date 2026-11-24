import type { Puzzle } from './game.ts';
import { neighbors } from './game.ts';

// Breadth-first search on (current stop, completed-errand bitmask).
export const solve = (p: Puzzle, first?: string): string[] | undefined => {
  const bit = (id: string) => {
    const i = p.errands.indexOf(id);
    return i < 0 ? 0 : 1 << i;
  };
  const goal = (1 << p.errands.length) - 1;
  if (first && !neighbors(p, p.start).includes(first)) return;
  const path = first ? [p.start, first] : [p.start];
  const queue = [
    {
      at: first ?? p.start,
      mask: path.reduce((m, id) => m | bit(id), 0),
      path,
    },
  ];
  const seen = new Set<string>();
  for (let i = 0; i < queue.length; i++) {
    const entry = queue[i]!;
    if (entry.mask === goal) return entry.path;
    const key = `${entry.at}:${entry.mask}`;
    if (seen.has(key)) continue;
    seen.add(key);
    for (const next of neighbors(p, entry.at)) {
      queue.push({
        at: next,
        mask: entry.mask | bit(next),
        path: [...entry.path, next],
      });
    }
  }
};
export const validate = (p: Puzzle): number => {
  if (!Number.isInteger(p.budget) || p.budget < 1)
    throw new Error(`${p.id}: invalid budget`);
  if (p.errands.length < 1 || p.errands.length > 30)
    throw new Error(`${p.id}: invalid errand count`);
  const ids = new Set(p.stops.map((s) => s.id));
  if (ids.size !== p.stops.length || !ids.has(p.start))
    throw new Error(`${p.id}: invalid stops`);
  if (
    p.stops.some(
      (s) =>
        !s.id ||
        !s.name ||
        !Number.isFinite(s.x) ||
        !Number.isFinite(s.y) ||
        s.x < 40 ||
        s.x > 320 ||
        s.y < 40 ||
        s.y > 320
    )
  )
    throw new Error(`${p.id}: invalid layout`);
  if (
    new Set(p.errands).size !== p.errands.length ||
    p.errands.some((id) => !ids.has(id))
  )
    throw new Error(`${p.id}: invalid errands`);
  const edges = new Set<string>();
  for (const [a, b] of p.edges) {
    const key = [a, b].sort().join('-');
    if (a === b || !ids.has(a) || !ids.has(b) || edges.has(key))
      throw new Error(`${p.id}: invalid edge`);
    edges.add(key);
  }
  const reached = new Set([p.start]);
  for (const at of reached)
    for (const next of neighbors(p, at)) reached.add(next);
  if (reached.size !== ids.size) throw new Error(`${p.id}: disconnected map`);
  const route = solve(p);
  if (!route || route.length - 1 > p.budget)
    throw new Error(`${p.id}: unsolvable within budget`);
  return route.length - 1;
};
