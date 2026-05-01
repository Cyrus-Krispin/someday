import express from 'express';
import { createWorld, joinWorld, getWorldState } from '../controllers/worldController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/create', authenticate, createWorld);
router.post('/join', authenticate, joinWorld);
router.get('/state', authenticate, getWorldState);

export default router;
