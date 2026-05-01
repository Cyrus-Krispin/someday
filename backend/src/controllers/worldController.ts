import pool from '../config/db.js';
import { createWorld as createWorldService, getWorldByJoinCode, getSpawnPositionsForWorld, getWorldTiles } from '../services/worldService.js';
import type { Request, Response } from 'express';

/**
 * Create a new world with generated map
 */
export const createWorld = async (req: Request, res: Response) => {
  try {
    // Generate seed from timestamp + random for uniqueness
    const seed = `world_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const world = await createWorldService(seed);

    res.status(201).json({
      message: 'World created successfully',
      world: {
        id: world.id,
        seed: world.seed,
        joinCode: world.join_code,
        gameDay: world.game_day,
        status: world.status,
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
  const playerId = req.playerId!; // Set by auth middleware

  if (!joinCode) {
    return res.status(400).json({ error: 'Join code required' });
  }

  try {
    // Find world by join code
    const world = await getWorldByJoinCode(joinCode.toUpperCase());

    if (!world) {
      return res.status(404).json({ error: 'Invalid join code' });
    }

    if (world.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'World is no longer active' });
    }

    // Check if player already in a world
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

    // Get current player count in world
    const countResult = await pool.query(
      'SELECT COUNT(*) as count FROM players WHERE world_id = $1',
      [world.id]
    );

    const playerCount = parseInt(countResult.rows[0].count);

    if (playerCount >= 3) {
      return res.status(400).json({ error: 'World is full (max 3 players)' });
    }

    // Get spawn position for this player
    const spawnPositions = await getSpawnPositionsForWorld(world.id, playerCount + 1);
    const spawnPos = spawnPositions[playerCount]; // 0-indexed

    // Update player with world and spawn position
    await pool.query(
      `UPDATE players
       SET world_id = $1, x = $2, y = $3, movement_remaining = 6, actions_remaining = 2
       WHERE id = $4`,
      [world.id, spawnPos.x, spawnPos.y, playerId]
    );

    // Initialize player resources (empty)
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
      },
      spawnPosition: spawnPos,
    });
  } catch (error) {
    console.error('Join world error:', error);
    res.status(500).json({ error: 'Failed to join world' });
  }
};

/**
 * Get world state (for current player)
 */
export const getWorldState = async (req: Request, res: Response) => {
  const playerId = req.playerId!;

  try {
    // Get player's world
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

    // Get 15x15 viewport around player
    const viewportSize = 7; // 7 tiles in each direction = 15x15
    const xMin = Math.max(0, playerX - viewportSize);
    const xMax = Math.min(29, playerX + viewportSize);
    const yMin = Math.max(0, playerY - viewportSize);
    const yMax = Math.min(29, playerY + viewportSize);

    const tiles = await getWorldTiles(worldId, xMin, yMin, xMax, yMax);

    // Get world info
    const worldResult = await pool.query(
      'SELECT game_day, status, join_code FROM worlds WHERE id = $1',
      [worldId]
    );

    res.json({
      world: worldResult.rows[0],
      tiles,
      viewport: { xMin, xMax, yMin, yMax },
    });
  } catch (error) {
    console.error('Get world state error:', error);
    res.status(500).json({ error: 'Failed to get world state' });
  }
};
