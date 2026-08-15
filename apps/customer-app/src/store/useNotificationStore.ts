import { create } from 'zustand';
import { apiClient } from '@medivo/api-client';

interface NotificationState {
  notifications: any[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 2, // Initial fallback count until API sync
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.notifications.list();
      set({
        notifications: res?.notifications || [],
        unreadCount: typeof res?.unreadCount === 'number' ? res.unreadCount : 0,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch notifications', loading: false });
    }
  },

  markAsRead: async (notifId: string) => {
    try {
      const res = await apiClient.notifications.markAsRead(notifId);
      set({
        notifications: res?.notifications || [],
        unreadCount: typeof res?.unreadCount === 'number' ? res.unreadCount : 0,
      });
    } catch (err: any) {}
  },

  markAllAsRead: async () => {
    try {
      const res = await apiClient.notifications.markAllAsRead();
      set({
        notifications: res?.notifications || [],
        unreadCount: typeof res?.unreadCount === 'number' ? res.unreadCount : 0,
      });
    } catch (err: any) {}
  },
}));
