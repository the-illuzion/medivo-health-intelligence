import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'medivo_health_secret_key_2026';

export class JwtTokenService {
  generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
  }

  verifyToken(token: string): { userId: string; email: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    } catch {
      return null;
    }
  }
}
