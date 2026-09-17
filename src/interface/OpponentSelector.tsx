import type { OpponentCard } from '../domain/types';

export function OpponentSelector({
  opponents,
  selectedClub,
  selectedDivision,
  onClubChange,
  onDivisionChange,
}: {
  opponents: OpponentCard[];
  selectedClub: string;
  selectedDivision: string;
  onClubChange: (club: string) => void;
  onDivisionChange: (division: string) => void;
}) {
  const clubs = [...new Set(opponents.map((o) => o.clubName))];
  const divisions = opponents
    .filter((o) => o.clubName === selectedClub)
    .map((o) => o.division);

  return (
    <div className="panel selector">
      <h2>Opponent</h2>
      <label className="selector__field">
        <span>Club</span>
        <select value={selectedClub} onChange={(e) => onClubChange(e.target.value)}>
          {clubs.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="selector__field">
        <span>Division</span>
        <select value={selectedDivision} onChange={(e) => onDivisionChange(e.target.value)}>
          {divisions.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
