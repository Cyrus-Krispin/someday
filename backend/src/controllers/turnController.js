const turnService = require('../services/turnService');

/**
 * Get current turn state
 */
const getTurnState = async (req, res) => {
  const playerId = req.playerId;

  try {
    // Get player's world
    const playerResult = await require('../config/db').query(
      'SELECT world_id FROM players WHERE id = $1',
      [playerId]
    );

    if (playerResult.rows.length === 0 || !playerResult.rows[0].world_id) {
      return res.status(400).json({ error: 'Player not in a world' });
    }

    const worldId = playerResult.rows[0].world_id;

    const turnState = await turnService.getTurnState(worldId);
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
const processTurn = async (req, res) => {
  const playerId = req.playerId;
  const { actions } = req.body;

  if (!actions || !Array.isArray(actions)) {
    return res.status(400).json({ error: 'Actions array required' });
  }

  try {
    // Get player's world
    const playerResult = await require('../config/db').query(
      'SELECT world_id FROM players WHERE id = $1',
      [playerId]
    );

    if (playerResult.rows.length === 0 || !playerResult.rows[0].world_id) {
      return res.status(400).json({ error: 'Player not in a world' });
    }

    const worldId = playerResult.rows[0].world_id;

    const result = await turnService.processTurn(worldId, playerId, actions);
    res.json(result);
  } catch (error) {
    console.error('Process turn error:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * End turn and advance to next player
 */
const endTurn = async (req, res) => {
  const playerId = req.playerId;

  try {
    // Get player's world
    const playerResult = await require('../config/db').query(
      'SELECT world_id FROM players WHERE id = $1',
      [playerId]
    );

    if (playerResult.rows.length === 0 || !playerResult.rows[0].world_id) {
      return res.status(400).json({ error: 'Player not in a world' });
    }

    const worldId = playerResult.rows[0].world_id;

    const result = await turnService.endTurn(worldId, playerId);
    res.json(result);
  } catch (error) {
    console.error('End turn error:', error);
    res.status(500).json({ error: 'Failed to end turn' });
  }
};

module.exports = { getTurnState, processTurn, endTurn };
