import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { SessionRepository } from '../repositories/SessionRepository.js';

export class TokenService {
  constructor(private sessionRepo: SessionRepository = new SessionRepository()) {}

  public issueToken(userId: string, role: 'PATIENT' | 'DOCTOR' | 'ADMIN' = 'PATIENT'): { token: string; expiresInSeconds: number } {
    const token = jwt.sign(
      { sub: userId, role, iss: 'medivo-auth-service' },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    this.sessionRepo.save({
      sessionId: `sess-${Date.now()}`,
      userId,
      role,
      tokenHash: token.substring(0, 15),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    });

    return { token, expiresInSeconds: 86400 };
  }

  public verifyToken(token: string): any {
    return jwt.verify(token, env.JWT_SECRET);
  }
}
