import { beforeEach, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';

// Helper to signup and get token
const signupAndGetToken = async (email: string): Promise<string> => {
  const res = await request(app)
    .post('/auth/signup')
    .send({ email, password: 'password123' });

  if (res.statusCode === 409) {
    // User already exists, login instead
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email, password: 'password123' });
    return loginRes.body.token;
  }

  return res.body.token;
};

// Clear tables before each test
beforeEach(async () => {
  await pool.query('DELETE FROM turns');
  await pool.query('DELETE FROM resources');
  await pool.query('DELETE FROM tiles');
  await pool.query('DELETE FROM events');
  await pool.query('DELETE FROM players');
  await pool.query('DELETE FROM worlds');
});

afterAll(async () => {
  await pool.end();
});

describe('Turn Endpoints', () => {
  describe('GET /turn/state', () => {
    let token: string;

    beforeEach(async () => {
      token = await signupAndGetToken('turn-state@test.com');
      const worldRes = await request(app)
        .post('/world/create')
        .set('Authorization', `Bearer ${token}`);
      const joinCode = worldRes.body.world.joinCode;

      await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${token}`)
        .send({ joinCode });
    });

    it('should get turn state for player in world', async () => {
      const res = await request(app)
        .get('/turn/state')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('currentPlayer');
      expect(res.body).toHaveProperty('players');
      expect(res.body).toHaveProperty('gameDay');
      expect(res.body).toHaveProperty('isPlayerTurn');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/turn/state');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /turn/process', () => {
    let creatorToken: string, playerToken: string, joinCode: string;

    beforeEach(async () => {
      // Create world with creator
      creatorToken = await signupAndGetToken('turn-creator@test.com');
      const worldRes = await request(app)
        .post('/world/create')
        .set('Authorization', `Bearer ${creatorToken}`);
      joinCode = worldRes.body.world.joinCode;

      await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({ joinCode });

      // Join with second player
      playerToken = await signupAndGetToken('turn-player@test.com');
      await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${playerToken}`)
        .send({ joinCode });
    });

    it('should process move action', async () => {
      // Get current player position
      const stateRes = await request(app)
        .get('/turn/state')
        .set('Authorization', `Bearer ${creatorToken}`);

      const currentPlayer = stateRes.body.currentPlayer;

      // Try to move to adjacent tile (cost 1 for grassland)
      const actions = [
        { type: 'move', targetX: currentPlayer.x + 1, targetY: currentPlayer.y }
      ];

      const res = await request(app)
        .post('/turn/process')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({ actions });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Turn processed');
    });

    it('should reject move to invalid tile', async () => {
      // Test with invalid coordinates
      const actions = [
        { type: 'move', targetX: -1, targetY: -1 }
      ];

      const res = await request(app)
        .post('/turn/process')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({ actions });

      expect(res.statusCode).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/turn/process')
        .send({ actions: [] });

      expect(res.statusCode).toBe(401);
    });

    it('should require actions array', async () => {
      const res = await request(app)
        .post('/turn/process')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Actions array required');
    });
  });

  describe('POST /turn/end', () => {
    let creatorToken: string, playerToken: string, joinCode: string;

    beforeEach(async () => {
      // Create world with creator
      creatorToken = await signupAndGetToken('turn-end-creator@test.com');
      const worldRes = await request(app)
        .post('/world/create')
        .set('Authorization', `Bearer ${creatorToken}`);
      joinCode = worldRes.body.world.joinCode;

      await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({ joinCode });

      // Join with second player
      playerToken = await signupAndGetToken('turn-end-player@test.com');
      await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${playerToken}`)
        .send({ joinCode });
    });

    it('should end turn and advance to next player', async () => {
      const res = await request(app)
        .post('/turn/end')
        .set('Authorization', `Bearer ${creatorToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Turn ended successfully');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/turn/end');

      expect(res.statusCode).toBe(401);
    });
  });
});
