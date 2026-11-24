import { puzzles, original, SCHEDULE_START } from '../src/shared/puzzles.ts';
import { solve, validate } from '../src/shared/solver.ts';

for (const [i, p] of puzzles.entries()) {
  const date = new Date(Date.parse(SCHEDULE_START) + i * 86400000)
    .toISOString()
    .slice(0, 10);
  console.log(
    `${date} #${p.id} ${p.title}: ${validate(p)}/${p.budget} · ${solve(p)?.join(' → ')}\n  ${p.note}`
  );
}
console.log(
  'Original:',
  validate(original),
  'Market-first:',
  solve(original, 'M')!.length - 1,
  'Junction-first:',
  solve(original, 'J')!.length - 1
);
console.log(
  'Revised:',
  'Market-first:',
  solve(puzzles[0]!, 'M')!.length - 1,
  'Junction-first:',
  solve(puzzles[0]!, 'J')!.length - 1
);
console.log(
  `Coverage: ${SCHEDULE_START} through ${new Date(Date.parse(SCHEDULE_START) + (puzzles.length - 1) * 86400000).toISOString().slice(0, 10)} inclusive. No cycling.`
);
