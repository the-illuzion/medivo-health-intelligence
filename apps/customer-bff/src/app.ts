import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import mobileBffRouter from './routes/index.js';
import adminBffRouter from './routes/admin-bff.routes.js';
import doctorBffRouter from './routes/doctor-bff.routes.js';
import { requestTracing } from './middleware/requestTracing.js';
import { httpLogger } from './middleware/httpLogger.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();

// Middleware Stack
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(requestTracing);
app.use(httpLogger);

// Internal Container Healthcheck
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Medivo Unified BFF Gateway',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Standardized BFF Routes & Healthchecks
app.use('/api/mobile-bff', mobileBffRouter);
app.use('/api/admin-bff', adminBffRouter);
app.use('/api/doctor-bff', doctorBffRouter);

// Backwards-compatibility alias for v1 mobile clients
app.use('/api/v1', mobileBffRouter);

// Centralized Error Handling Middleware
app.use(errorHandler);
