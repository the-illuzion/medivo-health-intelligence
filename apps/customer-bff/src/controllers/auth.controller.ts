import { Request, Response, NextFunction } from 'express';
import { PostgresAuthRepository, JwtTokenService, AuthenticateUserUseCase, User } from '@medivo/service-api';
import { auditService } from '../services/audit.service.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

const authRepo = new PostgresAuthRepository();
const jwtService = new JwtTokenService();
const authenticateUserUseCase = new AuthenticateUserUseCase(authRepo, jwtService);

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authenticateUserUseCase.execute(email, password);
    auditService.logEvent('USER_LOGIN_SUCCESS', result.user.email, 'AUTH_SERVICE');
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, skinType } = req.body;
    const id = `usr-${Date.now()}`;
    const newUser = new User({
      id,
      name,
      email,
      passwordHash: 'hashed_pw_' + Date.now(),
      skinType: skinType || 'Combination',
      hipaaConsent: true,
      createdAt: new Date(),
    });
    await authRepo.save(newUser);
    const token = await jwtService.generateToken(id, 'PATIENT');
    auditService.logEvent('USER_REGISTRATION', email, 'AUTH_SERVICE');
    res.status(201).json({ success: true, data: { user: newUser.toDTO(), token } });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'ANONYMOUS';
    auditService.logEvent('USER_LOGOUT_SUCCESS', userId, 'AUTH_SERVICE');
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
