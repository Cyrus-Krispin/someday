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
  respawnDays: number;
  emoji: string;
}

export const TERRAIN: Record<string, TerrainConfig> = {
  GRASSLAND: { type: 'grassland', moveCost: 1, resource: 'crops', respawnDays: 2, emoji: '🌿' },
  FOREST: { type: 'forest', moveCost: 2, resource: 'lumber', respawnDays: 5, emoji: '🌲' },
  MOUNTAIN: { type: 'mountain', moveCost: 3, resource: 'ore', respawnDays: 7, emoji: '⛰️' },
  DESERT: { type: 'desert', moveCost: 2, resource: 'rare_gems', respawnDays: 14, emoji: '🏜️' },
  WATER: { type: 'water', moveCost: null, resource: 'fish', respawnDays: 3, emoji: '🌊' },
};

// Map noise value to terrain type
export const getTerrainFromNoise = (noise: number): TerrainConfig => {
  if (noise < -0.5) return TERRAIN.WATER;
  if (noise < -0.2) return TERRAIN.DESERT;
  if (noise < 0.1) return TERRAIN.GRASSLAND;
  if (noise < 0.6) return TERRAIN.FOREST;
  return TERRAIN.MOUNTAIN;
};

// Get terrain type at a specific world coordinate (stateless, deterministic)
export const getTerrainAt = (x: number, y: number, seed: string): TerrainConfig => {
  const noise2D = createNoise2D(hashSeed(seed));
  const noise = noise2D(x / 10, y / 10);
  return getTerrainFromNoise(noise);
};

// Get initial resource quantity based on terrain resource type
export const getInitialResourceQuantity = (resourceType: string): number => {
  switch (resourceType) {
    case 'crops': return 3;
    case 'lumber': return 5;
    case 'ore': return 4;
    case 'rare_gems': return 1;
    case 'fish': return 2;
    default: return 0;
  }
};

// Generate spawn positions for players, distributed around the world center
export const getSpawnPositions = (playerCount: number, seed: string, worldSize: number = WORLD_SIZE): { x: number; y: number }[] => {
  const center = worldSize / 2;
  const radius = worldSize / 4;
  const spawnNoise2D = createNoise2D(hashSeed(seed + '_spawn'));
  const positions: { x: number; y: number }[] = [];

  for (let i = 0; i < playerCount; i++) {
    const baseAngle = (i / Math.max(playerCount, 1)) * 2 * Math.PI;
    const angleJitter = spawnNoise2D(i + 1.5, 0.5) * 0.4;
    const angle = baseAngle + angleJitter;

    const r = radius * (0.8 + Math.abs(spawnNoise2D(0.5, i + 1.5)) * 0.4);
    const x = Math.round(center + Math.cos(angle) * r);
    const y = Math.round(center + Math.sin(angle) * r);

    positions.push({
      x: Math.max(0, Math.min(worldSize - 1, x)),
      y: Math.max(0, Math.min(worldSize - 1, y)),
    });
  }

  return positions;
};

// Deterministic structure placement — returns list of {x, y, structureType} without iterating all tiles
export const getStructures = (seed: string, worldSize: number = WORLD_SIZE): Array<{ x: number; y: number; structureType: string }> => {
  const locationSeed = seed + '_locations';
  const locationNoise2D = createNoise2D(hashSeed(locationSeed));

  const structureDefs = [
    { type: 'mine', count: 4 },
    { type: 'farm', count: 4 },
    { type: 'market', count: 2 },
    { type: 'town_hall', count: 1 },
  ];

  const structures: Array<{ x: number; y: number; structureType: string }> = [];
  let globalIndex = 0;

  structureDefs.forEach(({ type, count }) => {
    for (let i = 0; i < count; i++) {
      for (let attempt = 0; attempt < 100; attempt++) {
        const nx = Math.floor(Math.abs(locationNoise2D(globalIndex, attempt)) * worldSize) % worldSize;
        const ny = Math.floor(Math.abs(locationNoise2D(attempt, globalIndex)) * worldSize) % worldSize;

        // Avoid water
        const terrain = getTerrainAt(nx, ny, seed);
        if (terrain.type === 'water') continue;

        // Avoid overlapping existing structures
        const alreadyPlaced = structures.some(s => s.x === nx && s.y === ny);
        if (alreadyPlaced) continue;

        structures.push({ x: nx, y: ny, structureType: type });
        globalIndex++;
        break;
      }
    }
  });

  return structures;
};

// Movement cost lookup
export const getMoveCost = (terrainType: string): number | null => {
  const terrain = TERRAIN[terrainType.toUpperCase()] || Object.values(TERRAIN).find(t => t.type === terrainType);
  return terrain ? terrain.moveCost : 1;
};
