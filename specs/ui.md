# UI + Application Layer — Spec

## 1. Application Layer (`src/application/`)

Use cases that orchestrate domain logic. No React, no I/O.

### `resolveMatch(team: Team, opponent: OpponentCard): MatchResult`
- Validates the team via `validateTeam()`. If invalid, throws with the first error message.
- Delegates to `match()` and returns the result.

### `availableOpponents(): OpponentCard[]`
- Returns `OPPONENT_POOL` from the domain.

## 2. UI (`src/interface/`)

React components using @dnd-kit/core for drag-and-drop.

### Layout
- **Left panel — Bench:** a pool of user players. Each player row shows a chip (jersey #, attribute icon, strength) plus inline editors for jersey number, attribute (off/def), and strength (min 1). Players not yet placed on the field live here.
- **Center — Fields area:** GK panel (strength + gloves inputs) above two side-by-side 3×3 grids: the user's field (droppable zones) and the selected opponent's formation (read-only visualization).
- **Right panel — Opponent + Result:** opponent card selector (club name + division dropdowns), a "Resolve Match" button, and the result display (user goals with jersey numbers, opponent goal count).

### Drag-and-drop rules
- Drag from bench → field zone: places the player in that zone.
- Drag between field zones: moves the player to a new zone.
- Drag from field → bench: removes the player from the field.
- Wing zones accept at most 1 player; central zones accept at most 3. Dropping beyond the cap is rejected (snap back).
- A player can only occupy one zone at a time.

### State model
- `players: Player[]` — the user's 10 configurable players (jersey number, attribute, strength). Default: 5 offensive + 5 defensive, strengths varying.
- `benchPlayers: Player[]` — derived: players not currently placed on the field.
- `fieldPlacements: Record<string, Player[]>` — keyed by zone id (`LW-B`, `CD`, `CF`, etc.).
- GK stats (strength, gloves) are editable via a dedicated GK panel above the field grids.
- Opponent formation is read-only; derived from the selected `OpponentCard.pitch`.

### Result display
- After "Resolve Match": show `userGoals` (list of jersey numbers) and `opponentGoals` (count).
- If validation fails, show the error message instead.

## 3. Constraints
- Application layer imports only from `domain`.
- UI imports from `application` and `domain`; never the reverse.
- No new npm dependencies beyond what's already installed.
