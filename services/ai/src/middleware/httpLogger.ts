import { Request, Response, NextFunction } from 'express';
import { createLogger } from '@medivo/utils';

const aiLogger = createLogger('service-ai');

/**
 * AI Service HTTP Access Logging Middleware
 */
export function httpLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const path = req.originalUrl || req.url;
  const method = req.method;
  const reqId =
    (req.headers['x-request-id'] as string) ||
    (req.headers['x-correlation-id'] as string) ||
    `ai-req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  (req as any).id = reqId;
  res.setHeader('x-request-id', reqId);
  res.setHeader('x-correlation-id', reqId);

  const isHealthCheck = path === '/health' || path.endsWith('/health');

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    const logContext = {
      reqId,
      method,
      path,
      statusCode,
      durationMs: duration,
    };

    if (statusCode >= 500) {
      aiLogger.error(`HTTP ${method} ${path} -> ${statusCode} (${duration}ms)`, logContext);
    } else if (statusCode >= 400) {
      aiLogger.warn(`HTTP ${method} ${path} -> ${statusCode} (${duration}ms)`, logContext);
    } else {
      if (!isHealthCheck) {
        aiLogger.info(`HTTP ${method} ${path} -> ${statusCode} (${duration}ms)`, logContext);
      } else {
        aiLogger.debug(`HealthCheck ${method} ${path} -> ${statusCode} (${duration}ms)`, logContext);
      }
    }
  });

  next();
}
