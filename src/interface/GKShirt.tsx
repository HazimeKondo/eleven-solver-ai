import type { Goalkeeper } from '../domain/types';

const SHIRT_PATH = 'M10 3 L20 3 L27 8 L24 14 L20 12 L20 27 L10 27 L10 12 L6 14 L3 8 Z';
const SHIRT_INVERTED = 'M10 27 L20 27 L27 22 L24 16 L20 18 L20 3 L10 3 L10 18 L6 16 L3 22 Z';

export function GKShirt({ gk, inverted }: { gk: Goalkeeper; inverted?: boolean }) {
  const path = inverted ? SHIRT_INVERTED : SHIRT_PATH;
  return (
    <div className="gk-editor">
      <svg className="shirt" viewBox="0 0 30 30" width="48" height="48">
        <path d={path} fill={inverted ? '#e74c3c' : '#3498db'} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
        <text x="15" y="16" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff">GK</text>
      </svg>
      <div className="gk-editor__stats">
        <div className="gk-editor__stat">
          <span className="gk-editor__flame">🔥</span>
          <span className="gk-editor__value">{gk.strength}</span>
        </div>
        <div className="gk-editor__stat">
          <span className="gk-editor__glove">🧤</span>
          <span className="gk-editor__value">{gk.gloves}</span>
        </div>
      </div>
    </div>
  );
}

export function GKShirtEditor({ gk, onGkChange }: { gk: Goalkeeper; onGkChange: (gk: Goalkeeper) => void }) {
  return (
    <div className="gk-editor">
      <svg className="shirt" viewBox="0 0 30 30" width="48" height="48">
        <path d={SHIRT_PATH} fill="#3498db" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
        <text x="15" y="16" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff">GK</text>
      </svg>
      <div className="gk-editor__stats">
        <div className="gk-editor__stat">
          <span className="gk-editor__flame">🔥</span>
          <input
            type="number"
            min={1}
            max={9}
            title="GK Strength"
            value={gk.strength}
            onChange={(e) => onGkChange({ ...gk, strength: Math.max(1, Number(e.target.value)) })}
          />
        </div>
        <div className="gk-editor__stat">
          <span className="gk-editor__glove">🧤</span>
          <input
            type="number"
            min={0}
            max={9}
            title="GK Gloves"
            value={gk.gloves}
            onChange={(e) => onGkChange({ ...gk, gloves: Math.max(0, Number(e.target.value)) })}
          />
        </div>
      </div>
    </div>
  );
}
