import { useMemo, useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core';
import type { Goalkeeper, Player, SectionId, Team } from './domain/types';
import { resolveMatch, availableOpponents } from './application';
import type { MatchResult } from './domain/match';
import { Bench } from './interface/Bench';
import { Field } from './interface/Field';
import { OpponentSelector } from './interface/OpponentSelector';
import { ResultDisplay } from './interface/ResultDisplay';
import { PlayerChip } from './interface/PlayerChip';
import { ZONE_IDS, zoneSection, ZONE_CAP } from './interface/types';
import './App.css';

const DEFAULT_PLAYERS: Player[] = [
  { jerseyNumber: 1, attribute: 'offensive', strength: 1 },
  { jerseyNumber: 2, attribute: 'offensive', strength: 1 },
  { jerseyNumber: 3, attribute: 'offensive', strength: 1 },
  { jerseyNumber: 4, attribute: 'offensive', strength: 1 },
  { jerseyNumber: 5, attribute: 'offensive', strength: 1 },
  { jerseyNumber: 6, attribute: 'defensive', strength: 1 },
  { jerseyNumber: 7, attribute: 'defensive', strength: 1 },
  { jerseyNumber: 8, attribute: 'defensive', strength: 1 },
  { jerseyNumber: 9, attribute: 'defensive', strength: 1 },
  { jerseyNumber: 10, attribute: 'defensive', strength: 1 },
];

const DEFAULT_GK: Goalkeeper = { strength: 2, gloves: 2 };

function buildTeam(placements: Record<string, Player[]>, players: Player[], gk: Goalkeeper): Team {
  const sectionMap = new Map<SectionId, { id: SectionId; zones: { id: string; section: SectionId; players: Player[] }[] }>();
  for (const zid of ZONE_IDS) {
    const sectionId = zoneSection(zid) as SectionId;
    if (!sectionMap.has(sectionId)) {
      sectionMap.set(sectionId, { id: sectionId, zones: [] });
    }
    sectionMap.get(sectionId)!.zones.push({ id: zid, section: sectionId, players: placements[zid] ?? [] });
  }
  const sections = Object.fromEntries(sectionMap) as Record<SectionId, { id: SectionId; zones: { id: string; section: SectionId; players: Player[] }[] }>;
  return { players, goalkeeper: gk, pitch: { sections } };
}

function App() {
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [gk, setGk] = useState<Goalkeeper>(DEFAULT_GK);
  const [placements, setPlacements] = useState<Record<string, Player[]>>({});
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const opponents = useMemo(() => availableOpponents(), []);
  const [selectedClub, setSelectedClub] = useState(opponents[0]?.clubName ?? '');
  const [selectedDivision, setSelectedDivision] = useState(
    opponents.find((o) => o.clubName === (opponents[0]?.clubName ?? ''))?.division ?? '',
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const benchPlayers = useMemo(() => {
    const placed = new Set<number>();
    for (const list of Object.values(placements)) {
      for (const p of list) placed.add(p.jerseyNumber);
    }
    return players.filter((p) => !placed.has(p.jerseyNumber));
  }, [players, placements]);

  const selectedOpponent = opponents.find(
    (o) => o.clubName === selectedClub && o.division === selectedDivision,
  );

  function updatePlayer(updated: Player) {
    setPlayers((prev) => prev.map((p) => (p.jerseyNumber === updated.jerseyNumber ? updated : p)));
    setResult(null);
    setError(null);
  }

  function handleDragStart(event: DragStartEvent) {
    const id = String(event.active.id);
    if (id.startsWith('player-')) {
      const num = Number(id.slice(7));
      setActivePlayer(players.find((p) => p.jerseyNumber === num) ?? null);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActivePlayer(null);
    const { active, over } = event;
    if (!over) return;

    const id = String(active.id);
    if (!id.startsWith('player-')) return;
    const num = Number(id.slice(7));
    const player = players.find((p) => p.jerseyNumber === num);
    if (!player) return;

    const overId = String(over.id);
    setPlacements((prev) => {
      const next: Record<string, Player[]> = {};
      for (const zid of ZONE_IDS) next[zid] = [...(prev[zid] ?? [])];
      for (const zid of ZONE_IDS) {
        next[zid] = next[zid].filter((p) => p.jerseyNumber !== num);
      }

      if (overId === 'bench') return next;

      const targetZone = overId as string;
      if (!ZONE_IDS.includes(targetZone as typeof ZONE_IDS[number])) return next;
      const cap = ZONE_CAP(targetZone);
      if (next[targetZone].length >= cap) return prev;
      next[targetZone].push(player);
      return next;
    });

    setResult(null);
    setError(null);
  }

  function handleResolve() {
    setError(null);
    setResult(null);
    try {
      const team = buildTeam(placements, players, gk);
      if (!selectedOpponent) {
        setError('No opponent selected.');
        return;
      }
      const res = resolveMatch(team, selectedOpponent);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  function handleClubChange(club: string) {
    setSelectedClub(club);
    const card = opponents.find((o) => o.clubName === club);
    if (card) setSelectedDivision(card.division);
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="app">
        <header className="app__header">
          <h1>Eleven Solver</h1>
          <p>Match simulation helper for the board game Eleven</p>
        </header>

        <div className="app__body">
          <Bench players={benchPlayers} onPlayerChange={updatePlayer} />

          <div className="app__fields">
            <Field placements={placements} gk={gk} onGkChange={(newGk) => { setGk(newGk); setResult(null); setError(null); }} opponent={selectedOpponent ?? null} />
          </div>

          <div className="app__right">
            <OpponentSelector
              opponents={opponents}
              selectedClub={selectedClub}
              selectedDivision={selectedDivision}
              onClubChange={handleClubChange}
              onDivisionChange={setSelectedDivision}
            />

            <button className="resolve-btn" onClick={handleResolve}>
              Resolve Match
            </button>

            <ResultDisplay result={result} error={error} />
          </div>
        </div>
      </div>

      <DragOverlay>
        {activePlayer ? (
          <div className="drag-overlay">
            <PlayerChip player={activePlayer} compact />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
