import { Request, Response, NextFunction } from 'express';
import { routineService } from '../services/routine.service.js';

export const listRoutines = (_req: Request, res: Response, next: NextFunction) => {
  try {
    const routines = routineService.getAll();
    res.json({ success: true, data: routines });
  } catch (err) {
    next(err);
  }
};

export const getRoutineDetails = (req: Request, res: Response, next: NextFunction) => {
  try {
    const routine = routineService.getById(req.params.id);
    if (!routine) {
      return res.status(404).json({ success: false, error: 'Routine not found' });
    }
    res.json({ success: true, data: routine });
  } catch (err) {
    next(err);
  }
};
