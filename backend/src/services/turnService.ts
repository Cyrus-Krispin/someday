import pool from '../config/db.js';
import { getWorldTiles, getSpawnPositionsForWorld, updateTileResource } from './worldService.js';
import { getTerrainAt, getMoveCost, TERRAIN } from '../shared/terrain.js';

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

  const worldResult = await pool.query(
    'SELECT game_day FROM worlds WHERE id = $1',
    [worldId]
  );

  const gameDay = worldResult.rows[0]?.game_day || 1;

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
    isPlayerTurn: null,
  };
};

/**
 * Process a player's turn actions
 */
export const processTurn = async (worldId: string, playerId: string, actions: any[]): Promise<{ success: boolean; message: string }> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const playerResult = await client.query(
      'SELECT * FROM players WHERE id = $1 AND world_id = $2',
      [playerId, worldId]
    );

    if (playerResult.rows.length === 0) {
      throw new Error('Player not found in this world');
    }

    const player = playerResult.rows[0];

    const turnState = await getTurnState(worldId);
    if (turnState.currentPlayer.id !== playerId) {
      throw new Error('Not your turn');
    }

    let movementRemaining = player.movement_remaining;
    let actionsRemaining = player.actions_remaining;
    let tokens = player.tokens;
    let score = player.score;

    // Get world meta for terrain computation
    const worldMeta = await client.query(
      'SELECT seed, world_size FROM worlds WHERE id = $1',
      [worldId]
    );
    const { seed, world_size: worldSize } = worldMeta.rows[0];

    for (const action of actions) {
      switch (action.type) {
        case 'move':
          const moveResult = await processMove(client, worldId, player, action, movementRemaining, seed, worldSize);
          movementRemaining = moveResult.movementRemaining;
          break;

        case 'gather':
          await processGather(client, worldId, playerId, player, seed, worldSize);
          break;

        case 'work':
          await processWork(client, worldId, playerId, player, action);
          break;
      }
    }

    await client.query(
      `INSERT INTO turns (world_id, player_id, actions_json, auto_skipped)
       VALUES ($1, $2, $3, FALSE)`,
      [worldId, playerId, JSON.stringify(actions)]
    );

    await client.query(
      `UPDATE players
       SET movement_remaining = 100, actions_remaining = 2, last_turn_at = NOW()
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
 * Process movement action — uses on-the-fly terrain computation
 */
const processMove = async (client: any, worldId: string, player: any, action: any, movementRemaining: number, seed: string, worldSize: number) => {
  const { targetX, targetY } = action;

  // Validate bounds
  if (targetX < 0 || targetX >= worldSize || targetY < 0 || targetY >= worldSize) {
    throw new Error('Invalid tile position');
  }

  // Compute terrain on-the-fly
  const terrain = getTerrainAt(targetX, targetY, seed);

  if (terrain.type === 'water') {
    throw new Error('Cannot move to water tile');
  }

  const moveCost = getMoveCost(terrain.type);
  if (moveCost === null || moveCost > movementRemaining) {
    throw new Error('Not enough movement points');
  }

  await client.query(
    'UPDATE players SET x = $1, y = $2 WHERE id = $3',
    [targetX, targetY, player.id]
  );

  return { movementRemaining: movementRemaining - moveCost };
};

/**
 * Process gather action — stores result in tile_state
 */
const processGather = async (client: any, worldId: string, playerId: string, player: any, seed: string, worldSize: number) => {
  // Compute terrain on-the-fly
  const terrain = getTerrainAt(player.x, player.y, seed);
  if (!terrain.resource) {
    throw new Error('No resources to gather here');
  }

  // Check current tile state
  const tileStateResult = await client.query(
    'SELECT * FROM tile_state WHERE world_id = $1 AND x = $2 AND y = $3',
    [worldId, player.x, player.y]
  );

  const existing = tileStateResult.rows[0];
  const currentQuantity = existing?.resource_quantity ?? getResourceValue(terrain.resource);

  if (existing && currentQuantity <= 0) {
    throw new Error('No resources to gather here');
  }

  const newQuantity = Math.max(0, currentQuantity - 1);

  const worldDayResult = await client.query(
    'SELECT game_day FROM worlds WHERE id = $1',
    [worldId]
  );
  const gameDay = worldDayResult.rows[0].game_day;

  // Update tile_state (insert if not exists)
  await client.query(
    `INSERT INTO tile_state (world_id, x, y, resource_type, resource_quantity, last_harvested_day)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (world_id, x, y)
     DO UPDATE SET resource_quantity = $5, last_harvested_day = $6`,
    [worldId, player.x, player.y, terrain.resource, newQuantity, gameDay]
  );

  await client.query(
    `INSERT INTO resources (player_id, type, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (player_id, type)
     DO UPDATE SET quantity = resources.quantity + $3`,
    [playerId, terrain.resource, 1]
  );

  const resourceValue = getResourceValue(terrain.resource);

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

  const tileStateResult = await client.query(
    'SELECT * FROM tile_state WHERE world_id = $1 AND x = $2 AND y = $3',
    [worldId, player.x, player.y]
  );

  const tile = tileStateResult.rows[0];
  if (!tile || tile.structure_type !== structureType) {
    throw new Error(`Not at a ${structureType}`);
  }

  switch (structureType) {
    case 'mine':
      await client.query(
        `INSERT INTO resources (player_id, type, quantity)
         VALUES ($1, 'ore', 2)
         ON CONFLICT (player_id, type)
         DO UPDATE SET quantity = resources.quantity + 2`,
        [playerId]
      );
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
      throw new Error('Use trade action for Market');
  }

  return { success: true };
};

/**
 * Get movement cost for terrain type
 */
const getResourceValue = (resourceType: string): number => {
  const values: Record<string, number> = {
    'crops': 3,
    'fish': 2,
    'lumber': 5,
    'ore': 4,
    'gems': 1,
    'rare_gems': 1,
  };
  return values[resourceType] || 1;
};

/**
 * End turn and advance to next player
 */
export const endTurn = async (worldId: string, playerId: string): Promise<{ success: boolean; message: string }> => {
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

  if (actedPlayers >= totalPlayers) {
    await pool.query(
      'UPDATE worlds SET game_day = game_day + 1 WHERE id = $1',
      [worldId]
    );
  }

  return { success: true, message: 'Turn ended successfully' };
};
