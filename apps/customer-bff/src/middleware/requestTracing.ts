import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      id?: string;
      startTime?: number;
    }
  }
}

/**
 * Distributed Request Tracing Middleware
 * Ensures every incoming HTTP request has a unique correlation ID for end-to-end tracing.
 */
export function requestTracing(req: Request, res: Response, next: NextFunction) {
  const reqId =
    (req.headers['x-request-id'] as string) ||
    (req.headers['x-correlation-id'] as string) ||
    `req-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  req.id = reqId;
  req.startTime = Date.now();

  res.setHeader('x-request-id', reqId);
  res.setHeader('x-correlation-id', reqId);

  next();
}
