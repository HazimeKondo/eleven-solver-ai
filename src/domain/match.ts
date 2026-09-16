import type { OpponentCard, OpponentPlayer, Team } from './types';
import { sectionPlayers } from './section';
import { resolvePair } from './resolve';
import { applyGoalkeeper } from './goalkeeper';

export interface MatchResult {
  /** Each user goal records which player scored it (jersey number), in resolution order. */
  userGoals: number[];
  /** Opponent goals are a count only (opponent players omit jersey numbers). */
  opponentGoals: number;
}

/** The 5 section pairs, in resolution order (spec §2). */
const PAIRS: [keyof Team['pitch']['sections'], keyof OpponentCard['pitch']['sections']][] = [
  ['LW', 'RW'],
  ['RW', 'LW'],
  ['CF', 'CD'],
  ['CM', 'CM'],
  ['CD', 'CF'],
];

type Pairable = { attribute: 'offensive' | 'defensive'; strength: number };
function offense<P extends Pairable>(players: P[]): P[] {
  return players.filter((p) => p.attribute === 'offensive');
}
function defense<P extends Pairable>(players: P[]): P[] {
  return players.filter((p) => p.attribute === 'defensive');
}

/** Resolve a full match between the user's team and an opponent card. */
export function match(team: Team, opponent: OpponentCard): MatchResult {
  let userGoals: number[] = [];
  let opponentGoals = 0;
  const unblockedShots: OpponentPlayer[] = [];

  for (const [userSec, oppSec] of PAIRS) {
    const result = resolvePair(
      offense(sectionPlayers(team.pitch, userSec)),
      defense(sectionPlayers(opponent.pitch, oppSec)),
      offense(sectionPlayers(opponent.pitch, oppSec)),
      defense(sectionPlayers(team.pitch, userSec)),
    );
    userGoals = [...userGoals, ...result.userGoals];
    opponentGoals += result.opponentGoals;
    unblockedShots.push(...result.unblockedOpponentShots);
  }

  const gkBlocked = applyGoalkeeper(team.goalkeeper, unblockedShots);
  opponentGoals -= gkBlocked;

  return { userGoals, opponentGoals: Math.max(0, opponentGoals) };
}
