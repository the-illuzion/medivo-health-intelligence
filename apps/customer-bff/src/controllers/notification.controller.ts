import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service.js';

export const listNotifications = (_req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = notificationService.getAll();
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};
