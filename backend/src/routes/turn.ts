import express from 'express';
import { getTurnState, processTurn, endTurn } from '../controllers/turnController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/state', authenticate, getTurnState);
router.post('/process', authenticate, processTurn);
router.post('/end', authenticate, endTurn);

export default router;
