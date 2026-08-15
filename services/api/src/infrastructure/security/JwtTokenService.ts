import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'medivo-production-jwt-secret-key-2026';

export class JwtTokenService {
  generateToken(userId: string, email: string): string {
    return jwt.sign({ sub: userId, userId, email, role: 'PATIENT' }, JWT_SECRET, { expiresIn: '7d' });
  }

  verifyToken(token: string): { sub: string; userId: string; email: string; role: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { sub: string; userId: string; email: string; role: string };
    } catch {
      return null;
    }
  }
}
