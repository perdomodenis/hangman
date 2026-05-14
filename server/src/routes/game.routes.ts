import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { startNewGame, guessLetter, getStats } from '../controllers/gameController';
import router from './auth.routes';
import router from './auth.routes';

const router = express.Router();

//Alle game routes brauchen authentifizierung
router.post('/new', authMiddleware, startNewGame);
router.post('/guess', authMiddleware, guessLetter);
router.get('/stats', authMiddleware, getStats);

export default router;