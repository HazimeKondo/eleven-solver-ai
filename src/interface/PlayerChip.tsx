import { useDraggable } from '@dnd-kit/core';
import type { Player } from '../domain/types';

const SHIRT_PATH = 'M10 3 L20 3 L27 8 L24 14 L20 12 L20 27 L10 27 L10 12 L6 14 L3 8 Z';

function FlameBadge({ x, y, value }: { x: number; y: number; value: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path d="M0,-6 C3,-3 4.5,1.5 0,6 C-4.5,1.5 -3,-3 0,-6 Z" fill="#f5a623" />
      <circle cx="0" cy="0.5" r="5" fill="#fff" stroke="#f5a623" strokeWidth="0.8" />
      <text x="0" y="3.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="#333">{value}</text>
    </g>
  );
}

function AttrIcon({ type, x, y }: { type: 'offensive' | 'defensive'; x: number; y: number }) {
  if (type === 'defensive') {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <path d="M0,-3 L2.5,-1.5 L2.5,1 L0,3 L-2.5,1 L-2.5,-1.5 Z" fill="#fff" stroke="#999" strokeWidth="0.4" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r="3" fill="#fff" stroke="#333" strokeWidth="0.5" />
      <path d="M0,-1.2 L1.1,-0.4 L0.7,1 L-0.7,1 L-1.1,-0.4 Z" fill="#333" />
    </g>
  );
}

export function ShirtSVG({ player, size }: { player: Player; size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 42 : 52;
  return (
    <svg className="shirt" viewBox="0 0 30 30" width={s} height={s}>
      <path d={SHIRT_PATH} fill="#3498db" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
      <text x="15" y="17" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">{player.jerseyNumber}</text>
      <FlameBadge x={24} y={6} value={player.strength} />
      <AttrIcon type={player.attribute} x={15} y={24} />
    </svg>
  );
}

export function PlayerChip({ player, compact }: { player: Player; compact?: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `player-${player.jerseyNumber}`,
  });

  return (
    <span
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`chip ${compact ? 'chip--compact' : ''} ${isDragging ? 'chip--dragging' : ''}`}
    >
      <ShirtSVG player={player} size={compact ? 'sm' : 'md'} />
    </span>
  );
}
