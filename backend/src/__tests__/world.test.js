const request = require('supertest');
const app = require('../app');
const pool = require('../config/db');

// Helper to signup and get token
const signupAndGetToken = async (email = 'test@example.com') => {
  const res = await request(app)
    .post('/auth/signup')
    .send({ email, password: 'password123' });
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
      const token = await signupAndGetToken();

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
    let creatorToken, worldJoinCode;

    beforeEach(async () => {
      // Create a world first
      creatorToken = await signupAndGetToken('creator@example.com');
      const worldRes = await request(app)
        .post('/world/create')
        .set('Authorization', `Bearer ${creatorToken}`);
      worldJoinCode = worldRes.body.world.joinCode;
    });

    it('should allow player to join world with valid code', async () => {
      const playerToken = await signupAndGetToken('player@example.com');

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
      const playerToken = await signupAndGetToken('player@example.com');

      const res = await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${playerToken}`)
        .send({ joinCode: 'INVALID' });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Invalid join code');
    });

    it('should reject joining non-active world', async () => {
      // Create a world and then set it to COMPLETED
      const playerToken = await signupAndGetToken('player@example.com');

      // First, update the world to non-active
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
      const playerToken = await signupAndGetToken('player@example.com');

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
      const player1Token = await signupAndGetToken('player1@example.com');
      await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${player1Token}`)
        .send({ joinCode: worldJoinCode });

      const player2Token = await signupAndGetToken('player2@example.com');
      await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${player2Token}`)
        .send({ joinCode: worldJoinCode });

      const player3Token = await signupAndGetToken('player3@example.com');
      await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${player3Token}`)
        .send({ joinCode: worldJoinCode });

      // Try to join 4th player
      const player4Token = await signupAndGetToken('player4@example.com');
      const res = await request(app)
        .post('/world/join')
        .set('Authorization', `Bearer ${player4Token}`)
        .send({ joinCode: worldJoinCode });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('World is full (max 3 players)');
    });
  });

  describe('GET /world/state', () => {
    let token, joinCode;

    beforeEach(async () => {
      token = await signupAndGetToken('test@example.com');
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
      const newToken = await signupAndGetToken('new@example.com');

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
