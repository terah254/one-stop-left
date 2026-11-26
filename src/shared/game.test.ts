import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  completed,
  initial,
  move,
  moves,
  neighbors,
  restore,
  undo,
  utcDate,
  won,
  shareText,
} from './game.ts';
import { original, practice, puzzles, scheduled } from './puzzles.ts';
import { solve, validate } from './solver.ts';

void describe('route rules', () => {
  const p = puzzles[0]!;
  void it('allows only adjacent moves and ignores the current stop', () => {
    const s = initial(p);
    assert.equal(move(p, s, 'C'), s);
    assert.equal(move(p, s, 'T'), s);
    assert.equal(move(p, s, 'unknown'), s);
    assert.deepEqual(move(p, s, 'M').route, ['T', 'M']);
  });
  void it('undo restores position, move count, and errand completion exactly', () => {
    const before = move(p, initial(p), 'J');
    const after = move(p, before, 'L');
    assert.deepEqual(completed(p, after), ['L']);
    assert.deepEqual(undo(after), before);
    assert.deepEqual(completed(p, undo(after)), []);
    const revisited = restore(p, ['T', 'M', 'T', 'M'])!;
    assert.deepEqual(completed(p, undo(revisited)), ['M']);
    assert.equal(moves(undo(revisited)), 2);
    assert.deepEqual(undo(initial(p)), initial(p));
  });
  void it('supports an exact-budget win and blocks further travel', () => {
    const s = restore(p, solve(p))!;
    assert.ok(won(p, s));
    assert.equal(moves(s), 6);
    assert.equal(move(p, s, neighbors(p, s.route.at(-1)!)[0]!), s);
  });
  void it('supports early wins, including practice', () => {
    const s = restore(practice, solve(practice))!;
    assert.ok(won(practice, s));
    assert.equal(moves(s), 2);
    assert.equal(move(practice, s, 'M'), s);
    assert.equal(won(practice, undo(s)), false);
  });
  void it('runs out of moves, supports undo rescue and resets for retry', () => {
    const s = restore(p, ['T', 'M', 'T', 'M', 'T', 'M', 'T'])!;
    assert.equal(moves(s), 6);
    assert.equal(won(p, s), false);
    assert.equal(move(p, s, 'J'), s);
    assert.deepEqual(move(p, undo(s), 'D').route, [
      'T',
      'M',
      'T',
      'M',
      'T',
      'M',
      'D',
    ]);
    assert.deepEqual(initial(p), { route: ['T'] });
  });
  void it('rejects corrupt, invalid, oversized and post-win saved routes', () => {
    for (const bad of [
      null,
      {},
      [],
      ['C'],
      ['T', 'L'],
      ['T', 3],
      Array(20).fill('T'),
    ])
      assert.equal(restore(p, bad), undefined);
    assert.equal(restore(practice, ['T', 'M', 'L', 'M']), undefined);
  });
  void it('share text never contains a route', () => {
    const text = shareText(p, restore(p, solve(p))!, '2026-12-07');
    assert.match(text, /6\/6 moves/);
    for (const stop of p.stops) assert.ok(!text.includes(stop.name));
  });
});

