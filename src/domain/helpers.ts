import type { Goalkeeper, OpponentCard, OpponentPlayer, Pitch, Player, SectionId, Team } from './types';

export function player(jerseyNumber: number, attribute: Player['attribute'], strength: number): Player {
  return { jerseyNumber, attribute, strength };
}

export function withGoalkeeper(team: Team, gk: Goalkeeper): Team {
  return { ...team, goalkeeper: gk };
}

const ALL_SECTIONS: SectionId[] = ['LW', 'RW', 'CD', 'CM', 'CF'];

/** Build a minimal Team whose pitch places the given players into each section (single zone per section). */
export function makeTeam(sections: Partial<Record<SectionId, Player[]>>): Team {
  const sectionsMap = {} as Pitch['sections'];
  for (const id of ALL_SECTIONS) {
    const players = sections[id] ?? [];
    sectionsMap[id] = { id, zones: [{ id: `${id}-z`, section: id, players }] };
  }
  return {
    players: Object.values(sections).flat(),
    goalkeeper: { gloves: 0, strength: 1 },
    pitch: { sections: sectionsMap },
  };
}

/** Build a minimal OpponentCard whose pitch places the given players into each section (single zone per section). */
export function makeCard(
  clubName: string,
  division: string,
  sections: Partial<Record<SectionId, OpponentPlayer[]>>,
  goalkeeper: Goalkeeper = { gloves: 0, strength: 1 },
): OpponentCard {
  const sectionsMap = {} as Pitch<OpponentPlayer>['sections'];
  for (const id of ALL_SECTIONS) {
    const players = sections[id] ?? [];
    sectionsMap[id] = { id, zones: [{ id: `${id}-z`, section: id, players }] };
  }
  return {
    clubName,
    division,
    goalkeeper,
    players: Object.values(sections).flat(),
    pitch: { sections: sectionsMap },
  };
}
