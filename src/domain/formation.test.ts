import { describe, expect, it } from 'vitest';
import { benchPlayers, fieldPlayers, type Formation, type Player } from './formation';

const roster: Player[] = [
  { id: 'p1', name: 'A', offensive: 7, defensive: 3 },
  { id: 'p2', name: 'B', offensive: 5, defensive: 6 },
  { id: 'p3', name: 'C', offensive: 4, defensive: 8 },
];

const formation: Formation = {
  slots: [
    { id: 's1', position: 'GK', playerId: 'p1' },
    { id: 's2', position: 'DEF', playerId: null },
    { id: 's3', position: 'MID', playerId: 'p2' },
  ],
};

describe('formation', () => {
  it('lists only placed players on the field', () => {
    expect(fieldPlayers(formation, roster).map((p) => p.id)).toEqual(['p1', 'p2']);
  });

  it('puts unplaced players on the bench', () => {
    expect(benchPlayers(formation, roster).map((p) => p.id)).toEqual(['p3']);
  });
});
