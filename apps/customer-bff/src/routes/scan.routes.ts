import { Router } from 'express';
import { analyzeScan, getScanHistory, getScanDetails } from '../controllers/scan.controller.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { analyzeScanSchema } from '../schemas/dto.schemas.js';

const router = Router();

// Protect all skin scan endpoints with JWT token verification
router.use(authenticateToken);

router.post('/analyze', validateRequest(analyzeScanSchema), analyzeScan);
router.get('/history', getScanHistory);
router.get('/:id', getScanDetails);

export default router;
