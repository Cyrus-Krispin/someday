const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const worldRoutes = require('./routes/world');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test route
app.get('/', (req, res) => {
  res.send('Someday Game Backend Running');
});

// API Routes
app.use('/auth', authRoutes);
app.use('/world', worldRoutes);

module.exports = app;
