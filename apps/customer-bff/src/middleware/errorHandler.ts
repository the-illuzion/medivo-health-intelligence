import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { createLogger } from '@medivo/utils';

const bffLogger = createLogger('customer-bff');

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
        bffLogger.warn(`Request validation failed on ${req.method} ${req.originalUrl || req.url}`, {
          reqId: req.id,
          validationErrors: details,
        });
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          details,
          reqId: req.id,
        });
      }
      next(err);
    }
  };
};

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  const reqId = req.id || 'req-untracked';
  const path = req.originalUrl || req.url;
  const method = req.method;
  const status = err.status || (err.message === 'Invalid email or password' ? 401 : 500);
  const message = err.message || 'Internal Server Error';

  if (status >= 500) {
    bffLogger.error(`Unhandled Server Exception on ${method} ${path}: ${message}`, {
      reqId,
      path,
      method,
      statusCode: status,
      userId: (req as any).user?.userId,
    }, err instanceof Error ? err : new Error(String(err)));
  } else {
    bffLogger.warn(`Client Error on ${method} ${path} -> ${status}: ${message}`, {
      reqId,
      path,
      method,
      statusCode: status,
      userId: (req as any).user?.userId,
    });
  }

  res.status(status).json({
    success: false,
    error: message,
    reqId,
    timestamp: new Date().toISOString(),
  });
};
