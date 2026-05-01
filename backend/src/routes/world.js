const express = require('express');
const router = express.Router();
const worldController = require('../controllers/worldController');
const { authenticate } = require('../middleware/auth');

// Protected routes
router.post('/create', authenticate, worldController.createWorld);
router.post('/join', authenticate, worldController.joinWorld);
router.get('/state', authenticate, worldController.getWorldState);

module.exports = router;
