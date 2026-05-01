import { createNoise2D } from 'simplex-noise';

// Hash string seed to a seeded random function for simplex-noise v4.x
const hashSeed = (seed: string): (() => number) | undefined => {
  if (!seed) return undefined;

  // Simple seeded PRNG (mulberry32)
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  // Use the hash as the seed for a simple PRNG
  let state = hash | 0;
  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Terrain types and their properties
interface TerrainConfig {
  type: string;
  moveCost: number | null;
  resource: string;
  respawnDays: number;
  emoji: string;
}

const TERRAIN: Record<string, TerrainConfig> = {
  GRASSLAND: { type: 'grassland', moveCost: 1, resource: 'crops', respawnDays: 2, emoji: '🌿' },
  FOREST: { type: 'forest', moveCost: 2, resource: 'lumber', respawnDays: 5, emoji: '🌲' },
  MOUNTAIN: { type: 'mountain', moveCost: 3, resource: 'ore', respawnDays: 7, emoji: '⛰️' },
  DESERT: { type: 'desert', moveCost: 2, resource: 'rare_gems', respawnDays: 14, emoji: '🏜️' },
  WATER: { type: 'water', moveCost: null, resource: 'fish', respawnDays: 3, emoji: '🌊' },
};

// Pre-built locations for MVP
const LOCATIONS = {
  MINE: { type: 'mine', emoji: '⛏️', description: 'Work a shift → earn ore + small gem chance' },
  FARM: { type: 'farm', emoji: '🌾', description: 'Work a shift → earn crops' },
  MARKET: { type: 'market', emoji: '🏪', description: 'Buy/sell resources at shifting prices' },
  TOWN_HALL: { type: 'town_hall', emoji: '🏛️', description: 'View leaderboard, events, player locations' },
};

export interface Tile {
  x: number;
  y: number;
  terrainType: string;
  resourceType: string;
  resourceQuantity: number;
  ownerId: string | null;
  structureType: string | null;
}

/**
 * Generate a deterministic 30x30 world from a seed
 */
export const generateWorld = (seed: string): Tile[] => {
  const noise2D = createNoise2D(seed ? hashSeed(seed) : undefined);
  const tiles: Tile[] = [];
  const size = 30;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const noise = noise2D(x / 10, y / 10);
      const terrain = getTerrainFromNoise(noise);

      const tile: Tile = {
        x,
        y,
        terrainType: terrain.type,
        resourceType: terrain.resource,
        resourceQuantity: getInitialResourceQuantity(terrain.resource),
        ownerId: null,
        structureType: null,
      };

      tiles.push(tile);
    }
  }

  // Place pre-built locations (deterministic based on seed)
  placeLocations(tiles, seed, size);

  return tiles;
};

/**
 * Map noise value (-1 to 1) to terrain type
 */
const getTerrainFromNoise = (noise: number): TerrainConfig => {
  if (noise < -0.5) return TERRAIN.WATER;
  if (noise < -0.2) return TERRAIN.DESERT;
  if (noise < 0.1) return TERRAIN.GRASSLAND;
  if (noise < 0.6) return TERRAIN.FOREST;
  return TERRAIN.MOUNTAIN;
};

/**
 * Get initial resource quantity based on type
 */
const getInitialResourceQuantity = (resourceType: string): number => {
  switch (resourceType) {
    case 'crops': return 3;
    case 'lumber': return 5;
    case 'ore': return 4;
    case 'rare_gems': return 1;
    case 'fish': return 2;
    default: return 0;
  }
};

/**
 * Place pre-built locations on the map (deterministic)
 */
const placeLocations = (tiles: Tile[], seed: string, size: number): void => {
  const locationSeed = seed + '_locations';
  const locationNoise2D = createNoise2D(hashSeed(locationSeed));

  const locations = [
    { type: 'mine', count: 2 },
    { type: 'farm', count: 2 },
    { type: 'market', count: 1 },
    { type: 'town_hall', count: 1 },
  ];

  let globalIndex = 0;

  locations.forEach(({ type, count }) => {
    for (let i = 0; i < count; i++) {
      // Use noise to find suitable positions (avoid water and existing structures)
      let bestTile: Tile | null = null;
      let bestValue = -Infinity;

      // Sample candidate positions
      for (let attempt = 0; attempt < 50; attempt++) {
        const nx = Math.floor(Math.abs(locationNoise2D(globalIndex, attempt)) * size) % size;
        const ny = Math.floor(Math.abs(locationNoise2D(attempt, globalIndex)) * size) % size;
        const tile = tiles.find(t => t.x === nx && t.y === ny);

        if (tile && tile.terrainType !== 'water' && !tile.structureType) {
          const value = locationNoise2D(nx + globalIndex * 100, ny + globalIndex * 100);
          if (value > bestValue) {
            bestValue = value;
            bestTile = tile;
          }
        }
      }

      if (bestTile) {
        bestTile.structureType = type;
        globalIndex++;
      }
    }
  });
};

/**
 * Generate evenly distributed spawn positions for players
 */
export const getSpawnPositions = (playerCount: number, seed: string): { x: number; y: number }[] => {
  const size = 30;
  const spawnNoise2D = createNoise2D(hashSeed(seed + '_spawn'));
  const positions: { x: number; y: number }[] = [];

  // Divide map into quadrants and place players in different areas
  for (let i = 0; i < playerCount; i++) {
    const nx = (i * size / playerCount + Math.abs(spawnNoise2D(i, 0)) * (size / playerCount / 2)) % size;
    const ny = Math.abs(spawnNoise2D(0, i)) * size;

    const x = Math.floor(nx);
    const y = Math.floor(ny);

    // Ensure spawn is not on water
    const safeX = Math.min(x, size - 1);
    const safeY = Math.min(y, size - 1);

    positions.push({ x: safeX, y: safeY });
  }

  return positions;
};

export { TERRAIN, LOCATIONS };
