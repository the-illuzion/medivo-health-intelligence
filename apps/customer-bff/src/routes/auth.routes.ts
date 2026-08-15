import { Router } from 'express';
import { login, register, logout, getProfile } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { loginSchema, registerSchema } from '../schemas/dto.schemas.js';

const router = Router();

// Public Authentication Endpoints
router.post('/login', validateRequest(loginSchema), login);
router.post('/register', validateRequest(registerSchema), register);

// Protected User Session Endpoints
router.post('/logout', authenticateToken, logout);
router.get('/profile', authenticateToken, getProfile);
router.get('/me', authenticateToken, getProfile);

export default router;
