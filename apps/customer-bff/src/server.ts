import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import mobileBffRouter from './routes/index.js';
import adminBffRouter from './routes/admin-bff.routes.js';
import doctorBffRouter from './routes/doctor-bff.routes.js';
import { requestTracing } from './middleware/requestTracing.js';
import { httpLogger } from './middleware/httpLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { DatabasePool } from '@medivo/service-api';
import { createLogger } from '@medivo/utils';

const app = express();
const PORT = env.PORT || 4000;
const serverLogger = createLogger('customer-bff');

// Auto-initialize PostgreSQL 13 domain schemas on startup
DatabasePool.initializeSchemas().catch((err) => {
  serverLogger.warn('[Database Auto-Init]:', { error: err.message });
});

// Middleware Stack
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(requestTracing);
app.use(httpLogger);

// Internal Docker Container Healthcheck
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

// Global Uncaught Exception & Promise Rejection Handlers
process.on('uncaughtException', (error: Error) => {
  serverLogger.fatal('Uncaught Exception occurred in BFF process', {
    errorMessage: error.message,
    stack: error.stack,
  }, error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  serverLogger.fatal('Unhandled Promise Rejection occurred in BFF process', {
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
  });
});

const server = app.listen(PORT, () => {
  serverLogger.info(`🚀 Medivo BFF Gateway running on http://localhost:${PORT}`, {
    port: PORT,
    environment: env.NODE_ENV,
    mobileBff: `/api/mobile-bff`,
    adminBff: `/api/admin-bff`,
    doctorBff: `/api/doctor-bff`,
  });
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  serverLogger.info('Received SIGTERM signal. Initiating graceful shutdown of BFF Gateway...');
  server.close(() => {
    serverLogger.info('BFF Gateway HTTP server closed. Process terminating.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  serverLogger.info('Received SIGINT signal. Initiating graceful shutdown of BFF Gateway...');
  server.close(() => {
    serverLogger.info('BFF Gateway HTTP server closed. Process terminating.');
    process.exit(0);
  });
});

