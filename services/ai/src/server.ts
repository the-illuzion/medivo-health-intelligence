import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import aiRoutes from './routes/ai.routes.js';
import { httpLogger } from './middleware/httpLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createLogger } from '@medivo/utils';

const app = express();
const PORT = env.PORT || 8080;
const serverLogger = createLogger('service-ai');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(httpLogger);

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Medivo AI Vision Engine Service',
    modelVersion: env.MODEL_VERSION,
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Mount AI Routes across standard BFF & microservice RPC paths
app.use('/api/v1/ai', aiRoutes);
app.use('/api/ai/telemetry', aiRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/v1/ai/telemetry', aiRoutes);

app.use(errorHandler);


// Global Uncaught Exception & Promise Rejection Handlers
process.on('uncaughtException', (error: Error) => {
  serverLogger.fatal('Uncaught Exception occurred in AI Service process', {
    errorMessage: error.message,
    stack: error.stack,
  }, error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  serverLogger.fatal('Unhandled Promise Rejection occurred in AI Service process', {
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
  });
});

const server = app.listen(PORT, () => {
  serverLogger.info(`🧠 Medivo AI Vision Service running on http://localhost:${PORT}`, {
    port: PORT,
    environment: env.NODE_ENV,
    modelVersion: env.MODEL_VERSION,
  });
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  serverLogger.info('Received SIGTERM signal. Initiating graceful shutdown of AI Service...');
  server.close(() => {
    serverLogger.info('AI Service HTTP server closed. Process terminating.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  serverLogger.info('Received SIGINT signal. Initiating graceful shutdown of AI Service...');
  server.close(() => {
    serverLogger.info('AI Service HTTP server closed. Process terminating.');
    process.exit(0);
  });
});

