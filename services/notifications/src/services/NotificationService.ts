import { Notification } from '../models/Notification.js';
import { NotificationRepository } from '../repositories/NotificationRepository.js';

export class NotificationService {
  constructor(private repo: NotificationRepository = new NotificationRepository()) {}

  public async getNotifications(): Promise<Notification[]> {
    return this.repo.findAll();
  }

  public async send(userId: string, title: string, message: string, channel: 'PUSH' | 'EMAIL' | 'SMS' = 'PUSH'): Promise<Notification> {
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      userId,
      title,
      message,
      channel,
      timestamp: 'Just now',
      unread: true,
    };

    await this.repo.save(notification);
    return notification;
  }
}
