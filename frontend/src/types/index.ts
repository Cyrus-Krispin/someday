export interface Player {
  id: string;
  email: string;
  x: number;
  y: number;
  tokens: number;
  score: number;
  movementRemaining: number;
  actionsRemaining: number;
  worldId: string | null;
}

export interface World {
  id: string;
  seed: string;
  joinCode: string;
  gameDay: number;
  status: string;
}

export interface TileData {
  id: string;
  world_id: string;
  x: number;
  y: number;
  terrain_type: string;
  resource_type: string;
  resource_quantity: number;
  last_harvested_day: number | null;
  owner_id: string | null;
  structure_type: string | null;
}

export interface WorldState {
  world: {
    game_day: number;
    status: string;
    join_code: string;
  };
  tiles: TileData[];
  viewport: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  };
}

export interface TurnState {
  currentPlayer: {
    id: string;
    email: string;
    x: number;
    y: number;
    movementRemaining: number;
    actionsRemaining: number;
  };
  players: Array<{
    id: string;
    email: string;
    x: number;
    y: number;
    tokens: number;
    score: number;
  }>;
  gameDay: number;
  isPlayerTurn: boolean;
}

export interface PlayerProfile {
  id: string;
  email: string;
  tokens: number;
  score: number;
  world_id: string | null;
  x: number;
  y: number;
  movement_remaining: number;
  actions_remaining: number;
}

export interface QueuedAction {
  type: 'move' | 'gather' | 'work';
  targetX?: number;
  targetY?: number;
  structureType?: string;
}

export interface AuthResponse {
  token: string;
  player: {
    id: string;
    email: string;
    tokens: number;
    score: number;
    worldId?: string;
  };
}

export interface TerrainConfig {
  type: string;
  moveCost: number | null;
  resource: string;
  emoji: string;
  color: string;
  bgColor: string;
}

export interface StructureConfig {
  type: string;
  emoji: string;
  description: string;
}
