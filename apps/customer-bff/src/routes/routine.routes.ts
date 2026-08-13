import { Router } from 'express';
import { listRoutines, getRoutineDetails } from '../controllers/routine.controller.js';

const router = Router();

router.get('/', listRoutines);
router.get('/:id', getRoutineDetails);

export default router;
