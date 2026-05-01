import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { api } from '../api/client';
import { listenForTurnStart } from '../services/socket';
import type { TileData, TurnState, QueuedAction, WorldState } from '../types';
import { MAX_MOVEMENT, MAX_ACTIONS, getMoveCost } from '../services/gameUtils';

interface GameState {
  world: {
    id: string;
    joinCode: string;
    gameDay: number;
    status: string;
  } | null;
  tiles: TileData[];
  viewport: { xMin: number; xMax: number; yMin: number; yMax: number } | null;
  turnState: TurnState | null;
  queuedActions: QueuedAction[];
  movementUsed: number;
  actionsUsed: number;
  loading: boolean;
  error: string | null;
}

type GameAction =
  | { type: 'SET_WORLD'; world: GameState['world']; tiles: TileData[]; viewport: GameState['viewport'] }
  | { type: 'SET_TURN_STATE'; turnState: TurnState }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'QUEUE_ACTION'; action: QueuedAction }
  | { type: 'CLEAR_ACTIONS' }
  | { type: 'RESET' }
  | { type: 'SET_TILES'; tiles: TileData[] };

const initialState: GameState = {
  world: null,
  tiles: [],
  viewport: null,
  turnState: null,
  queuedActions: [],
  movementUsed: 0,
  actionsUsed: 0,
  loading: false,
  error: null,
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_WORLD':
      return { ...state, world: action.world, tiles: action.tiles, viewport: action.viewport };
    case 'SET_TILES':
      return { ...state, tiles: action.tiles };
    case 'SET_TURN_STATE':
      return { ...state, turnState: action.turnState };
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    case 'SET_ERROR':
      return { ...state, error: action.error, loading: false };
    case 'QUEUE_ACTION': {
      const cost = action.action.type === 'move'
        ? (getMoveCost(action.action.targetX !== undefined && action.action.targetY !== undefined
            ? state.tiles.find(t => t.x === action.action.targetX && t.y === action.action.targetY)?.terrain_type || 'grassland'
            : 'grassland') ?? 999)
        : action.action.type === 'gather' || action.action.type === 'work' ? 0 : 0;

      return {
        ...state,
        queuedActions: [...state.queuedActions, action.action],
        movementUsed: action.action.type === 'move' ? state.movementUsed + (cost || 0) : state.movementUsed,
        actionsUsed: action.action.type === 'gather' || action.action.type === 'work'
          ? state.actionsUsed + 1
          : state.actionsUsed,
      };
    }
    case 'CLEAR_ACTIONS':
      return { ...state, queuedActions: [], movementUsed: 0, actionsUsed: 0 };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
};

interface GameContextValue extends GameState {
  createWorld: () => Promise<void>;
  joinWorld: (joinCode: string) => Promise<void>;
  loadWorldState: () => Promise<void>;
  loadTurnState: () => Promise<void>;
  queueAction: (action: QueuedAction) => boolean;
  clearActions: () => void;
  endTurn: () => Promise<void>;
  movementRemaining: number;
  actionsRemaining: number;
}

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const movementRemaining = MAX_MOVEMENT - state.movementUsed;
  const actionsRemaining = MAX_ACTIONS - state.actionsUsed;

  const createWorld = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      const data = await api.createWorld();
      dispatch({
        type: 'SET_WORLD',
        world: { id: data.world.id, joinCode: data.world.joinCode, gameDay: data.world.gameDay, status: data.world.status },
        tiles: [],
        viewport: null,
      });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', error: err.message });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  }, []);

  const joinWorld = useCallback(async (joinCode: string) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      const data = await api.joinWorld(joinCode);
      dispatch({
        type: 'SET_WORLD',
        world: { id: data.world.id, joinCode: data.world.joinCode, gameDay: data.world.gameDay, status: 'ACTIVE' },
        tiles: [],
        viewport: null,
      });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', error: err.message });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  }, []);

  const loadWorldState = useCallback(async () => {
    try {
      const data = await api.getWorldState();
      dispatch({
        type: 'SET_WORLD',
        world: {
          ...state.world!,
          gameDay: data.world.game_day,
          status: data.world.status,
          joinCode: data.world.join_code,
        },
        tiles: data.tiles,
        viewport: data.viewport,
      });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', error: err.message });
    }
  }, [state.world]);

  const loadTurnState = useCallback(async () => {
    try {
      const data = await api.getTurnState();
      dispatch({ type: 'SET_TURN_STATE', turnState: data });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', error: err.message });
    }
  }, []);

  const queueAction = useCallback((action: QueuedAction): boolean => {
    if (action.type === 'move') {
      const terrainType = state.tiles.find(
        t => t.x === action.targetX && t.y === action.targetY
      )?.terrain_type || 'grassland';
      const cost = getMoveCost(terrainType);
      if (cost === null) return false; // water
      if (movementRemaining < cost) return false;
    }
    if (action.type === 'gather' || action.type === 'work') {
      if (actionsRemaining <= 0) return false;
    }
    dispatch({ type: 'QUEUE_ACTION', action });
    return true;
  }, [state.tiles, movementRemaining, actionsRemaining]);

  const clearActions = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIONS' });
  }, []);

  const endTurn = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      await api.processTurn(state.queuedActions);
      await api.endTurn();
      dispatch({ type: 'CLEAR_ACTIONS' });
      // Reload state after ending turn
      await loadWorldState();
      await loadTurnState();
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', error: err.message });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  }, [state.queuedActions, loadWorldState, loadTurnState]);

  return (
    <GameContext.Provider
      value={{
        ...state,
        createWorld,
        joinWorld,
        loadWorldState,
        loadTurnState,
        queueAction,
        clearActions,
        endTurn,
        movementRemaining,
        actionsRemaining,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextValue => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};
