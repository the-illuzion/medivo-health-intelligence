import { Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const listNotifications = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required. Invalid user session.' });
    }
    const result = notificationService.getUserNotifications(userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const markAsRead = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required. Invalid user session.' });
    }
    const notifId = req.params.id;
    const result = notificationService.markAsRead(userId, notifId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required. Invalid user session.' });
    }
    const result = notificationService.markAllAsRead(userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
