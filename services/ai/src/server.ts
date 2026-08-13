import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import aiRoutes from './routes/ai.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Medivo AI Vision Engine Service',
    modelVersion: env.MODEL_VERSION,
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/ai', aiRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🧠 Medivo AI Vision Service running on http://localhost:${PORT}`);
});
