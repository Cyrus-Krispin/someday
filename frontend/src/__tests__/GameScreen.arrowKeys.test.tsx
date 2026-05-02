import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import React from 'react';

// Mock AuthContext
const mockPlayer = { id: 'p1', email: 'test@test.com', tokens: 0, score: 0, world_id: 'w1', x: 5, y: 5, movement_remaining: 6, actions_remaining: 2 };
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    player: mockPlayer,
    refreshProfile: vi.fn(),
    loading: false,
    error: null,
    token: 'tok',
  }),
}));

// Mock socket
vi.mock('../services/socket', () => ({
  listenForTurnStart: vi.fn(() => () => {}),
  connectSocket: vi.fn(),
  disconnectSocket: vi.fn(),
}));

// Controlled moveInDirection mock
const mockMoveInDirection = vi.fn().mockReturnValue(true);
let mockIsPlayerTurn = true;

vi.mock('../contexts/GameContext', () => ({
  useGame: () => ({
    world: { id: 'w1', joinCode: 'ABC', gameDay: 1, status: 'ACTIVE' },
    tiles: [],
    turnState: { isPlayerTurn: mockIsPlayerTurn, currentPlayer: { id: 'p1', x: 5, y: 5, movementRemaining: 6, actionsRemaining: 2 }, players: [], gameDay: 1 },
    queuedActions: [],
    movementRemaining: 6,
    actionsRemaining: 2,
    simulatedPosition: { x: 5, y: 5 },
    loadWorldState: vi.fn().mockResolvedValue(undefined),
    loadTurnState: vi.fn().mockResolvedValue(undefined),
    endTurn: vi.fn().mockResolvedValue(undefined),
    moveInDirection: mockMoveInDirection,
    loading: false,
    error: null,
  }),
  GameProvider: ({ children }: any) => children,
}));

// Mock navigation
vi.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: vi.fn() }),
}));

// Mock safe area insets
vi.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

import { GameScreen } from '../screens/GameScreen';

function fireKey(key: string) {
  act(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  });
}

describe('GameScreen arrow key handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMoveInDirection.mockReturnValue(true);
    mockIsPlayerTurn = true;
  });

  it('ArrowRight calls moveInDirection(1, 0)', () => {
    render(<GameScreen navigation={{ navigate: vi.fn() }} />);
    fireKey('ArrowRight');
    expect(mockMoveInDirection).toHaveBeenCalledWith(1, 0);
  });

  it('ArrowLeft calls moveInDirection(-1, 0)', () => {
    render(<GameScreen navigation={{ navigate: vi.fn() }} />);
    fireKey('ArrowLeft');
    expect(mockMoveInDirection).toHaveBeenCalledWith(-1, 0);
  });

  it('ArrowUp calls moveInDirection(0, -1)', () => {
    render(<GameScreen navigation={{ navigate: vi.fn() }} />);
    fireKey('ArrowUp');
    expect(mockMoveInDirection).toHaveBeenCalledWith(0, -1);
  });

  it('ArrowDown calls moveInDirection(0, 1)', () => {
    render(<GameScreen navigation={{ navigate: vi.fn() }} />);
    fireKey('ArrowDown');
    expect(mockMoveInDirection).toHaveBeenCalledWith(0, 1);
  });

  it('non-arrow keys do not call moveInDirection', () => {
    render(<GameScreen navigation={{ navigate: vi.fn() }} />);
    fireKey('Enter');
    fireKey('Space');
    fireKey('a');
    expect(mockMoveInDirection).not.toHaveBeenCalled();
  });

  it('arrow keys are ignored when isPlayerTurn is false', async () => {
    mockIsPlayerTurn = false;
    const { unmount } = render(<GameScreen navigation={{ navigate: vi.fn() }} />);
    fireKey('ArrowRight');
    expect(mockMoveInDirection).not.toHaveBeenCalled();
    unmount();
  });

  it('event listener is cleaned up on unmount', () => {
    const { unmount } = render(<GameScreen navigation={{ navigate: vi.fn() }} />);
    unmount();
    fireKey('ArrowRight');
    expect(mockMoveInDirection).not.toHaveBeenCalled();
  });
});
