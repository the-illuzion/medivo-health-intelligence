import { Response, NextFunction } from 'express';
import { careService } from '../services/care.service.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getCarePlan = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);
    const data = careService.getCarePlan(userId, date);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const toggleTask = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const { taskId, date, status } = req.body;
    const planDate = date || new Date().toISOString().slice(0, 10);
    const data = careService.toggleTaskStatus(userId, planDate, taskId, status);
    if (!data) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const markAllTasksCompleted = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const planDate = (req.body.planDate as string) || (req.query.date as string) || new Date().toISOString().slice(0, 10);
    const data = careService.markAllDone(userId, planDate);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
