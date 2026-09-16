import type { OpponentPlayer, Player } from './types';

/** Any player-like shape (user or opponent) usable in a pairing. */
type Pairable = { attribute: 'offensive' | 'defensive'; strength: number };

export interface PairResult {
  /** User goals in this pair (attacker jersey numbers, resolution order). */
  userGoals: number[];
  /** Opponent goals in this pair (count only). */
  opponentGoals: number;
  /** Opponent shots the user's field players failed to block — candidates for GK blocking. */
  unblockedOpponentShots: OpponentPlayer[];
}

/**
 * Resolve one section pair via cross-play:
 *  - `userAttackers` attack `oppDefenders`   -> user goals.
 *  - `oppAttackers` attack `userDefenders`   -> opponent goals (+ unblocked shots).
 *
 * Pairing is 1v1 (each defender blocks at most one attacker). An attacker scores if its
 * strength > the paired defender's strength; surplus attackers score unopposed. The pairing
 * maximizes blocked shots on each side, which minimizes that side's goals; because each
 * team's goal count depends only on its own offense vs the opponent's defense, minimizing
 * both sides independently yields the joint minimum (spec §2). See specs/match-simulation.md.
 */
export function resolvePair(
  userAttackers: Player[],
  oppDefenders: OpponentPlayer[],
  oppAttackers: OpponentPlayer[],
  userDefenders: Player[],
): PairResult {
  const userScoring = scoringAttackers(userAttackers, oppDefenders);
  const oppScoring = scoringAttackers(oppAttackers, userDefenders);

  return {
    userGoals: userScoring.map((p) => p.jerseyNumber),
    opponentGoals: oppScoring.length,
    unblockedOpponentShots: oppScoring,
  };
}

/**
 * Given attackers and the defenders they face, return the attackers that score under the
 * optimal (maximum-blocking) 1v1 pairing.
 *
 * An attacker is blocked iff it can be paired with a defender of strength >= its own.
 * We maximize the number of blocked attackers by sorting both ascending and greedily
 * pairing each attacker with the weakest still-available defender that can beat it
 * (classic interval matching — provably maximizes blocks). The rest score.
 */
function scoringAttackers<A extends Pairable, D extends Pairable>(attackers: A[], defenders: D[]): A[] {
  const att = [...attackers].sort((a, b) => a.strength - b.strength);
  const def = [...defenders].sort((a, b) => a.strength - b.strength);

  const used = new Set<D>();
  const scoring: A[] = [];

  for (const a of att) {
    const idx = def.findIndex((d) => !used.has(d) && d.strength >= a.strength);
    if (idx === -1) {
      scoring.push(a);
    } else {
      used.add(def[idx]);
    }
  }

  return scoring;
}
