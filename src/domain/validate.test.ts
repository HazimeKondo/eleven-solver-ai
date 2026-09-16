import { describe, expect, it } from 'vitest';
import type { Player, Team } from './types';
import { validateTeam } from './validate';

/** A valid 10-player team: CD/CM/CF = 3 each (9), LW = 1. */
function validTeam(): Team {
  const players: Player[] = [];
  let n = 1;
  for (let s = 0; s < 3; s++) {
    for (let i = 0; i < 3; i++) {
      players.push({ jerseyNumber: n++, attribute: 'defensive', strength: 5 });
    }
  }
  players.push({ jerseyNumber: n, attribute: 'offensive', strength: 7 });
  return {
    players,
    goalkeeper: { gloves: 2, strength: 6 },
    pitch: {
      sections: {
        CD: { id: 'CD', zones: [{ id: 'CD-z', section: 'CD', players: players.slice(0, 3) }] },
        CM: { id: 'CM', zones: [{ id: 'CM-z', section: 'CM', players: players.slice(3, 6) }] },
        CF: { id: 'CF', zones: [{ id: 'CF-z', section: 'CF', players: players.slice(6, 9) }] },
        LW: { id: 'LW', zones: [{ id: 'LW-z', section: 'LW', players: [players[9]] }] },
        RW: { id: 'RW', zones: [{ id: 'RW-z', section: 'RW', players: [] }] },
      },
    },
  };
}

describe('validateTeam', () => {
  it('accepts a valid team', () => {
    expect(validateTeam(validTeam())).toEqual([]);
  });

  it('rejects wrong field-player count', () => {
    const t = validTeam();
    t.players = t.players.slice(0, 9);
    expect(validateTeam(t).some((e) => e.includes('exactly 10'))).toBe(true);
  });

  it('rejects duplicate jersey numbers', () => {
    const t = validTeam();
    t.players[1] = { ...t.players[1], jerseyNumber: t.players[0].jerseyNumber };
    expect(validateTeam(t).some((e) => e.includes('used 2 times'))).toBe(true);
  });

  it('rejects a wing zone with more than one player', () => {
    const t = validTeam();
    t.pitch.sections.LW.zones[0].players.push({ jerseyNumber: 99, attribute: 'offensive', strength: 3 });
    expect(validateTeam(t).some((e) => e.includes('wing zone has 2'))).toBe(true);
  });

  it('rejects a central zone with more than three players', () => {
    const t = validTeam();
    t.pitch.sections.CD.zones[0].players.push(
      { jerseyNumber: 98, attribute: 'defensive', strength: 3 },
      { jerseyNumber: 97, attribute: 'defensive', strength: 3 },
    );
    expect(validateTeam(t).some((e) => e.includes('central zone has 5'))).toBe(true);
  });

  it('rejects a player with strength below 1', () => {
    const t = validTeam();
    t.players[0] = { ...t.players[0], strength: 0 };
    expect(validateTeam(t).some((e) => e.includes('strength must be an integer >= 1'))).toBe(true);
  });

  it('rejects a goalkeeper with gloves below 0', () => {
    const t = validTeam();
    t.goalkeeper = { ...t.goalkeeper, gloves: -1 };
    expect(validateTeam(t).some((e) => e.includes('gloves must be an integer >= 0'))).toBe(true);
  });

  it('rejects a player placed in multiple zones', () => {
    const t = validTeam();
    const dup = t.players[0];
    t.pitch.sections.CM.zones[0].players.push({ ...dup });
    expect(validateTeam(t).some((e) => e.includes('placed in multiple zones'))).toBe(true);
  });
});
