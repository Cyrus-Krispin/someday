import pool from '../config/db.js';
import { generateWorld, getSpawnPositions } from './worldGen.js';
import type { Tile } from './worldGen.js';

/**
 * Create a new world with generated map
 */
export const createWorld = async (seed: string): Promise<any> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Generate join code (6 character alphanumeric)
    const joinCode = generateJoinCode();

    // Create world record
    const worldResult = await client.query(
      `INSERT INTO worlds (seed, join_code, status)
       VALUES ($1, $2, 'ACTIVE')
       RETURNING id, seed, join_code, game_day, status, created_at`,
      [seed, joinCode]
    );

    const world = worldResult.rows[0];

    // Generate tiles
    const tiles: Tile[] = generateWorld(seed);

    // Bulk insert tiles
    const tileValues = tiles.map(tile => [
      world.id,
      tile.x,
      tile.y,
      tile.terrainType,
      tile.resourceType,
      tile.resourceQuantity,
      tile.ownerId,
      tile.structureType,
    ]);

    // Use unnest for bulk insert
    const insertQuery = `
      INSERT INTO tiles (world_id, x, y, terrain_type, resource_type, resource_quantity, owner_id, structure_type)
      SELECT * FROM UNNEST(
        $1::uuid[],
        $2::int[],
        $3::int[],
        $4::varchar[],
        $5::varchar[],
        $6::int[],
        $7::uuid[],
        $8::varchar[]
      )
    `;

    await client.query(insertQuery, [
      tileValues.map(t => t[0]),
      tileValues.map(t => t[1]),
      tileValues.map(t => t[2]),
      tileValues.map(t => t[3]),
      tileValues.map(t => t[4]),
      tileValues.map(t => t[5]),
      tileValues.map(t => t[6]),
      tileValues.map(t => t[7]),
    ]);

    await client.query('COMMIT');

    console.log(`World created: ${world.id} with seed ${seed} and join code ${joinCode}`);
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
 * Get world tiles (for sending to client)
 */
export const getWorldTiles = async (
  worldId: string,
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number
): Promise<any[]> => {
  const result = await pool.query(
    `SELECT * FROM tiles
     WHERE world_id = $1 AND x BETWEEN $2 AND $3 AND y BETWEEN $4 AND $5
     ORDER BY y, x`,
    [worldId, xMin, xMax, yMin, yMax]
  );
  return result.rows;
};

/**
 * Get full world data (all tiles)
 */
export const getWorldFullData = async (worldId: string): Promise<any[]> => {
  const result = await pool.query(
    'SELECT * FROM tiles WHERE world_id = $1 ORDER BY y, x',
    [worldId]
  );
  return result.rows;
};

/**
 * Get spawn positions for players
 */
export const getSpawnPositionsForWorld = async (worldId: string, playerCount: number): Promise<{ x: number; y: number }[]> => {
  const worldResult = await pool.query(
    'SELECT seed FROM worlds WHERE id = $1',
    [worldId]
  );

  if (worldResult.rows.length === 0) {
    throw new Error('World not found');
  }

  const seed = worldResult.rows[0].seed;
  return getSpawnPositions(playerCount, seed);
};

/**
 * Generate a random 6-character join code
 */
const generateJoinCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (0, O, 1, I)
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};
