import type { StructureConfig } from '../types';

// Re-export terrain computation from shared module
export {
  WORLD_SIZE,
  VIEWPORT_RADIUS,
  TERRAIN,
  getMoveCost,
  getTerrainFromNoise,
  getTerrainAt,
  hashSeed,
  MAX_MOVEMENT,
  MAX_ACTIONS,
} from '../shared/terrain';

export const STRUCTURES: Record<string, StructureConfig> = {
  mine: { type: 'mine', emoji: '⛏️', description: 'Work → earn ore + gem chance' },
  farm: { type: 'farm', emoji: '🌾', description: 'Work → earn crops' },
  market: { type: 'market', emoji: '🏪', description: 'Buy/sell resources' },
  town_hall: { type: 'town_hall', emoji: '🏛️', description: 'Leaderboard & events' },
  cabin: { type: 'cabin', emoji: '🏠', description: '+2 tokens per day' },
};

export const RESOURCE_VALUES: Record<string, number> = {
  crops: 1,
  fish: 2,
  lumber: 2,
  ore: 3,
  gems: 10,
  rare_gems: 10,
};

export const getResourceValue = (resourceType: string): number => {
  return RESOURCE_VALUES[resourceType] ?? 0;
};
