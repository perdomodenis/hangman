import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/auth.routes';
import gameRoutes from './routes/game.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // der Reaction frontend läuft auf diesem Port
  credentials: true 
}));
app.use(express.json());

// Routen
app.use('/api/auth', authRoutes);      
app.use('/api/game', gameRoutes);      

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling (must be last)
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Initialize database tables on startup
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();