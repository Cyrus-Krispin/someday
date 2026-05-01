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

describe('World Endpoints', () => {
  describe('POST /world/create', () => {
    it('should create a new world with join code', async () => {
      const token = await signupAndGetToken('world-create@test.com');

      const res = await request(app)
        .post('/world/create')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('world');
      expect(res.body.world).toHaveProperty('joinCode');
      expect(res.body.world.joinCode).toHaveLength(6);
      expect(res.body.world.status).toBe('ACTIVE');
      expect(res.body.world.gameDay).toBe(1);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/world/create');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /world/join', () => {
    let creatorToken: string, worldJoinCode: string;

    beforeEach(async () => {
      creatorToken = await signupAndGetToken('world-creator@test.com');
      const worldRes = await request(app)
        .post('/world/create')
        .set('Authorization', `Bearer ${creatorToken}`);
      worldJoinCode = worldRes.body.world.joinCode;
    });

    it('should allow player to join world with valid code', async () => {
      const playerToken = await signupAndGetToken('world-player@test.com');

      const res = await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${playerToken}`)
        .send({ joinCode: worldJoinCode });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('world');
      expect(res.body).toHaveProperty('spawnPosition');
      expect(res.body.world.joinCode).toBe(worldJoinCode);
    });

    it('should reject invalid join code', async () => {
      const playerToken = await signupAndGetToken('world-player-invalid@test.com');

      const res = await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${playerToken}`)
        .send({ joinCode: 'INVALID' });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Invalid join code');
    });

    it('should reject joining non-active world', async () => {
      const playerToken = await signupAndGetToken('world-player-completed@test.com');

      // Create another world and mark it completed
      const worldRes = await request(app)
        .post('/world/create')
        .set('Authorization', `Bearer ${creatorToken}`);
      const joinCode = worldRes.body.world.joinCode;
      const worldId = worldRes.body.world.id;

      await pool.query("UPDATE worlds SET status = 'COMPLETED' WHERE id = $1", [worldId]);

      const res = await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${playerToken}`)
        .send({ joinCode: joinCode });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('World is no longer active');
    });

    it('should reject player already in a world', async () => {
      const playerToken = await signupAndGetToken('world-player-already@test.com');

      // Join once
      await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${playerToken}`)
        .send({ joinCode: worldJoinCode });

      // Try to join again
      const res = await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${playerToken}`)
        .send({ joinCode: worldJoinCode });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Player already in a world');
    });

    it('should reject when world is full (max 3 players)', async () => {
      // Join 3 players
      const player1Token = await signupAndGetToken('world-p1@test.com');
      await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${player1Token}`)
        .send({ joinCode: worldJoinCode });

      const player2Token = await signupAndGetToken('world-p2@test.com');
      await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${player2Token}`)
        .send({ joinCode: worldJoinCode });

      const player3Token = await signupAndGetToken('world-p3@test.com');
      await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${player3Token}`)
        .send({ joinCode: worldJoinCode });

      // Try to join 4th player
      const player4Token = await signupAndGetToken('world-p4@test.com');
      const res = await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${player4Token}`)
        .send({ joinCode: worldJoinCode });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('World is full (max 3 players)');
    });
  });

  describe('GET /world/state', () => {
    let token: string, joinCode: string;

    beforeEach(async () => {
      token = await signupAndGetToken('world-state@test.com');
      const worldRes = await request(app)
        .post('/world/create')
        .set('Authorization', `Bearer ${token}`);
      joinCode = worldRes.body.world.joinCode;

      await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${token}`)
        .send({ joinCode });
    });

    it('should get world state for player in world', async () => {
      const res = await request(app)
        .get('/world/state')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('world');
      expect(res.body).toHaveProperty('tiles');
      expect(res.body).toHaveProperty('viewport');
      expect(res.body.tiles.length).toBeGreaterThan(0);
    });

    it('should reject player not in a world', async () => {
      const newToken = await signupAndGetToken('world-state-new@test.com');

      const res = await request(app)
        .get('/world/state')
        .set('Authorization', `Bearer ${newToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Player not in a world');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/world/state');

      expect(res.statusCode).toBe(401);
    });
  });
});
