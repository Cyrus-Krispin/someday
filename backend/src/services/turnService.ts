import pool from '../config/db.js';
import { getWorldTiles, getSpawnPositionsForWorld } from './worldService.js';

export interface TurnState {
  currentPlayer: {
    id: string;
    email: string;
    x: number;
    y: number;
    movementRemaining: number;
    actionsRemaining: number;
  };
  players: Array<{
    id: string;
    email: string;
    x: number;
    y: number;
    tokens: number;
    score: number;
  }>;
  gameDay: number;
  isPlayerTurn: boolean | null;
}

/**
 * Get current turn state for a world
 */
export const getTurnState = async (worldId: string): Promise<TurnState> => {
  const result = await pool.query(
    `SELECT p.id, p.email, p.x, p.y, p.tokens, p.score,
            p.movement_remaining, p.actions_remaining, p.last_turn_at,
            p.consecutive_passes
     FROM players p
     WHERE p.world_id = $1
     ORDER BY p.created_at`,
    [worldId]
  );

  const players = result.rows;

  // Get current player index (simplified: first player who hasn't acted this round)
  const worldResult = await pool.query(
    'SELECT game_day FROM worlds WHERE id = $1',
    [worldId]
  );

  const gameDay = worldResult.rows[0]?.game_day || 1;

  // Count turns this game day to determine whose turn it is
  const turnsResult = await pool.query(
    `SELECT COUNT(DISTINCT player_id) as turns_this_day
     FROM turns
     WHERE world_id = $1 AND created_at > NOW() - INTERVAL '24 hours'`,
    [worldId]
  );

  const turnsThisDay = parseInt(turnsResult.rows[0]?.turns_this_day || 0);
  const currentPlayerIndex = turnsThisDay % players.length;
  const currentPlayer = players[currentPlayerIndex];

  return {
    currentPlayer: {
      id: currentPlayer.id,
      email: currentPlayer.email,
      x: currentPlayer.x,
      y: currentPlayer.y,
      movementRemaining: currentPlayer.movement_remaining,
      actionsRemaining: currentPlayer.actions_remaining,
    },
    players: players.map(p => ({
      id: p.id,
      email: p.email,
      x: p.x,
      y: p.y,
      tokens: p.tokens,
      score: p.score,
    })),
    gameDay,
    isPlayerTurn: null, // Will be set by controller based on requesting player
  };
};

/**
 * Process a player's turn actions
 */
