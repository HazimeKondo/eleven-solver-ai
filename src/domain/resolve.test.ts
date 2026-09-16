import { describe, expect, it } from 'vitest';
import { resolvePair } from './resolve';
import { player } from './helpers';

describe('resolvePair', () => {
  it('scores when attacker is stronger than defender', () => {
    const r = resolvePair([player(1, 'offensive', 5)], [player(9, 'defensive', 3)], [], []);
    expect(r.userGoals).toEqual([1]);
    expect(r.opponentGoals).toBe(0);
  });

  it('blocks when defender is at least as strong as attacker', () => {
    const r = resolvePair([player(1, 'offensive', 3)], [player(9, 'defensive', 3)], [], []);
    expect(r.userGoals).toEqual([]);
    expect(r.opponentGoals).toBe(0);
  });

  it('surplus attackers score unopposed when defenders are too weak to block all', () => {
    // One defender (strength 5) can block only the weaker attacker (4); the stronger (9) scores.
    const r = resolvePair(
      [player(1, 'offensive', 9), player(2, 'offensive', 4)],
      [player(9, 'defensive', 5)],
      [],
      [],
    );
    expect(r.userGoals).toEqual([1]);
  });

  it('a single defender blocks only one attacker (1v1), the other scores', () => {
    // Defender strength 10 can block either attacker; optimal pairing blocks one, the other scores.
    const r = resolvePair(
      [player(1, 'offensive', 9), player(2, 'offensive', 8)],
      [player(9, 'defensive', 10)],
      [],
      [],
    );
    expect(r.userGoals.length).toBe(1);
  });

  it('maximizes blocks via optimal pairing (greedy interval matching)', () => {
    // Two attackers (5, 6), two defenders (4, 7). Optimal: pair 5->7(block), 6->4(score) => 1 goal.
    // Naive pairing 5->4(score), 6->7(block) also 1 goal; both optimal here.
    const r = resolvePair(
      [player(1, 'offensive', 5), player(2, 'offensive', 6)],
      [player(9, 'defensive', 4), player(8, 'defensive', 7)],
      [],
      [],
    );
    expect(r.userGoals.length).toBe(1);
  });

  it('computes both sides independently (cross-play)', () => {
    const r = resolvePair(
      [player(1, 'offensive', 5)], // user attacks
      [player(9, 'defensive', 3)], // opp defense -> user scores
      [player(20, 'offensive', 4)], // opp attacks
      [player(8, 'defensive', 6)], // user defense -> blocks opp
    );
    expect(r.userGoals).toEqual([1]);
    expect(r.opponentGoals).toBe(0);
  });

  it('tracks unblocked opponent shots for the goalkeeper', () => {
    const r = resolvePair([], [], [player(20, 'offensive', 9)], [player(8, 'defensive', 3)]);
    expect(r.opponentGoals).toBe(1);
    expect(r.unblockedOpponentShots.map((p) => p.strength)).toEqual([9]);
  });
});
