import express from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { log } from 'console';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/me', authMiddleware, getMe);

export default router;