export const processTurn = async (worldId: string, playerId: string, actions: any[]): Promise<{ success: boolean; message: string }> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get player state
    const playerResult = await client.query(
      'SELECT * FROM players WHERE id = $1 AND world_id = $2',
      [playerId, worldId]
    );

    if (playerResult.rows.length === 0) {
      throw new Error('Player not found in this world');
    }

    const player = playerResult.rows[0];

    // Validate it's this player's turn (simplified check)
    const turnState = await getTurnState(worldId);
    if (turnState.currentPlayer.id !== playerId) {
      throw new Error('Not your turn');
    }

    let movementRemaining = player.movement_remaining;
    let actionsRemaining = player.actions_remaining;
    let tokens = player.tokens;
    let score = player.score;

    // Process each action
    for (const action of actions) {
      switch (action.type) {
        case 'move':
          const moveResult = await processMove(client, worldId, player, action, movementRemaining);
          movementRemaining = moveResult.movementRemaining;
          break;

        case 'gather':
          await processGather(client, worldId, playerId, player);
          break;

        case 'work':
          await processWork(client, worldId, playerId, player, action);
          break;
      }
    }

    // Record the turn
    await client.query(
      `INSERT INTO turns (world_id, player_id, actions_json, auto_skipped)
       VALUES ($1, $2, $3, FALSE)`,
      [worldId, playerId, JSON.stringify(actions)]
    );

    // Reset player state for next turn
    await client.query(
      `UPDATE players
       SET movement_remaining = 6, actions_remaining = 2, last_turn_at = NOW()
       WHERE id = $1`,
      [playerId]
    );

    await client.query('COMMIT');

    return { success: true, message: 'Turn processed' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Process movement action
 */
const processMove = async (client: any, worldId: string, player: any, action: any, movementRemaining: number) => {
  const { targetX, targetY } = action;

  // Get tile at target
  const tileResult = await client.query(
    'SELECT * FROM tiles WHERE world_id = $1 AND x = $2 AND y = $3',
    [worldId, targetX, targetY]
  );

  if (tileResult.rows.length === 0) {
    throw new Error('Invalid tile position');
  }

  const tile = tileResult.rows[0];

  // Check if water (impassable)
  if (tile.terrain_type === 'water') {
    throw new Error('Cannot move to water tile');
  }

  // Calculate movement cost
  const moveCost = getMoveCost(tile.terrain_type);
  if (moveCost > movementRemaining) {
    throw new Error('Not enough movement points');
  }

  // Update player position
  await client.query(
    'UPDATE players SET x = $1, y = $2 WHERE id = $3',
    [targetX, targetY, player.id]
  );

  return { movementRemaining: movementRemaining - moveCost };
};

/**
 * Process gather action
 */
const processGather = async (client: any, worldId: string, playerId: string, player: any) => {
  // Get current tile
  const tileResult = await client.query(
    'SELECT * FROM tiles WHERE world_id = $1 AND x = $2 AND y = $3',
    [worldId, player.x, player.y]
  );

  const tile = tileResult.rows[0];
  if (!tile || !tile.resource_type || tile.resource_quantity <= 0) {
    throw new Error('No resources to gather here');
  }

  // Get resource value
  const resourceValue = getResourceValue(tile.resource_type);

  // Add to player's resources
  await client.query(
    `INSERT INTO resources (player_id, type, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (player_id, type)
     DO UPDATE SET quantity = resources.quantity + $3`,
    [playerId, tile.resource_type, 1]
  );

  // Reduce tile resource quantity
  await client.query(
    'UPDATE tiles SET resource_quantity = resource_quantity - 1, last_harvested_day = (SELECT game_day FROM worlds WHERE id = $1) WHERE id = $2',
    [worldId, tile.id]
  );

  // Update player score
  await client.query(
    'UPDATE players SET score = score + $1 WHERE id = $2',
    [resourceValue, playerId]
  );

  return { success: true };
};

/**
 * Process work action (at Mine, Farm, etc.)
 */
const processWork = async (client: any, worldId: string, playerId: string, player: any, action: any) => {
  const { structureType } = action;

  // Get current tile
  const tileResult = await client.query(
    'SELECT * FROM tiles WHERE world_id = $1 AND x = $2 AND y = $3',
    [worldId, player.x, player.y]
  );

  const tile = tileResult.rows[0];
  if (!tile || tile.structure_type !== structureType) {
    throw new Error(`Not at a ${structureType}`);
  }

  // Process based on structure type
  switch (structureType) {
    case 'mine':
      // Earn ore + small gem chance
      await client.query(
        `INSERT INTO resources (player_id, type, quantity)
         VALUES ($1, 'ore', 2)
         ON CONFLICT (player_id, type)
         DO UPDATE SET quantity = resources.quantity + 2`,
        [playerId]
      );
      // Small gem chance (10%)
      if (Math.random() < 0.1) {
        await client.query(
          `INSERT INTO resources (player_id, type, quantity)
           VALUES ($1, 'gems', 1)
           ON CONFLICT (player_id, type)
           DO UPDATE SET quantity = resources.quantity + 1`,
          [playerId]
        );
      }
      await client.query(
        'UPDATE players SET score = score + 6 WHERE id = $1',
        [playerId]
      );
      break;

    case 'farm':
      await client.query(
        `INSERT INTO resources (player_id, type, quantity)
         VALUES ($1, 'crops', 3)
         ON CONFLICT (player_id, type)
         DO UPDATE SET quantity = resources.quantity + 3`,
        [playerId]
      );
      await client.query(
        'UPDATE players SET score = score + 3 WHERE id = $1',
        [playerId]
      );
      break;

    case 'market':
      // Market work is just buying/selling - handled separately
      throw new Error('Use trade action for Market');
  }

  return { success: true };
};

/**
 * Get movement cost for terrain type
 */
const getMoveCost = (terrainType: string): number => {
  const costs: Record<string, number | null> = {
    'grassland': 1,
    'forest': 2,
    'mountain': 3,
    'desert': 2,
    'water': null, // Impassable
  };
  return costs[terrainType] || 1;
};

/**
 * Get resource value in tokens
 */
const getResourceValue = (resourceType: string): number => {
  const values: Record<string, number> = {
    'crops': 1,
    'fish': 2,
    'lumber': 2,
    'ore': 3,
    'gems': 10,
    'rare_gems': 10,
  };
  return values[resourceType] || 0;
};

/**
 * End turn and advance to next player
 */
export const endTurn = async (worldId: string, playerId: string): Promise<{ success: boolean; message: string }> => {
  // Check if all players have acted this game day
  const playersResult = await pool.query(
    'SELECT COUNT(*) as total FROM players WHERE world_id = $1',
    [worldId]
  );

  const turnsResult = await pool.query(
    `SELECT COUNT(DISTINCT player_id) as acted
     FROM turns
     WHERE world_id = $1 AND created_at > NOW() - INTERVAL '24 hours'`,
    [worldId]
  );

  const totalPlayers = parseInt(playersResult.rows[0].total);
  const actedPlayers = parseInt(turnsResult.rows[0].acted);

  // If all players acted, advance game day
  if (actedPlayers >= totalPlayers) {
    await pool.query(
      'UPDATE worlds SET game_day = game_day + 1 WHERE id = $1',
      [worldId]
    );

    // TODO: Check for game end (day 30)
    // TODO: Emit turn_start to next player via Socket.io
  }

  return { success: true, message: 'Turn ended successfully' };
};
