import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4004;

app.use(cors());
app.use(express.json());

const notificationLog: any[] = [
  { id: '1', title: 'AI Skin Telemetry Complete', message: 'Your scan report score of 87/100 is ready for review.', timestamp: '10m ago', unread: true },
  { id: '2', title: 'Prescription Shipped', message: 'Order #MED-84920 has been dispatched via FedEx.', timestamp: '2h ago', unread: true },
  { id: '3', title: 'Upcoming Telehealth Consultation', message: 'Video call with Dr. Aris Thorne, MD starts in 30 mins.', timestamp: '1d ago', unread: false },
];

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Medivo Notification & Dispatcher Service',
    smtpHost: process.env.SMTP_HOST || 'localhost',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/notifications', (_req: Request, res: Response) => {
  res.json({ success: true, data: notificationLog });
});

app.post('/api/v1/notifications/send', (req: Request, res: Response) => {
  const { userId, title, message, channel } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, error: 'title and message are required' });
  }

  const notif = {
    id: `notif-${Date.now()}`,
    userId: userId || 'usr-101',
    title,
    message,
    channel: channel || 'PUSH',
    timestamp: 'Just now',
    unread: true,
  };

  notificationLog.unshift(notif);
  res.status(201).json({ success: true, data: notif });
});

app.listen(PORT, () => {
  console.log(`🔔 Medivo Notifications Service running on http://localhost:${PORT}`);
});
