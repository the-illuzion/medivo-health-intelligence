import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Medivo Customer BFF',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Mount modular API v1 router
app.use('/api/v1', apiRouter);

// Centralized Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Medivo Customer BFF Server running on http://localhost:${PORT}`);
});
