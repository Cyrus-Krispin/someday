import { getTurnState as getTurnStateService, processTurn as processTurnService, endTurn as endTurnService } from '../services/turnService.js';
import pool from '../config/db.js';
import type { Request, Response } from 'express';

/**
 * Get current turn state
 */
export const getTurnState = async (req: Request, res: Response) => {
  const playerId = req.playerId!;

  try {
    // Get player's world
    const playerResult = await pool.query(
      'SELECT world_id FROM players WHERE id = $1',
      [playerId]
    );

    if (playerResult.rows.length === 0 || !playerResult.rows[0].world_id) {
      return res.status(400).json({ error: 'Player not in a world' });
    }

    const worldId = playerResult.rows[0].world_id;

    const turnState = await getTurnStateService(worldId);
    turnState.isPlayerTurn = turnState.currentPlayer.id === playerId;

    res.json(turnState);
  } catch (error) {
    console.error('Get turn state error:', error);
    res.status(500).json({ error: 'Failed to get turn state' });
  }
};

/**
 * Process turn actions (move, gather, work)
 */
export const processTurn = async (req: Request, res: Response) => {
  const playerId = req.playerId!;
  const { actions } = req.body;

  if (!actions || !Array.isArray(actions)) {
    return res.status(400).json({ error: 'Actions array required' });
  }

  try {
    // Get player's world
    const playerResult = await pool.query(
      'SELECT world_id FROM players WHERE id = $1',
      [playerId]
    );

    if (playerResult.rows.length === 0 || !playerResult.rows[0].world_id) {
      return res.status(400).json({ error: 'Player not in a world' });
    }

    const worldId = playerResult.rows[0].world_id;

    const result = await processTurnService(worldId, playerId, actions);
    res.json(result);
  } catch (error: any) {
    console.error('Process turn error:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * End turn and advance to next player
 */
export const endTurn = async (req: Request, res: Response) => {
  const playerId = req.playerId!;

  try {
    // Get player's world
    const playerResult = await pool.query(
      'SELECT world_id FROM players WHERE id = $1',
      [playerId]
    );

    if (playerResult.rows.length === 0 || !playerResult.rows[0].world_id) {
      return res.status(400).json({ error: 'Player not in a world' });
    }

    const worldId = playerResult.rows[0].world_id;

    const result = await endTurnService(worldId, playerId);
    res.json(result);
  } catch (error) {
    console.error('End turn error:', error);
    res.status(500).json({ error: 'Failed to end turn' });
  }
};
