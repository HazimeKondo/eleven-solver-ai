import type { Goalkeeper } from '../domain/types';

export function GKPanel({ gk, onChange }: { gk: Goalkeeper; onChange: (gk: Goalkeeper) => void }) {
  return (
    <div className="gk-panel">
      <span className="gk-panel__label">GK</span>
      <input
        type="number"
        min={1}
        title="Strength"
        value={gk.strength}
        onChange={(e) => onChange({ ...gk, strength: Math.max(1, Number(e.target.value)) })}
      />
      <input
        type="number"
        min={0}
        title="Gloves"
        value={gk.gloves}
        onChange={(e) => onChange({ ...gk, gloves: Math.max(0, Number(e.target.value)) })}
      />
    </div>
  );
}
