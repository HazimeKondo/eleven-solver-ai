import { useDroppable } from '@dnd-kit/core';
import type { Player } from '../domain/types';
import { PlayerChip } from './PlayerChip';
import { PlayerEditor } from './PlayerEditor';

export function Bench({
  players,
  onPlayerChange,
  onPlayerClick,
}: {
  players: Player[];
  onPlayerChange: (p: Player) => void;
  onPlayerClick: (p: Player) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: 'bench' });

  return (
    <div className={`panel bench ${isOver ? 'panel--over' : ''}`} ref={setNodeRef}>
      <h2>Bench</h2>
      <p className="panel__hint">{players.length} unplaced</p>
      <div className="bench__list">
        {players.map((p) => (
          <div key={p.jerseyNumber} className="bench__row" onClick={() => onPlayerClick(p)}>
            <PlayerChip player={p} />
            <PlayerEditor player={p} onChange={onPlayerChange} />
          </div>
        ))}
        {players.length === 0 && <span className="bench__empty">All players on the field</span>}
      </div>
    </div>
  );
}
