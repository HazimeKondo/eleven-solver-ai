import type { Attribute, OpponentCard, OpponentPlayer, SectionId } from './types';

/** One row of the opponent-cards CSV (a single player placement). */
export interface CardRow {
  clubName: string;
  division: string;
  gkStrength: number;
  gkGloves: number;
  /** Grid row: 0=Back, 1=Mid, 2=Front. */
  row: number;
  /** Grid col: 0=Left, 1=Center, 2=Right. */
  col: number;
  attribute: Attribute;
  strength: number;
}

/** Map a grid cell (row, col) to its section id and zone depth suffix. */
function cellToSection(row: number, col: number): { section: SectionId; depth: 'B' | 'M' | 'F' } {
  const depth = row === 0 ? 'B' : row === 1 ? 'M' : 'F';
  if (col === 0) return { section: 'LW', depth };
  if (col === 2) return { section: 'RW', depth };
  if (row === 0) return { section: 'CD', depth: 'B' };
  if (row === 1) return { section: 'CM', depth: 'M' };
  return { section: 'CF', depth: 'F' };
}

/** Parse CSV text into opponent cards, grouped by (clubName, division). */
export function parseOpponentCards(csv: string): OpponentCard[] {
  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return [];

  const header = lines[0].split(',').map((h) => h.trim());
  const idx = (name: string): number => {
    const i = header.indexOf(name);
    if (i === -1) throw new Error(`Missing CSV column: ${name}`);
    return i;
  };

  const clubs = new Map<string, CardRow[]>();
  for (const line of lines.slice(1)) {
    const cells = line.split(',').map((c) => c.trim());
    const row: CardRow = {
      clubName: cells[idx('clubName')],
      division: cells[idx('division')],
      gkStrength: Number(cells[idx('gkStrength')]),
      gkGloves: Number(cells[idx('gkGloves')]),
      row: Number(cells[idx('row')]),
      col: Number(cells[idx('col')]),
      attribute: cells[idx('attribute')] as Attribute,
      strength: Number(cells[idx('strength')]),
    };
    const key = `${row.clubName}${row.division}`;
    const list = clubs.get(key) ?? [];
    list.push(row);
    clubs.set(key, list);
  }

  const cards: OpponentCard[] = [];
  for (const [key, rows] of clubs) {
    const [clubName, division] = key.split('');
    const first = rows[0];

    // Build the pitch: wings have 3 depth zones each; central sections have a single zone.
    const allSections: SectionId[] = ['LW', 'RW', 'CD', 'CM', 'CF'];
    const sections = {} as OpponentCard['pitch']['sections'];
    for (const id of allSections) {
      if (id === 'LW' || id === 'RW') {
        const zoneIds = [`${id}-B`, `${id}-M`, `${id}-F`];
        sections[id] = {
          id,
          zones: zoneIds.map((zid) => ({ id: zid, section: id, players: [] })),
        };
      } else {
        const zid = id;
        sections[id] = { id, zones: [{ id: zid, section: id, players: [] }] };
      }
    }

    const players: OpponentPlayer[] = [];
    for (const r of rows) {
      const { section, depth } = cellToSection(r.row, r.col);
      const zoneId = section === 'LW' || section === 'RW' ? `${section}-${depth}` : section;
      const player: OpponentPlayer = { attribute: r.attribute, strength: r.strength };
      sections[section].zones.find((z) => z.id === zoneId)!.players.push(player);
      players.push(player);
    }

    cards.push({
      clubName,
      division,
      goalkeeper: { gloves: first.gkGloves, strength: first.gkStrength },
      players,
      pitch: { sections },
    });
  }

  return cards;
}
