import type { Puzzle, Stop } from './game.ts';

const names: Record<string, string> = {
  T: 'Terminus',
  M: 'Market',
  C: 'Clinic',
  L: 'Library',
  J: 'Junction',
  D: 'Depot',
  P: 'Park',
  B: 'Bridge',
  H: 'Hill',
};
const make = (
  id: string,
  title: string,
  layout: string,
  edges: string,
  errands: string,
  note: string
): Puzzle => ({
  id,
  title,
  start: 'T',
  budget: 6,
  note,
  stops: layout.split(' ').map((part) => {
    const [id, x, y] = part.split(':');
    return { id: id!, name: names[id!]!, x: Number(x), y: Number(y) };
  }),
  edges: edges.split(' ').map((pair) => [pair[0]!, pair[1]!]),
  errands: errands.split(''),
});

// Original supplied map retained as a solver regression, not scheduled.
export const original = make(
  'original',
  'Original brief',
  'T:60:55 M:180:55 C:180:180 L:300:300 J:60:180 D:60:300 P:300:180',
  'TM TJ MC JC JD DL CP',
  'MCL',
  'Market first is actually optimal in the original graph.'
);

export const puzzles: Puzzle[] = [
  make(
    '001',
    'The Market temptation',
    'T:60:55 M:180:55 D:300:55 J:60:180 C:300:180 L:60:305 P:300:305',
    'TM TJ MJ MD CD CP LJ',
    'MCL',
    'Market first requires 7 and fails the budget; Junction first finishes in 6. Clear the Library spur before crossing town.'
  ),
  make(
    '002',
    'Along the line',
    'T:60:55 M:180:55 J:300:55 C:300:180 L:180:305 D:60:305 P:60:180',
    'TM MJ JC CL LD DP PT',
    'MCL',
    'An onboarding ring: compare the two directions before committing.'
  ),
  make(
    '003',
    'Return ticket',
    'T:60:55 J:180:55 M:300:55 C:180:180 D:60:180 L:60:305 P:300:180',
    'TJ JM JC CD DL CP',
    'MCL',
    'Market is a spur: clear it before committing to the long Library branch.'
  ),
  make(
    '004',
    'Across the yard',
    'T:60:55 M:180:55 C:300:55 J:60:180 D:180:180 L:300:180 P:180:305',
    'TM MC TJ JD DL CL DP',
    'MCL',
    'Two corridors connect at Library. The lower corridor initially avoids every errand.'
  ),
  make(
    '005',
    'Two bridges',
    'T:60:55 J:180:55 M:300:55 D:60:180 C:180:180 L:300:180 P:60:305',
    'TJ JM TD DC CL MC JP PL',
    'MCL',
    'A diagonal bridge looks direct but the three errands live on the eastern loop.'
  ),
  make(
    '006',
    'The long way home',
    'T:60:55 M:180:55 L:300:55 J:60:180 C:180:180 D:300:180 P:180:305',
    'TM TJ MC CD DL ML CP JP',
    'MCL',
    'Market links two errands, so choose which branch to finish on.'
  ),
  make(
    '007',
    'Branch office',
    'T:180:55 J:180:180 M:60:180 C:300:180 L:180:305 P:60:305 D:300:305',
    'TJ JM JC JL MP LD DC',
    'MCL',
    'Three arms require deliberate backtracking; the outer bypass consumes an extra move.'
  ),
  make(
    '008',
    'Park and ride',
    'T:60:55 J:180:55 M:300:55 P:60:180 C:180:180 D:300:180 L:180:305',
    'TJ JM TP PC CD DM CL PL',
    'MCL',
    'Park offers a second approach to Library; Market is at the opposite end.'
  ),
  make(
    '009',
    'Cross-town',
    'T:60:55 M:180:55 J:300:55 C:60:180 D:180:180 L:300:180 P:180:305',
    'TM MJ TC CD DJ JL DP PL',
    'MCL',
    'Clinic and Market compete for the first move; use the middle connector.'
  ),
  make(
    '010',
    'One more transfer',
    'T:60:55 J:180:55 C:300:55 M:60:180 D:180:180 L:300:180 P:180:305',
    'TJ JC TM MD DC DL MP PL',
    'MCL',
    'A tempting outer detour competes with a transfer through Depot.'
  ),
  make(
    '011',
    'End of the line',
    'T:60:55 J:180:55 M:300:55 P:60:180 D:180:180 C:300:180 L:180:305',
    'TJ JM JP PD DC CM DL',
    'MCL',
    'Library is the terminal branch; visiting it too soon adds a return trip.'
  ),
  make(
    '012',
    'Three corners',
    'T:180:55 M:60:55 C:300:55 J:60:180 D:180:180 P:300:180 L:180:305',
    'TM TC MJ JD DP PC DL JL LP',
    'MCL',
    'A wide perimeter versus the central transfer: finish at a corner.'
  ),
  make(
    '013',
    'Bridge market',
    'T:60:55 J:180:55 C:300:55 M:60:180 B:180:180 D:300:180 P:60:305 L:180:305',
    'TJ JC TM MB BC BD DL MP PL',
    'MCL',
    'Eight stops introduce a bridge with two ways to approach Library.'
  ),
  make(
    '014',
    'Last connection',
    'T:60:55 M:180:55 J:300:55 D:60:180 C:180:180 B:300:180 P:60:305 H:180:305 L:300:305',
    'TM MJ TD DC CB BJ DP PH HL BL CH',
    'MCL',
    'Nine stops: the hillside route looks scenic but the eastern connection is shorter.'
  ),
];

export const practice: Puzzle = {
  id: 'practice',
  title: 'Your first ride',
  start: 'T',
  budget: 3,
  stops: [
    { id: 'T', name: 'Terminus', x: 60, y: 130 },
    { id: 'M', name: 'Market', x: 180, y: 130 },
    { id: 'L', name: 'Library', x: 300, y: 130 },
  ] satisfies Stop[],
  edges: [
    ['T', 'M'],
    ['M', 'L'],
  ],
  errands: ['M', 'L'],
  note: 'Tap Market, the connected stop with a star.',
};
export const SCHEDULE_START = '2026-12-07';
export const scheduled = (date: string): Puzzle | undefined => {
  const offset = Math.floor(
    (Date.parse(`${date}T00:00:00Z`) -
      Date.parse(`${SCHEDULE_START}T00:00:00Z`)) /
      86400000
  );
  // Pre-launch preview is explicitly labelled, never cycles the actual calendar.
  return offset < 0 ? puzzles[0] : puzzles[offset];
};
