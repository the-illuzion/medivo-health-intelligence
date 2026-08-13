import { Notification } from '../models/Notification.js';

export class NotificationRepository {
  private log: Notification[] = [
    { id: 'notif-1', userId: 'usr-101', title: 'AI Skin Telemetry Complete', message: 'Your scan report score of 87/100 is ready for review.', channel: 'PUSH', timestamp: '10m ago', unread: true },
    { id: 'notif-2', userId: 'usr-101', title: 'Prescription Shipped', message: 'Order #MED-84920 has been dispatched via FedEx.', channel: 'EMAIL', timestamp: '2h ago', unread: true },
    { id: 'notif-3', userId: 'usr-101', title: 'Upcoming Telehealth Consultation', message: 'Video call with Dr. Aris Thorne, MD starts in 30 mins.', channel: 'PUSH', timestamp: '1d ago', unread: false },
  ];

  public async findAll(): Promise<Notification[]> {
    return this.log;
  }

  public async save(notification: Notification): Promise<void> {
    this.log.unshift(notification);
  }
}
