import { Request, Response, NextFunction } from 'express';
import { PostgresAuthRepository, JwtTokenService, AuthenticateUserUseCase, User } from '@medivo/service-api';
import { auditService } from '../services/audit.service.js';

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

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.query.userId as string) || 'usr-101';
    const user = await authRepo.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }
    res.json({ success: true, data: user.toDTO() });
  } catch (err) {
    next(err);
  }
};
