import type { Pitch, SectionId } from './types';

/** All players in a section, in zone order (zones ordered as declared on the pitch). */
export function sectionPlayers<P extends { attribute: 'offensive' | 'defensive'; strength: number }>(
  pitch: Pitch<P>,
  id: SectionId,
): P[] {
  return pitch.sections[id].zones.flatMap((z) => z.players);
}
