export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  channel: 'PUSH' | 'EMAIL' | 'SMS';
  timestamp: string;
  unread: boolean;
}
