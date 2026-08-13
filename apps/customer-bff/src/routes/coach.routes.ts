import { Router } from 'express';
import { chatWithCoach } from '../controllers/coach.controller.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { coachChatSchema } from '../schemas/dto.schemas.js';

const router = Router();

router.post('/chat', validateRequest(coachChatSchema), chatWithCoach);

export default router;
