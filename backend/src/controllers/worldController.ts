import pool from '../config/db.js';
import { createWorld as createWorldService, getWorldByJoinCode, getSpawnPositionsForWorld, getWorldTiles, getPlayerWorld, getWorldMeta, updateTileResource } from '../services/worldService.js';
import { WORLD_SIZE, getTerrainAt } from '../shared/terrain.js';
import type { Request, Response } from 'express';

/**
 * Create a new world with generated map
 */
export const createWorld = async (req: Request, res: Response) => {
  const playerId = req.playerId!;

  try {
    const playerResult = await pool.query(
      'SELECT world_id FROM players WHERE id = $1',
      [playerId]
    );
    if (playerResult.rows[0]?.world_id) {
      return res.status(400).json({ error: 'Player already in a world' });
    }

    const seed = `world_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const world = await createWorldService(seed);

    const spawnPositions = await getSpawnPositionsForWorld(world.id, 1);
    const spawnPos = spawnPositions[0];

    await pool.query(
      `UPDATE players SET world_id = $1, x = $2, y = $3, movement_remaining = 100, actions_remaining = 2 WHERE id = $4`,
      [world.id, spawnPos.x, spawnPos.y, playerId]
    );

    const resourceTypes = ['crops', 'fish', 'lumber', 'ore', 'gems'];
    for (const type of resourceTypes) {
      await pool.query(
        `INSERT INTO resources (player_id, type, quantity) VALUES ($1, $2, 0) ON CONFLICT (player_id, type) DO NOTHING`,
        [playerId, type]
      );
    }

    res.status(201).json({
      message: 'World created successfully',
      world: {
        id: world.id,
        seed: world.seed,
        joinCode: world.join_code,
        gameDay: world.game_day,
        status: world.status,
        worldSize: world.world_size,
      }
    });
  } catch (error) {
    console.error('Create world error:', error);
    res.status(500).json({ error: 'Failed to create world' });
  }
};

/**
 * Join a world using join code
 */
export const joinWorld = async (req: Request, res: Response) => {
  const { joinCode } = req.body;
  const playerId = req.playerId!;

  if (!joinCode) {
    return res.status(400).json({ error: 'Join code required' });
  }

  try {
    const world = await getWorldByJoinCode(joinCode.toUpperCase());

    if (!world) {
      return res.status(404).json({ error: 'Invalid join code' });
    }

    if (world.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'World is no longer active' });
    }

    const playerResult = await pool.query(
      'SELECT world_id FROM players WHERE id = $1',
      [playerId]
    );

    if (playerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    if (playerResult.rows[0].world_id) {
      return res.status(400).json({ error: 'Player already in a world' });
    }

    const countResult = await pool.query(
      'SELECT COUNT(*) as count FROM players WHERE world_id = $1',
      [world.id]
    );

    const playerCount = parseInt(countResult.rows[0].count);

    if (playerCount >= 3) {
      return res.status(400).json({ error: 'World is full (max 3 players)' });
    }

    const spawnPositions = await getSpawnPositionsForWorld(world.id, playerCount + 1);
    const spawnPos = spawnPositions[playerCount];

    await pool.query(
      `UPDATE players
       SET world_id = $1, x = $2, y = $3, movement_remaining = 100, actions_remaining = 2
       WHERE id = $4`,
      [world.id, spawnPos.x, spawnPos.y, playerId]
    );

    const resourceTypes = ['crops', 'fish', 'lumber', 'ore', 'gems'];
    for (const type of resourceTypes) {
      await pool.query(
        `INSERT INTO resources (player_id, type, quantity)
         VALUES ($1, $2, 0)
         ON CONFLICT (player_id, type) DO NOTHING`,
        [playerId, type]
      );
    }

    res.json({
      message: 'Joined world successfully',
      world: {
        id: world.id,
        joinCode: world.join_code,
        gameDay: world.game_day,
        worldSize: world.world_size || WORLD_SIZE,
      },
      spawnPosition: spawnPos,
    });
  } catch (error) {
    console.error('Join world error:', error);
    res.status(500).json({ error: 'Failed to join world' });
  }
};

/**
 * Rejoin current world (no join code needed)
 */
export const rejoinWorld = async (req: Request, res: Response) => {
  const playerId = req.playerId!;

  try {
    const playerResult = await pool.query(
      'SELECT world_id FROM players WHERE id = $1',
      [playerId]
    );

    if (!playerResult.rows[0]?.world_id) {
      return res.status(400).json({ error: 'Player not in a world' });
    }

    const worldId = playerResult.rows[0].world_id;

    const worldResult = await pool.query(
      'SELECT id, seed, join_code, game_day, status, world_size FROM worlds WHERE id = $1',
      [worldId]
    );

    if (!worldResult.rows[0]) {
      return res.status(404).json({ error: 'World not found' });
    }

    if (worldResult.rows[0].status !== 'ACTIVE') {
      return res.status(400).json({ error: 'World is no longer active' });
    }

    const w = worldResult.rows[0];

    res.json({
      world: {
        id: w.id,
        joinCode: w.join_code,
        gameDay: w.game_day,
        status: w.status,
        worldSize: w.world_size || WORLD_SIZE,
      }
    });
  } catch (error) {
    console.error('Rejoin world error:', error);
    res.status(500).json({ error: 'Failed to rejoin world' });
  }
};

/**
 * Get current world for the authenticated player
 */
export const getMyWorld = async (req: Request, res: Response) => {
  const playerId = req.playerId!;

  try {
    const world = await getPlayerWorld(playerId);

    if (!world) {
      return res.status(404).json({ error: 'Not in a world' });
    }

    res.json({
      world: {
        id: world.id,
        joinCode: world.join_code,
        gameDay: world.game_day,
        status: world.status,
        playerCount: world.player_count,
      }
    });
  } catch (error) {
    console.error('Get my world error:', error);
    res.status(500).json({ error: 'Failed to get world' });
  }
};

/**
 * Get world state (for current player) — terrain generated on-the-fly from seed
 */
export const getWorldState = async (req: Request, res: Response) => {
  const playerId = req.playerId!;

  try {
    const playerResult = await pool.query(
      'SELECT world_id, x, y FROM players WHERE id = $1',
      [playerId]
    );

    if (playerResult.rows.length === 0 || !playerResult.rows[0].world_id) {
      return res.status(400).json({ error: 'Player not in a world' });
    }

    const worldId = playerResult.rows[0].world_id;
    const playerX = playerResult.rows[0].x;
    const playerY = playerResult.rows[0].y;

    // Get world meta (seed + size)
    const meta = await getWorldMeta(worldId);
    if (!meta) {
      return res.status(404).json({ error: 'World not found' });
    }

    const worldSize = meta.worldSize;
    const viewportRadius = 7;

    const xMin = Math.max(0, playerX - viewportRadius);
    const xMax = Math.min(worldSize - 1, playerX + viewportRadius);
    const yMin = Math.max(0, playerY - viewportRadius);
    const yMax = Math.min(worldSize - 1, playerY + viewportRadius);

    // Generate tiles on-the-fly from seed, merging with tile_state mutations
    const tiles = await getWorldTiles(worldId, meta.seed, xMin, yMin, xMax, yMax, worldSize);

    const worldResult = await pool.query(
      'SELECT game_day, status, join_code, seed, world_size FROM worlds WHERE id = $1',
      [worldId]
    );

    res.json({
      world: {
        game_day: worldResult.rows[0].game_day,
        status: worldResult.rows[0].status,
        join_code: worldResult.rows[0].join_code,
        seed: worldResult.rows[0].seed,
        worldSize,
      },
      tiles,
      viewport: { xMin, xMax, yMin, yMax },
    });
  } catch (error) {
    console.error('Get world state error:', error);
    res.status(500).json({ error: 'Failed to get world state' });
  }
};
