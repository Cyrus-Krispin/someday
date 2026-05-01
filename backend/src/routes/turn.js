const express = require('express');
const router = express.Router();
const turnController = require('../controllers/turnController');
const { authenticate } = require('../middleware/auth');

// Protected routes
router.get('/state', authenticate, turnController.getTurnState);
router.post('/process', authenticate, turnController.processTurn);
router.post('/end', authenticate, turnController.endTurn);

module.exports = router;
