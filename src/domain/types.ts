/** Core domain types for the Eleven match simulation. See specs/match-simulation.md. */

export type Attribute = 'offensive' | 'defensive';

export interface Player {
  /** Jersey number, unique within a team. */
  jerseyNumber: number;
  attribute: Attribute;
  /** Minimum 1. */
  strength: number;
}

/** An opponent-card player omits the jersey number (see spec §4). */
export type OpponentPlayer = Omit<Player, 'jerseyNumber'>;

export interface Goalkeeper {
  /** Number of shots this GK can block. */
  gloves: number;
  /** Minimum 1. */
  strength: number;
}

export type SectionId = 'LW' | 'RW' | 'CD' | 'CM' | 'CF';

/** A single grid cell in the pitch. Holds an ordered list of players. */
export interface Zone<P extends { attribute: Attribute; strength: number } = Player> {
  id: string;
  section: SectionId;
  /** Ordered occupants. Central zones cap at 3, wing zones cap at 1 (enforced by Team). */
  players: P[];
}

/** A named group of zones on the pitch. */
export interface Section<P extends { attribute: Attribute; strength: number } = Player> {
  id: SectionId;
  zones: Zone<P>[];
}

/** The full 3x3 pitch (9 zones, 5 sections). */
export interface Pitch<P extends { attribute: Attribute; strength: number } = Player> {
  sections: Record<SectionId, Section<P>>;
}

export interface Team {
  /** Exactly 10 field players. */
  players: Player[];
  goalkeeper: Goalkeeper;
  pitch: Pitch<Player>;
}

/** An opponent with a fixed placement; its pitch is rotated 180deg vs the user's. */
export interface OpponentCard {
  /** Club this card belongs to (a club may have multiple cards). */
  clubName: string;
  /** Division of this card; (clubName, division) uniquely identifies a card. */
  division: string;
  /** Opponent players omit jersey numbers (see spec §4). */
  players: OpponentPlayer[];
  goalkeeper: Goalkeeper;
  pitch: Pitch<OpponentPlayer>;
}
