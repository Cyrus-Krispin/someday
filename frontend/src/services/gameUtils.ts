import type { TerrainConfig, StructureConfig } from '../types';

export const TERRAIN: Record<string, TerrainConfig> = {
  grassland: {
    type: 'grassland',
    moveCost: 1,
    resource: 'crops',
    emoji: '🌿',
    color: '#4a7c3f',
    bgColor: '#c8e6c9',
  },
  forest: {
    type: 'forest',
    moveCost: 2,
    resource: 'lumber',
    emoji: '🌲',
    color: '#2e5c1e',
    bgColor: '#81c784',
  },
  mountain: {
    type: 'mountain',
    moveCost: 3,
    resource: 'ore',
    emoji: '⛰️',
    color: '#6d6d6d',
    bgColor: '#bdbdbd',
  },
  desert: {
    type: 'desert',
    moveCost: 2,
    resource: 'rare_gems',
    emoji: '🏜️',
    color: '#c9a23b',
    bgColor: '#ffe0b2',
  },
  water: {
    type: 'water',
    moveCost: null,
    resource: 'fish',
    emoji: '🌊',
    color: '#2563eb',
    bgColor: '#93c5fd',
  },
};

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

export const getMoveCost = (terrainType: string): number | null => {
  const terrain = TERRAIN[terrainType];
  if (!terrain) return 1;
  return terrain.moveCost; // null means impassable (water)
};

export const getResourceValue = (resourceType: string): number => {
  return RESOURCE_VALUES[resourceType] ?? 0;
};

export const MAX_MOVEMENT = 6;
export const MAX_ACTIONS = 2;
export const WORLD_SIZE = 30;
export const VIEWPORT_RADIUS = 7;
