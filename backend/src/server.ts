import app from './app.js';
import http from 'http';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import cron from 'node-cron';
import pool from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'development'
      ? /^http:\/\/localhost(:\d+)?$/
      : process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

// Store player socket mappings
const playerSockets = new Map<string, string>();

// Socket connection handler
io.on('connection', (socket: Socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Player can register their ID for targeted events
  socket.on('register', (playerId: string) => {
    playerSockets.set(playerId, socket.id);
    (socket as any).playerId = playerId;
    console.log(`Player ${playerId} registered to socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    const playerId = (socket as any).playerId;
    if (playerId) {
      playerSockets.delete(playerId);
    }
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// 24h auto-skip cron job (runs every hour to check for timed-out turns)
cron.schedule('0 * * * *', async () => {
  console.log('Running auto-skip check...');

  try {
    // Find worlds where a player hasn't acted in 24h
    const worldsResult = await pool.query(
      `SELECT DISTINCT w.id, w.game_day
       FROM worlds w
       WHERE w.status = 'ACTIVE'`
    );

    for (const world of worldsResult.rows) {
      // Get players who haven't acted in 24h
      const playersResult = await pool.query(
        `SELECT p.id, p.email, p.last_turn_at, p.consecutive_passes
         FROM players p
         WHERE p.world_id = $1
         AND (p.last_turn_at IS NULL OR p.last_turn_at < NOW() - INTERVAL '24 hours')`,
        [world.id]
      );

      for (const player of playersResult.rows) {
        // Record auto-skipped turn
        await pool.query(
          `INSERT INTO turns (world_id, player_id, actions_json, auto_skipped)
           VALUES ($1, $2, '[]', TRUE)`,
          [world.id, player.id]
        );

        // Update consecutive passes
        const newPasses = (player.consecutive_passes || 0) + 1;
        await pool.query(
          `UPDATE players
           SET consecutive_passes = $1, last_turn_at = NOW()
           WHERE id = $2`,
          [newPasses, player.id]
        );

        // If 3+ consecutive passes, mark as dormant (still on leaderboard)
        if (newPasses >= 3) {
          console.log(`Player ${player.email} marked as dormant`);
        }

        // Notify next player
        io.emit('turn_start', { worldId: world.id, skippedPlayerId: player.id });
        console.log(`Auto-skipped player ${player.email} in world ${world.id}`);
      }
    }
  } catch (error) {
    console.error('Auto-skip error:', error);
  }
});

// Helper function to emit to a specific player
const emitToPlayer = (playerId: string, event: string, data: any) => {
  const socketId = playerSockets.get(playerId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

// Start server
server.listen(PORT, () => {
  console.log(`Server + Socket.io running on port ${PORT}`);
});

export { server, io, emitToPlayer };
