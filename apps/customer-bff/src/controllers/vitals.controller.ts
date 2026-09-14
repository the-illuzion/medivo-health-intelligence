import { Response, NextFunction } from 'express';
import { vitalsService } from '../services/vitals.service.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getVitals = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const period = (req.query.period as 'Day' | 'Week' | 'Month') || 'Day';
    const data = vitalsService.getVitals(userId, period);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getVitalByName = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const name = req.params.name;
    const data = vitalsService.getVitalByName(userId, name);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getInsights = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const data = vitalsService.getInsights(userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getAlerts = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const data = vitalsService.getAlerts(userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createVitalReading = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const data = vitalsService.addManualReading(userId, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
