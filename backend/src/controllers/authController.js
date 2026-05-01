const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Signup: Create new player account
 */
const signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    // Check if user already exists
    const existing = await pool.query(
      'SELECT id FROM players WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create player (not linked to world yet)
    const result = await pool.query(
      `INSERT INTO players (email, password_hash, tokens, score, movement_remaining, actions_remaining)
       VALUES ($1, $2, 20, 0, 6, 2)
       RETURNING id, email, tokens, score, created_at`,
      [email, passwordHash]
    );

    const player = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { playerId: player.id, email: player.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      player: {
        id: player.id,
        email: player.email,
        tokens: player.tokens,
        score: player.score,
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Login: Authenticate existing player
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, password_hash, tokens, score, world_id FROM players WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const player = result.rows[0];

    // Verify password
    const valid = await bcrypt.compare(password, player.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { playerId: player.id, email: player.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      player: {
        id: player.id,
        email: player.email,
        tokens: player.tokens,
        score: player.score,
        worldId: player.world_id,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get current player profile (requires auth)
 */
const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, tokens, score, world_id, x, y, movement_remaining, actions_remaining
       FROM players WHERE id = $1`,
      [req.playerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json({ player: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { signup, login, getProfile };
