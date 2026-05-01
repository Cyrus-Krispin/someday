import { beforeEach, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';

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

describe('Auth Endpoints', () => {
  describe('POST /auth/signup', () => {
    it('should create a new player account', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send({
          email: 'auth-test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('player');
      expect(res.body.player.email).toBe('auth-test@example.com');
      expect(res.body.player.tokens).toBe(20);
      expect(res.body.player.score).toBe(0);
    });

    it('should reject duplicate email', async () => {
      // First signup
      await request(app)
        .post('/auth/signup')
        .send({
          email: 'duplicate@example.com',
          password: 'password123'
        });

      // Second signup with same email
      const res = await request(app)
        .post('/auth/signup')
        .send({
          email: 'duplicate@example.com',
          password: 'password456'
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.error).toBe('Email already registered');
    });

    it('should reject missing email or password', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Email and password required');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      await request(app)
        .post('/auth/signup')
        .send({
          email: 'login-test@example.com',
          password: 'password123'
        });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'login-test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('player');
      expect(res.body.player.email).toBe('login-test@example.com');
    });

    it('should reject incorrect password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'login-test@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent-login@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /auth/profile', () => {
    let token: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send({
          email: 'profile-test@example.com',
          password: 'password123'
        });
      token = res.body.token;
    });

    it('should get profile with valid token', async () => {
      const res = await request(app)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('player');
      expect(res.body.player.id).toBeDefined();
      expect(res.body.player.email).toBe('profile-test@example.com');
    });

    it('should reject without token', async () => {
      const res = await request(app)
        .get('/auth/profile');

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Authentication required');
    });

    it('should reject with invalid token', async () => {
      const res = await request(app)
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid_token');

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe('Invalid or expired token');
    });
  });
});
