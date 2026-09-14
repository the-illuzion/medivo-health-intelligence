import { Router } from 'express';
import {
  getAppleHealthConnection,
  syncHealthData,
} from '../controllers/health.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { healthSyncSchema } from '../schemas/health.schemas.js';

const router = Router();

router.post('/sync', authenticateToken, validateRequest(healthSyncSchema), syncHealthData);
router.get('/connection', authenticateToken, getAppleHealthConnection);

export default router;
