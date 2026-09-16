import type { Goalkeeper, Player, Team } from './types';

export const FIELD_PLAYER_COUNT = 10;
const CENTRAL_MAX_PER_ZONE = 3;
const WING_MAX_PER_ZONE = 1;

const CENTRAL_SECTIONS = new Set(['CD', 'CM', 'CF']);
const WING_SECTIONS = new Set(['LW', 'RW']);

/** A zone is valid if its occupant count respects the cap for its section type. */
function zoneCountError(section: string, count: number): string | null {
  if (CENTRAL_SECTIONS.has(section)) {
    return count > CENTRAL_MAX_PER_ZONE ? `central zone has ${count} players (max ${CENTRAL_MAX_PER_ZONE})` : null;
  }
  if (WING_SECTIONS.has(section)) {
    return count > WING_MAX_PER_ZONE ? `wing zone has ${count} players (max ${WING_MAX_PER_ZONE})` : null;
  }
  return `unknown section "${section}"`;
}

/** Validate a goalkeeper's field constraints. */
function validateGoalkeeper(gk: Goalkeeper): string[] {
  const errors: string[] = [];
  if (!Number.isInteger(gk.strength) || gk.strength < 1) {
    errors.push(`goalkeeper strength must be an integer >= 1 (got ${gk.strength})`);
  }
  if (!Number.isInteger(gk.gloves) || gk.gloves < 0) {
    errors.push(`goalkeeper gloves must be an integer >= 0 (got ${gk.gloves})`);
  }
  return errors;
}

/** Validate a single player's field constraints. */
function validatePlayer(p: Player): string[] {
  const errors: string[] = [];
  if (!Number.isInteger(p.jerseyNumber) || p.jerseyNumber < 1) {
    errors.push(`jersey number must be an integer >= 1 (got ${p.jerseyNumber})`);
  }
  if (p.attribute !== 'offensive' && p.attribute !== 'defensive') {
    errors.push(`attribute must be "offensive" or "defensive" (got "${p.attribute}")`);
  }
  if (!Number.isInteger(p.strength) || p.strength < 1) {
    errors.push(`player strength must be an integer >= 1 (got ${p.strength})`);
  }
  return errors;
}

/**
 * Validate a Team against the rules in specs/match-simulation.md §1.
 * Returns a list of human-readable violation messages; an empty list means the team is valid.
 */
export function validateTeam(team: Team): string[] {
  const errors: string[] = [];

  // Exactly 10 field players.
  if (team.players.length !== FIELD_PLAYER_COUNT) {
    errors.push(`team must have exactly ${FIELD_PLAYER_COUNT} field players (got ${team.players.length})`);
  }

  // Jersey numbers unique within the team.
  const seen = new Map<number, number>();
  for (const p of team.players) {
    seen.set(p.jerseyNumber, (seen.get(p.jerseyNumber) ?? 0) + 1);
  }
  for (const [num, count] of seen) {
    if (count > 1) errors.push(`jersey number ${num} is used ${count} times`);
  }

  // Per-player field constraints.
  for (const p of team.players) {
    errors.push(...validatePlayer(p));
  }

  // Goalkeeper.
  errors.push(...validateGoalkeeper(team.goalkeeper));

  // Zone occupancy caps, derived from the pitch (source of truth for placement).
  const placedCount = new Map<number, number>();
  let placedTotal = 0;
  for (const section of Object.values(team.pitch.sections)) {
    for (const zone of section.zones) {
      const count = zone.players.length;
      const err = zoneCountError(section.id, count);
      if (err) errors.push(`section ${section.id}: ${err}`);
      placedTotal += count;
      for (const p of zone.players) {
        placedCount.set(p.jerseyNumber, (placedCount.get(p.jerseyNumber) ?? 0) + 1);
      }
    }
  }

  // The pitch placement must account for exactly the team's field players.
  if (placedTotal !== team.players.length) {
    errors.push(`pitch places ${placedTotal} players but team has ${team.players.length}`);
  }
  for (const [num, count] of placedCount) {
    if (count > 1) errors.push(`player ${num} is placed in multiple zones`);
  }

  return errors;
}
