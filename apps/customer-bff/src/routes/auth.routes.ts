import { Router } from 'express';
import { login, register, getProfile } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { loginSchema, registerSchema } from '../schemas/dto.schemas.js';

const router = Router();

router.post('/login', validateRequest(loginSchema), login);
router.post('/register', validateRequest(registerSchema), register);
router.get('/profile', getProfile);

export default router;
