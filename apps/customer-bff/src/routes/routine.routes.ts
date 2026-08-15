import { Router } from 'express';
import { listRoutines, getRoutineDetails, toggleRoutineStep } from '../controllers/routine.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', listRoutines);
router.post('/step', toggleRoutineStep);
router.put('/step', toggleRoutineStep);
router.get('/:id', getRoutineDetails);

export default router;
