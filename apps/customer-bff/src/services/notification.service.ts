export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
}

class DynamicNotificationService {
  private notifications: Notification[] = [
    { id: 'n1', userId: 'all', title: 'AI Skin Telemetry Complete', message: 'Your scan report score of 87/100 is ready for review.', timestamp: '10m ago', unread: true },
    { id: 'n2', userId: 'all', title: 'Prescription Shipped', message: 'Order #MED-84920 has been dispatched via FedEx.', timestamp: '2h ago', unread: true },
    { id: 'n3', userId: 'all', title: 'Upcoming Telehealth Consultation', message: 'Video call with Dr. Aris Thorne, MD starts in 30 mins.', timestamp: '1d ago', unread: false },
  ];

  public getUserNotifications(userId: string): { notifications: Notification[]; unreadCount: number } {
    const userNotifs = this.notifications.filter((n) => !n.userId || n.userId === 'all' || n.userId === userId);
    const unreadCount = userNotifs.filter((n) => n.unread).length;
    return { notifications: userNotifs, unreadCount };
  }

  public markAsRead(userId: string, notifId: string): { notifications: Notification[]; unreadCount: number } {
    this.notifications = this.notifications.map((n) => {
      if (n.id === notifId && (!n.userId || n.userId === 'all' || n.userId === userId)) {
        return { ...n, unread: false };
      }
      return n;
    });
    return this.getUserNotifications(userId);
  }

  public markAllAsRead(userId: string): { notifications: Notification[]; unreadCount: number } {
    this.notifications = this.notifications.map((n) => {
      if (!n.userId || n.userId === 'all' || n.userId === userId) {
        return { ...n, unread: false };
      }
      return n;
    });
    return this.getUserNotifications(userId);
  }

  public push(title: string, message: string, userId: string = 'all'): Notification {
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId,
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
