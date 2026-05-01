# Frontend Redesign Spec — Expo + React Native Web

**Date:** 2026-05-02  
**Branch:** main  
**Status:** APPROVED  
**Based on:** docs/game-design.md (Phase 2 — Frontend + Game Loop)

---

## Problem Statement

The frontend was removed and needs to be reimplemented from scratch using TDD methodology. The previous Expo init (commit `37c5d92`) and game logic utilities (commit `bad73f1`) were deleted. We need a clean Expo + React Native Web frontend that meets the hackathon success criteria.

---

## Architecture & Project Structure

Reinitialize Expo with TypeScript template. Project structure:

```
frontend/
├── screens/
│   ├── AuthScreen.tsx (login/signup/join world via code)
│   ├── GameScreen.tsx (tile grid + movement + actions)
│   ├── MarketScreen.tsx (buy/sell resources, price updates)
│   ├── TownHallScreen.tsx (leaderboard + events + player locations)
│   └── GameOverScreen.tsx (winner declaration at day 30)
├── components/
│   ├── TileGrid.tsx (15×15 viewport, player-centered)
│   ├── PlayerHUD.tsx (tokens, movement/action budget display)
│   ├── ActionPanel.tsx (gather/work/market buttons)
│   └── Leaderboard.tsx (score display, sorted ranking)
├── utils/ (reused from previous iteration, with TDD verification)
│   ├── movement.ts + movement.test.ts
│   ├── gather.ts + gather.test.ts
│   ├── market.ts + market.test.ts
│   └── score.ts + score.test.ts
├── services/
│   ├── api.ts (REST calls to backend endpoints)
│   └── socket.ts (Socket.io Context + useSocket hook)
├── __tests__/ (screen/component tests via React Native Testing Library)
├── app.json, App.tsx (Expo entry point)
└── jest.config.js, package.json
```

---

## Viewport Navigation

**Decision: Arrow Keys with mobile button alternative**

- Desktop: Arrow keys for movement (up/down/left/right)
- Mobile: On-screen directional buttons (↑ ↓ ← →) for tap-based movement
- Player can move up to 6 movement points per turn
- Terrain costs: grassland=1pt, forest=2pt, mountain=3pt, desert=2pt, water=impassable
- Unspent movement points do not carry over

---

## Game Screen & Tile Grid

The main game screen renders a **15×15 viewport** centered on the player.

**TileGrid.tsx:**
- Renders 15×15 grid using styled `<View>` components (not Canvas)
- Highlights player position with a distinct marker
- Tile colors match terrain type:
  - Grassland = green
  - Forest = dark green
  - Mountain = gray
  - Desert = yellow
  - Water = blue
- Only renders visible viewport for performance

**PlayerHUD.tsx:**
- Shows tokens (starting: 20)
- Movement remaining (6 points/turn, decrements on move)
- Actions remaining (2 actions/turn)
- Current game day display

**ActionPanel.tsx:**
- "Gather" button (active if tile has resources, max 1 gather per action)
- "Work" button (active if on Mine/Farm/Market structure)
- "End Turn" button (submits turn to backend)

---

## Turn Flow & Socket.io

**Socket.io Integration: React Context + useSocket() hook**

```
1. App loads → check auth token in AsyncStorage
2. Socket.io connects → listens for 'turn_start' event
3. If it's my turn: show GameScreen with movement/action budget
4. Player moves (arrow keys/buttons) → REST POST /action (type: 'move', x, y)
5. Player acts (gather/work) → REST POST /action (type: 'gather'/'work')
6. End turn → REST POST /turn/end
7. Socket receives 'turn_start' for next player → update UI
```

**SocketContext.tsx:**
- Provides `useSocket()` hook for components
- Manages connection lifecycle (reconnection: true, reconnectionAttempts: 5)
- On `turn_start` event, updates global state to show whose turn it is
- Re-emits current turn state on reconnect (handles Railway free tier drops)

---

## Market & Town Hall Screens

**MarketScreen.tsx:**
- Shows player's current resources (crops, lumber, ore, gems, fish)
- Buy/Sell interface with current prices
- Prices shift each game-day, doubled during Festival event
- Validates: sufficient resources to sell, sufficient tokens to buy
- Trade profits add to score (1 tokens = 1 point)

**TownHallScreen.tsx:**
- Leaderboard: sorted player rankings with scores (uses `getLeaderboardRank`)
- Current world event display (Drought/Token Rush/Festival)
- Player locations on the world (read-only)
- Info only, no actions available

---

## Game Over & World Events

**GameOverScreen.tsx:**
- Triggered when game-day 30 completes
- Shows final scores for all players
- Declares winner with 🏆
- Play again option (future: new world creation)

**World Events Banner (in GameScreen):**
- Displayed at top of game screen (color-coded):
  - Drought = orange (Farms produce half this cycle)
  - Token Rush = yellow (Mines triple output this cycle)
  - Festival = purple (Market prices double this cycle)
- Events rotate every 5 game-days, seeded for consistency
- Effects applied automatically in game logic utilities

---

## Authentication Screens

**AuthScreen.tsx:**
- Login tab: email + password → receives JWT token
- Signup tab: email + password → creates account
- Join World tab: enter join code → associates player with world
- Stores JWT in AsyncStorage for persistent sessions
- Redirects to GameScreen on successful auth

---

## Responsive Layout

Expo web with `react-native-web`:
- Viewport meta tag in `index.html`
- Flexbox layouts (natural for React Native components)
- `max-width: 100vw` to prevent horizontal scroll
- Touch-friendly tap targets (min 44px for mobile)
- Test in mobile browser as primary target
- Works in mobile browser (success criteria item)

---

## Testing Strategy

**TDD Methodology (Red-Green-Refactor):**
- Write failing test first
- Watch it fail (verify RED)
- Write minimal code to pass (GREEN)
- Refactor while keeping tests green

**Testing Stack:**
- Jest + jest-expo (Expo standard test runner)
- React Native Testing Library (component testing)
- Test types:
  - Unit tests: utils/movement.ts, gather.ts, market.ts, score.ts
  - Component tests: TileGrid, PlayerHUD, ActionPanel
  - Screen tests: GameScreen, MarketScreen, TownHallScreen
  - Integration tests: api.ts service calls

**Game Logic Utilities (reused from previous iteration):**
- `movement.ts` — getTerrainMovementCost, validateMove, calculateMovementRemaining
- `gather.ts` — canGather, getGatherYield (drought halves crops)
- `market.ts` — getBasePrice, calculateSellPrice, calculateBuyPrice
- `score.ts` — calculateResourceScore, calculateScore, getLeaderboardRank

All utilities have existing tests (82 passing). Verify they still pass with TDD cycle.

---

## Success Criteria Checklist

- [ ] 3 players can create accounts and join one world via join code
- [ ] Procedurally generated 50×50 world renders correctly (15×15 viewport)
- [ ] Turn system advances in order, UI shows whose turn it is
- [ ] Each player can move, gather, and work at a location in one turn
- [ ] World state persists (friends see changes you made)
- [ ] Score tracked and visible at Town Hall
- [ ] Game ends at day 30 with winner declared
- [ ] 24-hour auto-skip fires when a player doesn't act
- [ ] Works in mobile browser (web, responsive)

---

## Commit Policy

Every feature must have passing tests before commit. No exceptions.

```bash
cd frontend && npm test  # All tests must pass before commit
```

---

## Distribution (Post-MVP)

- Expo web export: `expo export --platform web`
- Deploy to Vercel for hackathon
- Post-hackathon: EAS Build → TestFlight → App Store / Google Play
