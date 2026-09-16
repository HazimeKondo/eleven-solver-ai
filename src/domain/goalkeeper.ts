import type { Goalkeeper, OpponentPlayer } from './types';

/**
 * Apply goalkeeper blocking to a list of unblocked opponent shots.
 *
 * A shot is blocked if the GK's strength >= the attacker's strength and a glove remains.
 * Each block consumes one glove; repeatable up to the glove count (spec §3).
 * Returns the number of shots blocked.
 */
export function applyGoalkeeper(gk: Goalkeeper, unblockedShots: OpponentPlayer[]): number {
  let gloves = gk.gloves;
  let blocked = 0;

  // Block the strongest eligible shots first so weak gloves are not wasted on easy shots.
  const eligible = [...unblockedShots]
    .filter((s) => gk.strength >= s.strength)
    .sort((a, b) => b.strength - a.strength);

  for (let i = 0; i < eligible.length && gloves > 0; i++) {
    gloves -= 1;
    blocked += 1;
  }

  return blocked;
}
