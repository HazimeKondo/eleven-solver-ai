import { describe, expect, it } from 'vitest';
import { parseOpponentCards } from './parseCards';

const CSV = `clubName,division,gkStrength,gkGloves,row,col,attribute,strength
Red Squirrels,Division 1,3,2,0,0,defensive,3
Red Squirrels,Division 1,3,2,0,1,offensive,3
Red Squirrels,Division 1,3,2,0,1,offensive,3
Red Squirrels,Division 1,3,2,0,2,defensive,3
Red Squirrels,Division 1,3,2,1,0,defensive,4
Red Squirrels,Division 1,3,2,1,1,defensive,1
Red Squirrels,Division 1,3,2,1,2,defensive,2
Red Squirrels,Division 1,3,2,2,0,offensive,4
Red Squirrels,Division 1,3,2,2,1,offensive,1
Red Squirrels,Division 1,3,2,2,2,offensive,1
`;

describe('parseOpponentCards', () => {
  it('groups rows into one card per (clubName, division)', () => {
    const cards = parseOpponentCards(CSV);
    expect(cards).toHaveLength(1);
    const [card] = cards;
    expect(card.clubName).toBe('Red Squirrels');
    expect(card.division).toBe('Division 1');
  });

  it('reads the goalkeeper stats', () => {
    const [card] = parseOpponentCards(CSV);
    expect(card.goalkeeper).toEqual({ gloves: 2, strength: 3 });
  });

  it('collects all 10 field players without jersey numbers', () => {
    const [card] = parseOpponentCards(CSV);
    expect(card.players).toHaveLength(10);
    for (const p of card.players) {
      expect(p).not.toHaveProperty('jerseyNumber');
      expect(['offensive', 'defensive']).toContain(p.attribute);
      expect(p.strength).toBeGreaterThanOrEqual(1);
    }
  });

  it('places each player into the correct section and zone', () => {
    const [card] = parseOpponentCards(CSV);
    // (0,0) -> LW-B defensive 3
    expect(card.pitch.sections.LW.zones.find((z) => z.id === 'LW-B')!.players).toEqual([
      { attribute: 'defensive', strength: 3 },
    ]);
    // (0,1)+(0,1) -> CD offensive 3, offensive 3
    expect(card.pitch.sections.CD.zones[0].players).toEqual([
      { attribute: 'offensive', strength: 3 },
      { attribute: 'offensive', strength: 3 },
    ]);
    // (2,0) -> LW-F offensive 4
    expect(card.pitch.sections.LW.zones.find((z) => z.id === 'LW-F')!.players).toEqual([
      { attribute: 'offensive', strength: 4 },
    ]);
  });

  it('supports multiple clubs and divisions in one file', () => {
    const multi = `clubName,division,gkStrength,gkGloves,row,col,attribute,strength
Red Squirrels,Division 1,3,2,0,0,defensive,3
Wolves,Division 3,5,1,2,1,offensive,7
`;
    const cards = parseOpponentCards(multi);
    expect(cards).toHaveLength(2);
    const wolves = cards.find((c) => c.clubName === 'Wolves');
    expect(wolves?.division).toBe('Division 3');
    expect(wolves?.goalkeeper).toEqual({ gloves: 1, strength: 5 });
    expect(wolves?.players).toHaveLength(1);
  });

  it('throws when a required column is missing', () => {
    expect(() => parseOpponentCards('clubName,division,row,col\nA,B,0,0')).toThrow(/Missing CSV column/);
  });
});
