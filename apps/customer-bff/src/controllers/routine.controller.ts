import { Response, NextFunction } from 'express';
import { routineService } from '../services/routine.service.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const listRoutines = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const routines = routineService.getUserRoutines(userId);
    res.json({ success: true, data: routines });
  } catch (err) {
    next(err);
  }
};

export const getRoutineDetails = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const routine = routineService.getById(req.params.id, userId);
    if (!routine) {
      return res.status(404).json({ success: false, error: 'Routine not found' });
    }
    res.json({ success: true, data: routine });
  } catch (err) {
    next(err);
  }
};

export const toggleRoutineStep = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const { routineId, stepId, completed } = req.body;
    const updatedRoutine = routineService.toggleStepCompletion(userId, routineId, stepId, completed);
    if (!updatedRoutine) {
      return res.status(404).json({ success: false, error: 'Routine or step not found' });
    }
    res.json({ success: true, data: updatedRoutine });
  } catch (err) {
    next(err);
  }
};
