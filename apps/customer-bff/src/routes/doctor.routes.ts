import { Router } from 'express';
import { listDoctors } from '../controllers/doctor.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Protect doctor directory endpoint with authentication
router.use(authenticateToken);

router.get('/', listDoctors);

export default router;
