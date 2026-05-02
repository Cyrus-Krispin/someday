import { createNoise2D } from 'simplex-noise';
import {
  hashSeed,
  getTerrainFromNoise,
  getInitialResourceQuantity,
  getStructures,
  getSpawnPositions,
  WORLD_SIZE,
  TERRAIN,
} from '../shared/terrain.js';
import type { TerrainConfig } from '../shared/terrain.js';

// Pre-built location definitions for MVP
const LOCATIONS: Record<string, { type: string; emoji: string; description: string }> = {
  MINE: { type: 'mine', emoji: '⛏️', description: 'Work a shift → earn ore + small gem chance' },
  FARM: { type: 'farm', emoji: '🌾', description: 'Work a shift → earn crops' },
  MARKET: { type: 'market', emoji: '🏪', description: 'Buy/sell resources at shifting prices' },
  TOWN_HALL: { type: 'town_hall', emoji: '🏛️', description: 'View leaderboard, events, player locations' },
};

// Tile format matching the frontend's TileData type (snake_case fields from DB)
export interface Tile {
  id?: string;
  world_id?: string;
  x: number;
  y: number;
  terrain_type: string;
  resource_type: string;
  resource_quantity: number;
  last_harvested_day?: number | null;
  owner_id: string | null;
  structure_type: string | null;
}

/**
 * Generate deterministic structure positions for the world.
 * Terrain is NOT pre-computed — it's generated on-the-fly.
 */
export const getStructurePositions = (seed: string, worldSize: number = WORLD_SIZE): Array<{ x: number; y: number; structureType: string }> => {
  return getStructures(seed, worldSize);
};

/**
 * Generate tiles for a viewport region (for sending to client).
 * Computes terrain on-the-fly from seed + merges with tile_state rows.
 */
export const generateViewportTiles = (
  seed: string,
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number,
  tileStates: Array<{ x: number; y: number; resource_type: string; resource_quantity: number; structure_type: string | null; owner_id: string | null; id?: string; world_id?: string }>,
  worldSize: number = WORLD_SIZE
): Tile[] => {
  const noise2D = createNoise2D(hashSeed(seed));
  const tileStateMap = new Map<string, any>();
  for (const ts of tileStates) {
    tileStateMap.set(`${ts.x},${ts.y}`, ts);
  }

  const tiles: Tile[] = [];
  for (let x = Math.max(0, xMin); x <= Math.min(worldSize - 1, xMax); x++) {
    for (let y = Math.max(0, yMin); y <= Math.min(worldSize - 1, yMax); y++) {
      const noise = noise2D(x / 10, y / 10);
      const terrain = getTerrainFromNoise(noise);
      const state = tileStateMap.get(`${x},${y}`);

      tiles.push({
        x,
        y,
        terrain_type: terrain.type,
        resource_type: state?.resource_type ?? terrain.resource,
        resource_quantity: state?.resource_quantity ?? getInitialResourceQuantity(terrain.resource),
        owner_id: state?.owner_id ?? null,
        structure_type: state?.structure_type ?? null,
      });
    }
  }

  return tiles;
};

export { TERRAIN, LOCATIONS, getSpawnPositions, WORLD_SIZE, hashSeed };
