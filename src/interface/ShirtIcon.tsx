import type { OpponentPlayer } from '../domain/types';

const SHIRT_INVERTED = 'M10 27 L20 27 L27 22 L24 16 L20 18 L20 3 L10 3 L10 18 L6 16 L3 22 Z';

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

export function OpponentShirt({ player }: { player: OpponentPlayer }) {
  return (
    <svg className="shirt" viewBox="0 0 30 30" width="40" height="40">
      <path d={SHIRT_INVERTED} fill="#e74c3c" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
      <g transform="translate(15, 13)">
        <path d="M0,-6 C3,-3 4.5,1.5 0,6 C-4.5,1.5 -3,-3 0,-6 Z" fill="#f5a623" />
        <circle cx="0" cy="0.5" r="5" fill="#fff" stroke="#f5a623" strokeWidth="0.8" />
        <text x="0" y="3.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="#333">{player.strength}</text>
      </g>
      <AttrIcon type={player.attribute} x={15} y={22} />
    </svg>
  );
}
