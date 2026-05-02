import { createNoise2D } from 'simplex-noise';

export const WORLD_SIZE = 1000;
export const VIEWPORT_RADIUS = 7;

// Hash string seed to a seeded random function for simplex-noise v4.x
export const hashSeed = (seed: string): (() => number) | undefined => {
  if (!seed) return undefined;

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  let state = hash | 0;
  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export interface TerrainConfig {
  type: string;
  moveCost: number | null;
  resource: string;
  emoji: string;
  color: string;
  bgColor: string;
}

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

// Map noise value to terrain type key
export const getTerrainFromNoise = (noise: number): string => {
  if (noise < -0.5) return 'water';
  if (noise < -0.2) return 'desert';
  if (noise < 0.1) return 'grassland';
  if (noise < 0.6) return 'forest';
  return 'mountain';
};

// Get terrain type at a specific world coordinate (stateless, deterministic)
export const getTerrainAt = (x: number, y: number, seed: string): string => {
  const noise2D = createNoise2D(hashSeed(seed));
  const noise = noise2D(x / 10, y / 10);
  return getTerrainFromNoise(noise);
};

// Movement cost lookup
export const getMoveCost = (terrainType: string): number | null => {
  const terrain = TERRAIN[terrainType];
  if (!terrain) return 1;
  return terrain.moveCost;
};

export const MAX_MOVEMENT = 100;
export const MAX_ACTIONS = 2;
