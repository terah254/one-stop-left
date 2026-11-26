export type Stop = { id: string; name: string; x: number; y: number };
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';
export type Puzzle = {
  id: string;
  title: string;
  difficulty: Difficulty;
  stops: Stop[];
  edges: [string, string][];
  start: string;
  errands: string[];
  budget: number;
  note: string;
};
export type State = { route: string[] };
export const initial = (p: Puzzle): State => ({ route: [p.start] });
export const current = (s: State) => s.route[s.route.length - 1]!;
export const neighbors = (p: Puzzle, id: string): string[] =>
  p.edges.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : []));
export const completed = (p: Puzzle, s: State) =>
  p.errands.filter((id) => s.route.includes(id));
export const won = (p: Puzzle, s: State) =>
  completed(p, s).length === p.errands.length;
export const moves = (s: State) => s.route.length - 1;
export const move = (p: Puzzle, s: State, to: string): State =>
  won(p, s) || moves(s) >= p.budget || !neighbors(p, current(s)).includes(to)
    ? s
    : { route: [...s.route, to] };
export const undo = (s: State): State =>
  s.route.length > 1 ? { route: s.route.slice(0, -1) } : s;
export const restore = (p: Puzzle, value: unknown): State | undefined => {
  if (
    !Array.isArray(value) ||
    value[0] !== p.start ||
    value.length > p.budget + 1
  )
    return;
  let s = initial(p);
  for (const id of value.slice(1)) {
    if (typeof id !== 'string') return;
    const next = move(p, s, id);
    if (next === s) return;
    s = next;
  }
  return s;
};
export const utcDate = (date = new Date()) => date.toISOString().slice(0, 10);
export const shareText = (p: Puzzle, s: State, date: string) =>
  `One Stop Left #${p.id} · ${date} · ${p.difficulty} · ${moves(s)}/${p.budget} moves · All ${p.errands.length} errands done. Can you do it in fewer?`;
