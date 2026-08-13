import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/TokenService.js';

const tokenService = new TokenService();

export const issueToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.body;
    const result = tokenService.issueToken(userId, role);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    const decoded = tokenService.verifyToken(token);
    res.json({ success: true, valid: true, data: decoded });
  } catch (err: any) {
    res.status(401).json({ success: false, valid: false, error: err.message });
  }
};
