import { useEffect, useRef } from 'react';
import type { Player } from '../domain/types';
import { ZONE_IDS, ZONE_CAP } from './types';

const MINI_GRID: Record<string, { row: number; col: number }> = {
  'LW-F': { row: 1, col: 1 }, 'CF': { row: 1, col: 2 }, 'RW-F': { row: 1, col: 3 },
  'LW-M': { row: 2, col: 1 }, 'CM': { row: 2, col: 2 }, 'RW-M': { row: 2, col: 3 },
  'LW-B': { row: 3, col: 1 }, 'CD': { row: 3, col: 2 }, 'RW-B': { row: 3, col: 3 },
};

export function PlayerModal({ player, placements, onMove, onUpdate, onClose }: {
  player: Player;
  placements: Record<string, Player[]>;
  onMove: (zoneId: string | null) => void;
  onUpdate: (p: Player) => void;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const currentZone = Object.keys(placements).find(
    (zid) => placements[zid]?.some((p) => p.jerseyNumber === player.jerseyNumber),
  ) ?? null;

  function handleClickOutside(e: React.MouseEvent) {
    if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
      onClose();
    }
  }

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleClickOutside}>
      <div className="modal">
        <div className="modal__header">
          <h3>Player #{player.jerseyNumber}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <div className="modal__editors">
          <label className="modal__field">
            <span>#</span>
            <input
              type="number"
              min={1}
              max={99}
              value={player.jerseyNumber}
              onChange={(e) => onUpdate({ ...player, jerseyNumber: Math.max(1, Number(e.target.value)) })}
            />
          </label>
          <label className="modal__field">
            <span>Type</span>
            <select
              value={player.attribute}
              onChange={(e) => onUpdate({ ...player, attribute: e.target.value as Player['attribute'] })}
            >
              <option value="offensive">Offensive</option>
              <option value="defensive">Defensive</option>
            </select>
          </label>
          <label className="modal__field">
            <span>Str</span>
            <input
              type="number"
              min={1}
              max={9}
              value={player.strength}
              onChange={(e) => onUpdate({ ...player, strength: Math.max(1, Number(e.target.value)) })}
            />
          </label>
        </div>

        <div className="modal__section">
          <span className="modal__section-label">Move to</span>
          <div className="mini-pitch">
            {ZONE_IDS.map((zid) => {
              const count = placements[zid]?.length ?? 0;
              const cap = ZONE_CAP(zid);
              const isFull = count >= cap;
              const isCurrent = currentZone === zid;
              return (
                <button
                  key={zid}
                  className={`mini-pitch__cell ${isCurrent ? 'mini-pitch__cell--current' : ''} ${isFull && !isCurrent ? 'mini-pitch__cell--full' : ''}`}
                  style={{ gridRow: MINI_GRID[zid].row, gridColumn: MINI_GRID[zid].col }}
                  onClick={() => onMove(zid)}
                  disabled={isFull && !isCurrent}
                >
                  <span className="mini-pitch__count">{count}/{cap}</span>
                </button>
              );
            })}
          </div>
          <button
            className={`mini-pitch__bench ${currentZone === null ? 'mini-pitch__bench--current' : ''}`}
            onClick={() => onMove(null)}
          >
            Bench {currentZone === null ? '(current)' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
