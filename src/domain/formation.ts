export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface Player {
  id: string;
  name: string;
  offensive: number;
  defensive: number;
}

/**
 * A formation maps a set of formation slots to the players occupying them.
 * Pure data + rules only — no I/O, no framework imports.
 */
export interface Formation {
  slots: Slot[];
}

export interface Slot {
  id: string;
  position: Position;
  playerId: string | null;
}

/** Returns the players currently placed on the field (non-null slots). */
export function fieldPlayers(formation: Formation, roster: Player[]): Player[] {
  const byId = new Map(roster.map((p) => [p.id, p]));
  return formation.slots
    .map((s) => s.playerId)
    .filter((id): id is string => id !== null)
    .map((id) => byId.get(id))
    .filter((p): p is Player => p !== undefined);
}

/** Returns the players on the bench (in roster but not placed on the field). */
export function benchPlayers(formation: Formation, roster: Player[]): Player[] {
  const onField = new Set(fieldPlayers(formation, roster).map((p) => p.id));
  return roster.filter((p) => !onField.has(p.id));
}
