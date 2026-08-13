import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/NotificationService.js';

const notificationService = new NotificationService();

export const listNotifications = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await notificationService.getNotifications();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const sendNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, title, message, channel } = req.body;
    const notification = await notificationService.send(userId, title, message, channel);
    res.status(201).json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};
