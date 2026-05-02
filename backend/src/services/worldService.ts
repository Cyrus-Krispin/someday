import pool from '../config/db.js';
import { getStructurePositions, getSpawnPositions, generateViewportTiles, WORLD_SIZE } from './worldGen.js';
import type { Tile } from './worldGen.js';

/**
 * Create a new world — only stores structures in tile_state, terrain is computed on-the-fly
 */
export const createWorld = async (seed: string): Promise<any> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const joinCode = generateJoinCode();

    // Create world record
    const worldResult = await client.query(
      `INSERT INTO worlds (seed, join_code, status, world_size)
       VALUES ($1, $2, 'ACTIVE', $3)
       RETURNING id, seed, join_code, game_day, status, world_size, created_at`,
      [seed, joinCode, WORLD_SIZE]
    );

    const world = worldResult.rows[0];

    // Only store structure tiles in tile_state (not all tiles)
    const structures = getStructurePositions(seed, WORLD_SIZE);
    for (const s of structures) {
      await client.query(
        `INSERT INTO tile_state (world_id, x, y, resource_type, resource_quantity, structure_type)
         VALUES ($1, $2, $3, '', 0, $4)`,
        [world.id, s.x, s.y, s.structureType]
      );
    }

    await client.query('COMMIT');

    console.log(`World created: ${world.id} with seed ${seed} (${WORLD_SIZE}x${WORLD_SIZE}) and join code ${joinCode}`);
    return world;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating world:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get world by join code
 */
export const getWorldByJoinCode = async (joinCode: string): Promise<any> => {
  const result = await pool.query(
    'SELECT * FROM worlds WHERE join_code = $1',
    [joinCode]
  );
  return result.rows[0];
};

/**
 * Get tile states (only mutated tiles) in a viewport bounding box
 */
export const getTileStates = async (
  worldId: string,
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number
): Promise<any[]> => {
  const result = await pool.query(
    `SELECT x, y, resource_type, resource_quantity, structure_type, owner_id
     FROM tile_state
     WHERE world_id = $1 AND x BETWEEN $2 AND $3 AND y BETWEEN $4 AND $5
     ORDER BY y, x`,
    [worldId, xMin, xMax, yMin, yMax]
  );
  return result.rows;
};

/**
 * Get tiles for viewport — combines on-the-fly terrain generation with stored tile states
 */
export const getWorldTiles = async (
  worldId: string,
  seed: string,
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number,
  worldSize: number = WORLD_SIZE
): Promise<Tile[]> => {
  const tileStates = await getTileStates(worldId, xMin, yMin, xMax, yMax);
  return generateViewportTiles(seed, xMin, yMin, xMax, yMax, tileStates, worldSize);
};

/**
 * Get full world data — not recommended for large worlds
 */
export const getWorldFullData = async (worldId: string): Promise<any[]> => {
  const result = await pool.query(
    'SELECT * FROM tile_state WHERE world_id = $1 ORDER BY y, x',
    [worldId]
  );
  return result.rows;
};

/**
 * Get spawn positions for players
 */
export const getSpawnPositionsForWorld = async (worldId: string, playerCount: number): Promise<{ x: number; y: number }[]> => {
  const worldResult = await pool.query(
    'SELECT seed, world_size FROM worlds WHERE id = $1',
    [worldId]
  );

  if (worldResult.rows.length === 0) {
    throw new Error('World not found');
  }

  const { seed, world_size } = worldResult.rows[0];
  return getSpawnPositions(playerCount, seed, world_size || WORLD_SIZE);
};

/**
 * Get the player's current world with player count
 */
export const getPlayerWorld = async (playerId: string): Promise<any> => {
  const result = await pool.query(
    `SELECT w.id, w.seed, w.join_code, w.game_day, w.status, w.world_size, w.created_at,
            COUNT(p.id)::int as player_count
     FROM worlds w
     LEFT JOIN players p ON p.world_id = w.id
     WHERE w.id = (
       SELECT world_id FROM players WHERE id = $1
     )
     GROUP BY w.id`,
    [playerId]
  );
  return result.rows[0] || null;
};

/**
 * Get world seed and size
 */
export const getWorldMeta = async (worldId: string): Promise<{ seed: string; worldSize: number } | null> => {
  const result = await pool.query(
    'SELECT seed, world_size FROM worlds WHERE id = $1',
    [worldId]
  );
  if (result.rows.length === 0) return null;
  return { seed: result.rows[0].seed, worldSize: result.rows[0].world_size || WORLD_SIZE };
};

/**
 * Update a tile's resource quantity
 */
export const updateTileResource = async (worldId: string, x: number, y: number, resourceType: string, quantity: number, lastHarvestedDay: number | null): Promise<void> => {
  await pool.query(
    `INSERT INTO tile_state (world_id, x, y, resource_type, resource_quantity, last_harvested_day)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (world_id, x, y)
     DO UPDATE SET resource_quantity = $5, last_harvested_day = $6`,
    [worldId, x, y, resourceType, quantity, lastHarvestedDay]
  );
};

/**
 * Generate a random 6-character join code
 */
const generateJoinCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};
