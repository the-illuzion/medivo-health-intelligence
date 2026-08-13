export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
}

class DynamicNotificationService {
  private notifications: Notification[] = [
    { id: '1', title: 'AI Skin Telemetry Complete', message: 'Your scan report score of 87/100 is ready for review.', timestamp: '10m ago', unread: true },
    { id: '2', title: 'Prescription Shipped', message: 'Order #MED-84920 has been dispatched via FedEx.', timestamp: '2h ago', unread: true },
    { id: '3', title: 'Upcoming Telehealth Consultation', message: 'Video call with Dr. Aris Thorne, MD starts in 30 mins.', timestamp: '1d ago', unread: false },
  ];

  public getAll(): Notification[] {
    return this.notifications;
  }

  public push(title: string, message: string): Notification {
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      unread: true,
    };
    this.notifications.unshift(notif);
    return notif;
  }
}

export const notificationService = new DynamicNotificationService();
