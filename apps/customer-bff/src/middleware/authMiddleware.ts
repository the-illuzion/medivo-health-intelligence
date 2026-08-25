import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'medivo-production-jwt-secret-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in to access this protected clinical resource.',
      code: 'UNAUTHORIZED',
      timestamp: new Date().toISOString(),
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; role: string };
    req.user = {
      userId: decoded.sub,
      role: decoded.role || 'PATIENT',
    };
    next();
  } catch (err: any) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired session token. Please sign in again.',
      code: 'FORBIDDEN',
      timestamp: new Date().toISOString(),
    });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Sufficient privileges required (Allowed: ${allowedRoles.join(', ')}).`,
        code: 'INSUFFICIENT_PERMISSIONS',
        timestamp: new Date().toISOString(),
      });
    }
    next();
  };
};
