import { Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const listNotifications = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required. Invalid user session.' });
    }
    const notifications = notificationService.getUserNotifications(userId);
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};
