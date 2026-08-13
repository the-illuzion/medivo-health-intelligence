import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import notificationRoutes from './routes/notification.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = env.PORT || 4004;

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Medivo Notification & Dispatcher Service',
    environment: env.NODE_ENV,
    smtpHost: env.SMTP_HOST,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/notifications', notificationRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🔔 Medivo Notifications Service running on http://localhost:${PORT}`);
});
