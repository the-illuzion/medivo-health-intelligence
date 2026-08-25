import { Router } from 'express';
import { chatWithCoach } from '../controllers/coach.controller.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { coachChatSchema } from '../schemas/dto.schemas.js';

const router = Router();

// Protect AI Coach chat endpoint with authentication
router.use(authenticateToken);

router.post('/chat', validateRequest(coachChatSchema), chatWithCoach);

export default router;
