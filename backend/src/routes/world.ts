import express from 'express';
import { createWorld, joinWorld, getWorldState, rejoinWorld, getMyWorld } from '../controllers/worldController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/create', authenticate, createWorld);
router.post('/join', authenticate, joinWorld);
router.post('/rejoin', authenticate, rejoinWorld);
router.get('/state', authenticate, getWorldState);
router.get('/myworld', authenticate, getMyWorld);

export default router;
