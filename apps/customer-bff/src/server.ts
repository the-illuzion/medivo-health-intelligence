import { app } from './app.js';
import { env } from './config/env.js';
import { DatabasePool } from '@medivo/service-api';
import { createLogger } from '@medivo/utils';

const PORT = env.PORT || 4000;
const serverLogger = createLogger('customer-bff');

// Auto-initialize PostgreSQL 13 domain schemas on startup
DatabasePool.initializeSchemas().catch((err) => {
  serverLogger.warn('[Database Auto-Init]:', { error: err.message });
});

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
