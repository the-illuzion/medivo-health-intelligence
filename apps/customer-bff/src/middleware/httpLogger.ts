import { Request, Response, NextFunction } from 'express';
import { createLogger } from '@medivo/utils';

const bffLogger = createLogger('customer-bff');

/**
 * HTTP Access Logging Middleware
 * Captures method, URL path, response status code, execution duration in ms, IP hash, and correlation IDs.
 */
export function httpLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const path = req.originalUrl || req.url;
  const method = req.method;
  const reqId = req.id || 'req-untracked';
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const ipHash = `${ip.substring(0, 4)}...${ip.slice(-3)}`;

  // Skip spammy internal healthcheck polling logs in production if healthy
  const isHealthCheck = path === '/health' || path.endsWith('/health');

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const userId = (req as any).user?.userId || 'anonymous';

    const logContext = {
      reqId,
      method,
      path,
      statusCode,
      durationMs: duration,
      ipHash,
      userId,
    };

    if (statusCode >= 500) {
      bffLogger.error(`HTTP ${method} ${path} -> ${statusCode} (${duration}ms)`, logContext);
    } else if (statusCode >= 400) {
      bffLogger.warn(`HTTP ${method} ${path} -> ${statusCode} (${duration}ms)`, logContext);
    } else {
      if (!isHealthCheck) {
        bffLogger.info(`HTTP ${method} ${path} -> ${statusCode} (${duration}ms)`, logContext);
      } else {
        bffLogger.debug(`HealthCheck ${method} ${path} -> ${statusCode} (${duration}ms)`, logContext);
      }
    }
  });

  next();
}
