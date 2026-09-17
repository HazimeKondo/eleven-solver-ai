import { useDroppable } from '@dnd-kit/core';
import type { Goalkeeper, OpponentCard, OpponentPlayer, Player } from '../domain/types';
import { GKShirt, GKShirtEditor } from './GKShirt';
import { OpponentShirt } from './ShirtIcon';
import { PlayerChip } from './PlayerChip';

import { ZONE_IDS, isCentralZone, ZONE_CAP } from './types';

const GRID_POS: Record<string, { row: number; col: number }> = {
  'LW-F': { row: 1, col: 1 }, 'CF': { row: 1, col: 2 }, 'RW-F': { row: 1, col: 3 },
  'LW-M': { row: 2, col: 1 }, 'CM': { row: 2, col: 2 }, 'RW-M': { row: 2, col: 3 },
  'LW-B': { row: 3, col: 1 }, 'CD': { row: 3, col: 2 }, 'RW-B': { row: 3, col: 3 },
};

const OPP_ROTATED: Record<string, string> = {
  'LW-B': 'RW-F', 'LW-M': 'RW-M', 'LW-F': 'RW-B',
  'RW-B': 'LW-F', 'RW-M': 'LW-M', 'RW-F': 'LW-B',
  'CD': 'CD', 'CM': 'CM', 'CF': 'CF',
};

function PitchSVG() {
  return (
    <svg className="field__pitch" viewBox="0 0 300 420" preserveAspectRatio="none" aria-hidden>
      {/* grass stripes */}
      <rect x="0" y="0" width="300" height="70" fill="#3a7d44" />
      <rect x="0" y="70" width="300" height="70" fill="#357540" />
      <rect x="0" y="140" width="300" height="70" fill="#3a7d44" />
      <rect x="0" y="210" width="300" height="70" fill="#357540" />
      <rect x="0" y="280" width="300" height="70" fill="#3a7d44" />
      <rect x="0" y="350" width="300" height="70" fill="#357540" />

      {/* outer border */}
      <rect x="8" y="8" width="284" height="404" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />

      {/* halfway line */}
      <line x1="8" y1="210" x2="292" y2="210" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

      {/* center circle */}
      <circle cx="150" cy="210" r="40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <circle cx="150" cy="210" r="2.5" fill="rgba(255,255,255,0.4)" />

      {/* top penalty area (opponent) */}
      <rect x="75" y="8" width="150" height="60" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      {/* top goal area (small box) */}
      <rect x="115" y="8" width="70" height="25" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      {/* top penalty spot */}
      <circle cx="150" cy="45" r="2" fill="rgba(255,255,255,0.4)" />
      {/* top arc */}
      <path d="M 120 68 A 30 30 0 0 1 180 68" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

      {/* bottom penalty area (user) */}
      <rect x="75" y="352" width="150" height="60" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      {/* bottom goal area (small box) */}
      <rect x="115" y="387" width="70" height="25" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      {/* bottom penalty spot */}
      <circle cx="150" cy="375" r="2" fill="rgba(255,255,255,0.4)" />
      {/* bottom arc */}
      <path d="M 180 352 A 30 30 0 0 0 120 352" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

      {/* corner arcs */}
      <path d="M 8 16 A 8 8 0 0 0 16 8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <path d="M 284 8 A 8 8 0 0 0 292 16" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <path d="M 8 404 A 8 8 0 0 1 16 412" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <path d="M 292 404 A 8 8 0 0 0 284 412" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    </svg>
  );
}

function OpponentShirts({ players }: { players: OpponentPlayer[] }) {
  if (players.length === 0) return null;
  return (
    <div className="zone__opp-shirts">
      {players.map((p, i) => (
        <OpponentShirt key={i} player={p} />
      ))}
    </div>
  );
}

function ZoneCell({ zoneId, players, opponentPlayers }: {
  zoneId: string;
  players: Player[];
  opponentPlayers: OpponentPlayer[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: zoneId });
  const cap = ZONE_CAP(zoneId);
  const pos = GRID_POS[zoneId];

  return (
    <div
      className={`zone ${isCentralZone(zoneId) ? 'zone--central' : 'zone--wing'} ${isOver ? 'zone--over' : ''} ${players.length >= cap ? 'zone--full' : ''}`}
      ref={setNodeRef}
      style={{ gridRow: pos.row, gridColumn: pos.col }}
    >
      <OpponentShirts players={opponentPlayers} />
      <div className="zone__players">
        {players.map((p) => (
          <PlayerChip key={p.jerseyNumber} player={p} compact />
        ))}
      </div>
      <span className="zone__cap">{players.length}/{cap}</span>
    </div>
  );
}

export function Field({ placements, gk, onGkChange, opponent }: {
  placements: Record<string, Player[]>;
  gk: Goalkeeper;
  onGkChange: (gk: Goalkeeper) => void;
  opponent: OpponentCard | null;
}) {
  const oppZoneMap = new Map<string, OpponentPlayer[]>();
  if (opponent) {
    for (const section of Object.values(opponent.pitch.sections)) {
      for (const zone of section.zones) {
        const userZoneId = OPP_ROTATED[zone.id] ?? zone.id;
        oppZoneMap.set(userZoneId, zone.players);
      }
    }
  }

  return (
    <div className="panel field">
      <h2>{opponent ? `${opponent.clubName} (${opponent.division})` : 'Your Formation'}</h2>
      <div className="field__outer">
        {/* Opponent goal box */}
        <div className="goal-box goal-box--opp">
          {opponent && <GKShirt gk={opponent.goalkeeper} inverted />}
        </div>

        {/* Pitch */}
        <div className="field__grid">
          <PitchSVG />
          {ZONE_IDS.map((zid) => (
            <ZoneCell
              key={zid}
              zoneId={zid}
              players={placements[zid] ?? []}
              opponentPlayers={oppZoneMap.get(zid) ?? []}
            />
          ))}
        </div>

        {/* User goal box */}
        <div className="goal-box goal-box--user">
          <GKShirtEditor gk={gk} onGkChange={onGkChange} />
        </div>
      </div>
    </div>
  );
}
