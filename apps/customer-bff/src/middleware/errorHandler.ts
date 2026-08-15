import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
        });
      }
      next(err);
    }
  };
};

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Customer BFF Error]:', err.message || err);
  const status = err.status || (err.message === 'Invalid email or password' ? 401 : 500);
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  });
};