void describe('daily content and solver', () => {
  void it('validates every authored map and enumerates all legal play paths', () => {
    for (const p of [...puzzles, practice]) {
      const minimum = validate(p);
      const queue = [initial(p)];
      let actualMinimum = Infinity;
      for (let i = 0; i < queue.length; i++) {
        const s = queue[i]!;
        if (won(p, s)) {
          actualMinimum = Math.min(actualMinimum, moves(s));
          continue;
        }
        if (moves(s) === p.budget) continue;
        for (const id of neighbors(p, s.route.at(-1)!)) {
          const next = move(p, s, id);
          assert.equal(moves(next), moves(s) + 1);
          assert.deepEqual(undo(next), s);
          assert.deepEqual(restore(p, next.route), next);
          queue.push(next);
        }
      }
      assert.equal(actualMinimum, minimum, p.id);
    }
  });
  void it('records the original design mismatch and validates the corrected temptation', () => {
    assert.equal(solve(original, 'M')!.length - 1, 5);
    assert.equal(solve(original, 'J')!.length - 1, 7);
    assert.equal(solve(puzzles[0]!, 'M')!.length - 1, 7);
    assert.equal(solve(puzzles[0]!, 'J')!.length - 1, 6);
  });
  void it('rejects broken maps and unreachable errands', () => {
    assert.throws(() =>
      validate({ ...original, edges: [...original.edges, ['T', 'T']] })
    );
    assert.throws(() =>
      validate({ ...original, edges: [...original.edges, ['M', 'T']] })
    );
    assert.throws(() => validate({ ...original, edges: [['T', 'M']] }));
    assert.throws(() => validate({ ...original, budget: 1 }));
    assert.equal(solve({ ...original, edges: [['T', 'M']] }), undefined);
  });
  void it('has twenty-four unique authored edge/errand/start combinations', () => {
    assert.equal(puzzles.length, 24);
    assert.equal(new Set(puzzles.map((p) => p.id)).size, 24);
    assert.equal(
      new Set(
        puzzles.map((p) =>
          JSON.stringify([
            p.start,
            [...p.errands].sort(),
            p.edges.map((e) => [...e].sort().join('')).sort(),
          ])
        )
      ).size,
      24
    );
    for (const [index, p] of puzzles.entries()) {
      assert.equal(p.errands.length, index < 14 ? 3 : 4);
      if (index < 14) assert.equal(p.budget, 6);
      else assert.ok(p.budget === 7 || p.budget === 8);
      for (const [a, b] of p.edges) {
        const from = p.stops.find((s) => s.id === a)!;
        const to = p.stops.find((s) => s.id === b)!;
        const dx = to.x - from.x,
          dy = to.y - from.y;
        const lengthSquared = dx * dx + dy * dy;
        for (const stop of p.stops.filter((s) => s.id !== a && s.id !== b)) {
          const along =
            ((stop.x - from.x) * dx + (stop.y - from.y) * dy) / lengthSquared;
          if (along > 0 && along < 1) {
            const distance =
              Math.abs((stop.x - from.x) * dy - (stop.y - from.y) * dx) /
              Math.sqrt(lengthSquared);
            assert.ok(
              distance >= 35,
              `${p.id}: ${a}-${b} passes through ${stop.name}`
            );
          }
        }
      }
    }
  });
  void it('makes every challenge exact-budget with a losing first-move trap', () => {
    for (const p of puzzles.slice(14)) {
      assert.equal(validate(p), p.budget, p.id);
      const firstMoveLengths = neighbors(p, p.start).map(
        (id) => solve(p, id)!.length - 1
      );
      assert.ok(firstMoveLengths.some((length) => length === p.budget), p.id);
      assert.ok(firstMoveLengths.some((length) => length > p.budget), p.id);
      assert.equal(
        p.difficulty,
        p.budget === 8 ? 'Expert' : 'Hard',
        p.id
      );
    }
  });
  void it('covers every UTC day from launch through December 30 without repeats', () => {
    const seen = new Set<string>();
    for (let day = 7; day <= 30; day++) {
      const p = scheduled(`2026-12-${String(day).padStart(2, '0')}`)!;
      assert.ok(p);
      assert.ok(!seen.has(p.id));
      seen.add(p.id);
    }
    assert.equal(scheduled('2026-12-31'), undefined);
    assert.equal(scheduled('2026-11-23')?.id, '001');
  });
  void it('uses UTC, changes identity at midnight, and keeps an already-selected puzzle', () => {
    const before = utcDate(new Date('2026-12-08T02:59:59+03:00'));
    const after = utcDate(new Date('2026-12-08T03:00:00+03:00'));
    assert.equal(before, '2026-12-07');
    assert.equal(after, '2026-12-08');
    const old = scheduled(before)!;
    const finished = restore(old, solve(old))!;
    assert.ok(won(old, finished));
    const today = scheduled(after)!;
    assert.notEqual(old.id, today.id);
    assert.equal(old.id, '001');
    assert.equal(won(today, initial(today)), false);
  });
});
