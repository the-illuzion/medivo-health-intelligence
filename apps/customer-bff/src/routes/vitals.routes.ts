import { Router } from 'express';
import { getVitals, getVitalByName, getInsights, getAlerts, createVitalReading } from '../controllers/vitals.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { createVitalReadingSchema } from '../schemas/dto.schemas.js';

const router = Router();

router.get('/', authenticateToken, getVitals);
router.get('/insights', authenticateToken, getInsights);
router.get('/alerts', authenticateToken, getAlerts);
router.get('/details/:name', authenticateToken, getVitalByName);
router.post('/', authenticateToken, validateRequest(createVitalReadingSchema), createVitalReading);

export default router;
