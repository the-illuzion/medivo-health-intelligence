import { Router } from 'express';
import { getCarePlan, toggleTask, markAllTasksCompleted } from '../controllers/care.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/plan', authenticateToken, getCarePlan);
router.post('/tasks/toggle', authenticateToken, toggleTask);
router.post('/tasks/mark-all', authenticateToken, markAllTasksCompleted);

export default router;
