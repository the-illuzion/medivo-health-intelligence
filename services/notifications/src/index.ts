export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  channel: 'PUSH' | 'EMAIL' | 'SMS';
}
