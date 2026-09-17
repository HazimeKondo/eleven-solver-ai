import type { OpponentCard, OpponentPlayer } from '../domain/types';

const GRID_POS: Record<string, { row: number; col: number }> = {
  'LW-B': { row: 1, col: 1 }, 'CD': { row: 1, col: 2 }, 'RW-B': { row: 1, col: 3 },
  'LW-M': { row: 2, col: 1 }, 'CM': { row: 2, col: 2 }, 'RW-M': { row: 2, col: 3 },
  'LW-F': { row: 3, col: 1 }, 'CF': { row: 3, col: 2 }, 'RW-F': { row: 3, col: 3 },
};

function OpponentChip({ player }: { player: OpponentPlayer }) {
  const icon = player.attribute === 'offensive' ? '⚽' : '🛡️';
  return (
    <span className={`chip chip--static ${player.attribute}`}>
      <span className="chip__attr" title={player.attribute}>{icon}</span>
      <span className="chip__str">{player.strength}</span>
    </span>
  );
}

export function OpponentField({ card }: { card: OpponentCard | null }) {
  if (!card) {
    return (
      <div className="panel opp-field">
        <h2>Opponent</h2>
        <p className="opp-field__empty">Select an opponent to see their formation</p>
      </div>
    );
  }

  const zonePlayers = new Map<string, OpponentPlayer[]>();
  for (const section of Object.values(card.pitch.sections)) {
    for (const zone of section.zones) {
      zonePlayers.set(zone.id, zone.players);
    }
  }

  return (
    <div className="panel opp-field">
      <h2>{card.clubName} ({card.division})</h2>
      <div className="field__wrapper">
        <span className="field__rowlabel field__rowlabel--back">Back</span>
        <span className="field__rowlabel field__rowlabel--mid">Mid</span>
        <span className="field__rowlabel field__rowlabel--front">Front</span>
        <div className="field__grid">
          {Object.keys(GRID_POS).map((zid) => {
            const pos = GRID_POS[zid];
            const players = zonePlayers.get(zid) ?? [];
            return (
              <div key={zid} className="zone zone--static" style={{ gridRow: pos.row, gridColumn: pos.col }}>
                <span className="zone__label">{zid}</span>
                {zid === 'CD' && (
                  <span className="gk-inline" title={`GK str ${card.goalkeeper.strength}, gloves ${card.goalkeeper.gloves}`}>
                    🧤 {card.goalkeeper.strength}/{card.goalkeeper.gloves}
                  </span>
                )}
                <div className="zone__players">
                  {players.map((p, i) => (
                    <OpponentChip key={i} player={p} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
