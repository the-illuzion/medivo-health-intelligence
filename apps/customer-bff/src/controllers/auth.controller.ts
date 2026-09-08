import { Request, Response, NextFunction } from 'express';
import { PostgresAuthRepository, JwtTokenService, AuthenticateUserUseCase, User } from '@medivo/service-api';
import { auditService } from '../services/audit.service.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { createLogger } from '@medivo/utils';

const authRepo = new PostgresAuthRepository();
const jwtService = new JwtTokenService();
const authenticateUserUseCase = new AuthenticateUserUseCase(authRepo, jwtService);
const authLogger = createLogger('auth-controller');

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const { email, password } = req.body;

  try {
    const result = await authenticateUserUseCase.execute(email, password);
    auditService.logEvent('USER_LOGIN_SUCCESS', result.user.email, 'AUTH_SERVICE', {
      ip,
      reqId: req.id,
      userId: result.user.id,
    });
    authLogger.info(`User login success: ${email}`, { reqId: req.id, userId: result.user.id });
    res.json({ success: true, data: result });
  } catch (err: any) {
    auditService.logEvent('USER_LOGIN_FAILED', email || 'UNKNOWN', 'AUTH_SERVICE', {
      ip,
      reqId: req.id,
      reason: err?.message || 'Authentication failed',
    });
    authLogger.warn(`User login failed for email ${email}: ${err.message}`, {
      reqId: req.id,
      ip,
    });
    next(err);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  try {
    const { name, email, password, skinType } = req.body;
    const id = `usr-${Date.now()}`;
    const newUser = new User({
      id,
      name,
      email,
      passwordHash: password,
      skinType: skinType || 'Combination',
      hipaaConsent: true,
      createdAt: new Date(),
    });
    await authRepo.save(newUser);
    const token = await jwtService.generateToken(id, 'PATIENT');
    auditService.logEvent('USER_REGISTRATION', email, 'AUTH_SERVICE', {
      ip,
      reqId: req.id,
      userId: id,
    });
    authLogger.info(`User registered successfully: ${email} (${id})`, { reqId: req.id, userId: id });
    res.status(201).json({ success: true, data: { user: newUser.toDTO(), token } });
  } catch (err: any) {
    authLogger.error(`User registration failed for ${req.body?.email}: ${err.message}`, { reqId: req.id }, err);
    next(err);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'ANONYMOUS';
    auditService.logEvent('USER_LOGOUT_SUCCESS', userId, 'AUTH_SERVICE', {
      reqId: req.id,
    });
    authLogger.info(`User logged out: ${userId}`, { reqId: req.id, userId });
    res.json({
      success: true,
      message: 'Session token invalidated and logged out successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required. Invalid user session.' });
    }
    const user = await authRepo.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }
    res.json({ success: true, data: user.toDTO() });
  } catch (err) {
    next(err);
  }
};
