import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { createLogger } from '@medivo/utils';

const aiLogger = createLogger('service-ai');

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
        aiLogger.warn(`Validation failed on ${req.method} ${req.originalUrl || req.url}`, {
          reqId: (req as any).id,
          validationErrors: details,
        });
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          details,
          reqId: (req as any).id,
        });
      }
      next(err);
    }
  };
};

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  const reqId = (req as any).id || 'req-untracked';
  const path = req.originalUrl || req.url;
  const method = req.method;
  const status = err.status || 500;
  const message = err.message || 'Internal AI Service Error';

  if (status >= 500) {
    aiLogger.error(`Unhandled AI Exception on ${method} ${path}: ${message}`, {
      reqId,
      path,
      method,
      statusCode: status,
    }, err instanceof Error ? err : new Error(String(err)));
  } else {
    aiLogger.warn(`Client Error on ${method} ${path} -> ${status}: ${message}`, {
      reqId,
      path,
      method,
      statusCode: status,
    });
  }

  res.status(status).json({
    success: false,
    error: message,
    reqId,
    timestamp: new Date().toISOString(),
  });
};
