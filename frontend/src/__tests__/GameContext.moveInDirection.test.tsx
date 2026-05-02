import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import type { TileData } from '../types';
import { WORLD_SIZE } from '../services/gameUtils';

// Mock socket to prevent real connections
vi.mock('../services/socket', () => ({
  listenForTurnStart: vi.fn(() => () => {}),
  connectSocket: vi.fn(),
  disconnectSocket: vi.fn(),
}));

// Controlled API mock
const mockCreateWorld = vi.fn();
const mockGetWorldState = vi.fn();
const mockGetTurnState = vi.fn();

vi.mock('../api/client', () => ({
  api: {
    createWorld: () => mockCreateWorld(),
    getWorldState: () => mockGetWorldState(),
    getTurnState: () => mockGetTurnState(),
    joinWorld: vi.fn(),
    processTurn: vi.fn(),
    endTurn: vi.fn(),
  },
  setToken: vi.fn(),
  getToken: vi.fn(),
}));

import { GameProvider, useGame } from '../contexts/GameContext';

const makeTile = (x: number, y: number, terrain_type = 'grassland'): TileData => ({
  id: `${x}-${y}`,
  world_id: 'w1',
  x,
  y,
  terrain_type,
  resource_type: 'crops',
  resource_quantity: 0,
  last_harvested_day: null,
  owner_id: null,
  structure_type: null,
});

const makeTurnState = (x = 5, y = 5) => ({
  currentPlayer: { id: 'p1', email: 'test@test.com', x, y, movementRemaining: 6, actionsRemaining: 2 },
  players: [{ id: 'p1', email: 'test@test.com', x, y, tokens: 0, score: 0 }],
  gameDay: 1,
  isPlayerTurn: true,
});

async function setupGameContext(tiles: TileData[], playerX = 5, playerY = 5) {
  mockCreateWorld.mockResolvedValue({
    world: { id: 'w1', joinCode: 'ABC', gameDay: 1, status: 'ACTIVE' },
  });
  mockGetWorldState.mockResolvedValue({
    world: { game_day: 1, status: 'ACTIVE', join_code: 'ABC' },
    tiles,
    viewport: { xMin: 0, xMax: 14, yMin: 0, yMax: 14 },
  });
  mockGetTurnState.mockResolvedValue(makeTurnState(playerX, playerY));

  const { result } = renderHook(() => useGame(), {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <GameProvider>{children}</GameProvider>
    ),
  });

  await act(async () => { await result.current.createWorld(); });
  await act(async () => { await result.current.loadWorldState(); });
  await act(async () => { await result.current.loadTurnState(); });

  return result;
}

describe('GameContext.moveInDirection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('queues a move to (playerX+1, playerY) when moving right', async () => {
    const tiles = [makeTile(5, 5), makeTile(6, 5)];
    const result = await setupGameContext(tiles, 5, 5);

    let success: boolean;
    await act(async () => { success = result.current.moveInDirection(1, 0); });

    expect(success!).toBe(true);
    expect(result.current.queuedActions).toHaveLength(1);
    expect(result.current.queuedActions[0]).toMatchObject({ type: 'move', targetX: 6, targetY: 5 });
  });

  it('queues a move to (playerX-1, playerY) when moving left', async () => {
    const tiles = [makeTile(5, 5), makeTile(4, 5)];
    const result = await setupGameContext(tiles, 5, 5);

    await act(async () => { result.current.moveInDirection(-1, 0); });

    expect(result.current.queuedActions[0]).toMatchObject({ type: 'move', targetX: 4, targetY: 5 });
  });

  it('chains off simulatedPosition — second move targets next position, not player start', async () => {
    const tiles = [makeTile(5, 5), makeTile(6, 5), makeTile(7, 5)];
    const result = await setupGameContext(tiles, 5, 5);

    await act(async () => { result.current.moveInDirection(1, 0); }); // → (6,5)
    await act(async () => { result.current.moveInDirection(1, 0); }); // → (7,5) from simulated (6,5)

    expect(result.current.queuedActions).toHaveLength(2);
    expect(result.current.queuedActions[1]).toMatchObject({ type: 'move', targetX: 7, targetY: 5 });
  });

  it('returns false and does not queue when target is water', async () => {
    const tiles = [makeTile(5, 5), makeTile(6, 5, 'water')];
    const result = await setupGameContext(tiles, 5, 5);

    let success: boolean;
    await act(async () => { success = result.current.moveInDirection(1, 0); });

    expect(success!).toBe(false);
    expect(result.current.queuedActions).toHaveLength(0);
  });

  it('returns false when movementRemaining is insufficient for terrain cost', async () => {
    const tiles = Array.from({ length: 103 }, (_, i) => makeTile(5 + i, 5));
    const result = await setupGameContext(tiles, 5, 5);

    for (let i = 0; i < 100; i++) {
      await act(async () => { result.current.moveInDirection(1, 0); });
    }

    let success: boolean;
    await act(async () => { success = result.current.moveInDirection(1, 0); });

    expect(success!).toBe(false);
    expect(result.current.queuedActions).toHaveLength(100);
  });

  it('returns false when target is out of world bounds (negative)', async () => {
    const tiles = [makeTile(0, 0)];
    const result = await setupGameContext(tiles, 0, 0);

    let success: boolean;
    await act(async () => { success = result.current.moveInDirection(-1, 0); });

    expect(success!).toBe(false);
    expect(result.current.queuedActions).toHaveLength(0);
  });

  it('returns false when target is out of world bounds (exceeds WORLD_SIZE)', async () => {
    const max = WORLD_SIZE - 1;
    const tiles = [makeTile(max, max)];
    const result = await setupGameContext(tiles, max, max);

    let success: boolean;
    await act(async () => { success = result.current.moveInDirection(1, 0); });

    expect(success!).toBe(false);
    expect(result.current.queuedActions).toHaveLength(0);
  });
});
