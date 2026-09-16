import { describe, expect, it } from 'vitest';
import { OPPONENT_POOL } from './opponents';
import { match } from './match';
import { makeTeam, player } from './helpers';

describe('OPPONENT_POOL', () => {
  it('has at least one card with clubName and division', () => {
    expect(OPPONENT_POOL.length).toBeGreaterThanOrEqual(1);
    const [card] = OPPONENT_POOL;
    expect(card.clubName).toBeTruthy();
    expect(card.division).toBeTruthy();
  });

  it('cards are usable as the opponent in match()', () => {
    const [card] = OPPONENT_POOL;
    const user = makeTeam({ CF: [player(7, 'offensive', 9)] });
    const r = match(user, card);
    expect(Array.isArray(r.userGoals)).toBe(true);
    expect(typeof r.opponentGoals).toBe('number');
  });
});
