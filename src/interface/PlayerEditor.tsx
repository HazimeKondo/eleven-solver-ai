import type { Attribute, Player } from '../domain/types';

export function PlayerEditor({
  player,
  onChange,
}: {
  player: Player;
  onChange: (p: Player) => void;
}) {
  return (
    <div className="player-editor">
      <input
        className="player-editor__num"
        type="number"
        min={1}
        max={99}
        value={player.jerseyNumber}
        onChange={(e) => onChange({ ...player, jerseyNumber: Math.max(1, Number(e.target.value)) })}
      />
      <select
        className="player-editor__attr"
        value={player.attribute}
        onChange={(e) => onChange({ ...player, attribute: e.target.value as Attribute })}
      >
        <option value="offensive">⚽ Off</option>
        <option value="defensive">🛡️ Def</option>
      </select>
      <input
        className="player-editor__str"
        type="number"
        min={1}
        max={9}
        value={player.strength}
        onChange={(e) => onChange({ ...player, strength: Math.max(1, Number(e.target.value)) })}
      />
    </div>
  );
}
