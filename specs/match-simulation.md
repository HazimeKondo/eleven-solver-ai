# Match Simulation — Spec

This is the source of truth for the match-resolution logic. Code in `src/domain/` must follow this document. Where this spec and code disagree, the spec wins until it is updated.

## 1. Objects

### Pitch
The soccer field. A 3×3 grid of **9 zones** grouped into **5 sections**:

```
        Left Wing   Center          Right Wing
Back    [LW-B]      [CD]            [RW-B]
Mid     [LW-M]      [CM]            [RW-M]
Front   [LW-F]      [CF]            [RW-F]
```

- **Left Wing** = 3 left-column zones (back/mid/front).
- **Right Wing** = 3 right-column zones.
- **Central Defenders (CD)** = center-back zone.
- **Central Midfielders (CM)** = center-mid zone.
- **Central Forwards (CF)** = center-front zone.

A **zone** holds an **ordered list of players**:
- Central zones: 1–3 players each.
- Wing zones: 0 or 1 player each.

### Player
Represents a soccer player on the field.
- `jerseyNumber`: identifies the player (unique within a team).
- `attribute`: `offensive` (soccer ball) | `defensive` (shield).
- `strength`: integer, minimum 1.

### Goalkeeper
- `gloves`: number of shots this GK can block.
- `strength`: integer, minimum 1.
- Occupies a **dedicated spot inside the Central Defenders zone**, separate from the field players in that zone.

### Team
- Exactly **10 Players + 1 Goalkeeper**.
- Placement rules:
  - Central zones (CD, CM, CF): 1–3 players each.
  - Wing zones (each of the 6 wing zones): 0 or 1 player each.
  - Goalkeeper: dedicated spot in the CD zone.

### Opponent Card
A fixed team (players + goalkeeper) with a fixed placement. Its pitch is **fully rotated 180°** relative to the user's, so:
- Opponent Left Wing aligns with User Right Wing.
- Opponent Central Forwards face User Central Defenders.
- (and so on — see pairing in §2.)

In addition to the team, a card carries identity used for **selection/filtering** by the user:
- `clubName`: the club the card belongs to. The same club may have multiple cards.
- `division`: the division of this card. A club's cards are distinguished by division.
- Together `(clubName, division)` uniquely identify a card; these two fields are the filters the user uses to pick which opponent to match against.

## 2. Match Resolution

A match resolves **5 section pairs**, in this order:

| # | User Section       | Opponent Section     |
|---|--------------------|----------------------|
| 1 | Left Wing          | Right Wing           |
| 2 | Right Wing         | Left Wing            |
| 3 | Central Forwards   | Central Defenders    |
| 4 | Central Midfielders| Central Midfielders  |
| 5 | Central Defenders  | Central Forwards     |

### Per-pair rules
- **Cross-play:** each side's offensive players attack the *other* side's defensive players.
  - User offense vs Opponent defense → **user goals**.
  - Opponent offense vs User defense → **opponent goals**.
- **Pairing is 1v1:** each defensive player blocks at most one attacking player.
- **A shot scores** if the attacker's `strength` > the defender's `strength`; otherwise it is **blocked**.
- **Surplus attackers** (more offensive than defensive players on that side) score unopposed.
- **Optimization:** when multiple pairings are possible, choose the one that **minimizes total goals for both teams combined**. If several achieve the same minimum, **tie-break in the user's favor** (the user concedes fewer goals).

Resolve each pair completely before moving to the next. After all 5 pairs, apply the goalkeeper rule (§3).

## 3. Goalkeeper Blocking
- After all 5 pairs resolve, the user's Goalkeeper may block **opponent shots that field players did not block**.
- A shot can be GK-blocked only if:
  - User GK `strength` ≥ that attacker's `strength`, **and**
  - The GK still has a glove available.
- Each blocked shot consumes one glove. Repeatable up to the glove count.
- GK blocking reduces the opponent's final score.

## 4. Output
A match result, after all pairs and goalkeeper blocking are applied:

- `userGoals`: a list of goals, **each recording which player scored it** (by jersey number). Order should reflect resolution order (pair by pair).
- `opponentGoals`: a **count only** — no per-player attribution needed. Opponent Card players omit their jersey numbers, so there is nothing to record.

Shape: `{ userGoals: { jerseyNumber: number }[], opponentGoals: number }`.

## 5. Out of scope / TBD
- Tie-break details beyond "minimize both, favor user" (e.g., exact objective if a true tie remains) — refine when implementing the optimizer.
- Any rule not listed here is **not** part of the simulation until added to this spec.
