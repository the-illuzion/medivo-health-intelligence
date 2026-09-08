import { Router } from 'express';
import { analyzeSkin, getScanHistory } from '../controllers/ai.controller.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { analyzeSkinSchema } from '../schemas/ai.schemas.js';

const router = Router();

router.post('/analyze', validateRequest(analyzeSkinSchema), analyzeSkin);
router.post('/telemetry/analyze', validateRequest(analyzeSkinSchema), analyzeSkin);
router.get('/history', getScanHistory);
router.get('/telemetry/history', getScanHistory);


export default router;
