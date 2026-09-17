import type { OpponentCard, Team } from '../domain/types';
import { match, type MatchResult } from '../domain/match';
import { validateTeam } from '../domain/validate';

export function resolveMatch(team: Team, opponent: OpponentCard): MatchResult {
  const errors = validateTeam(team);
  if (errors.length > 0) {
    throw new Error(`Invalid team: ${errors[0]}`);
  }
  return match(team, opponent);
}
