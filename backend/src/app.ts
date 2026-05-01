import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.js';
import worldRoutes from './routes/world.js';
import turnRoutes from './routes/turn.js';

const app: Express = express();

// Middleware
const corsOrigin = process.env.NODE_ENV === 'development'
  ? /^http:\/\/localhost(:\d+)?$/
  : process.env.CLIENT_URL;
app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('Someday Game Backend Running');
});

// API Routes
app.use('/auth', authRoutes);
app.use('/world', worldRoutes);
app.use('/turn', turnRoutes);

export default app;
