import { describe, expect, it } from 'vitest';
import { match } from './match';
import { makeCard, makeTeam, player, withGoalkeeper } from './helpers';

describe('match', () => {
  it('produces user goals with jersey numbers and opponent goal count', () => {
    const team = makeTeam({ CF: [player(7, 'offensive', 9)] });
    const opp = makeCard('Test Club', 'Division 1', { CD: [{ attribute: 'defensive', strength: 2 }] });
    const r = match(team, opp);
    expect(r.userGoals).toEqual([7]);
    expect(r.opponentGoals).toBe(0);
  });

  it('applies goalkeeper blocking to reduce opponent goals', () => {
    const team = withGoalkeeper(makeTeam({ CD: [player(4, 'defensive', 2)] }), { gloves: 1, strength: 9 });
    const opp = makeCard('Test Club', 'Division 1', { CF: [{ attribute: 'offensive', strength: 8 }] });
    const r = match(team, opp);
    // Opponent scores 1 (8 > 2), then GK blocks it (9 >= 8, 1 glove).
    expect(r.opponentGoals).toBe(0);
  });

  it('resolves all five section pairs', () => {
    const team = makeTeam({
      LW: [player(1, 'offensive', 9)],
      RW: [player(2, 'offensive', 9)],
      CF: [player(3, 'offensive', 9)],
      CM: [player(4, 'offensive', 9)],
      CD: [player(5, 'offensive', 9)],
    });
    const opp = makeCard('Test Club', 'Division 1', {
      RW: [{ attribute: 'defensive', strength: 1 }],
      LW: [{ attribute: 'defensive', strength: 1 }],
      CD: [{ attribute: 'defensive', strength: 1 }],
      CM: [{ attribute: 'defensive', strength: 1 }],
      CF: [{ attribute: 'defensive', strength: 1 }],
    });
    const r = match(team, opp);
    expect(r.userGoals).toHaveLength(5);
    expect(r.opponentGoals).toBe(0);
  });
});
