import { User } from '../../domain/auth/UserEntity.js';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository.js';
import { DatabasePool } from '../db/DatabasePool.js';

export class PostgresAuthRepository implements IAuthRepository {
  private fallbackUsers: Map<string, User> = new Map();

  async findByEmail(email: string): Promise<User | null> {
    try {
      const res = await DatabasePool.query(
        'SELECT id, email, password_hash, status, created_at FROM auth_schema.users WHERE email = $1 LIMIT 1',
        [email]
      );
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return new User({
          id: row.id,
          name: email.split('@')[0],
          email: row.email,
          passwordHash: row.password_hash,
          skinType: 'Combination',
          hipaaConsent: true,
          createdAt: new Date(row.created_at),
        });
      }
    } catch (err) {
      // Fallback to runtime memory store if DB is offline
    }
    return this.fallbackUsers.get(email) || null;
  }

  async findById(id: string): Promise<User | null> {
    try {
      const res = await DatabasePool.query(
        'SELECT id, email, password_hash, status, created_at FROM auth_schema.users WHERE id = $1 LIMIT 1',
        [id]
      );
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return new User({
          id: row.id,
          name: row.email.split('@')[0],
          email: row.email,
          passwordHash: row.password_hash,
          skinType: 'Combination',
          hipaaConsent: true,
          createdAt: new Date(row.created_at),
        });
      }
    } catch (err) {
      // Fallback to runtime memory store if DB is offline
    }
    return this.fallbackUsers.get(id) || null;
  }

  async save(user: User): Promise<void> {
    this.fallbackUsers.set(user.id, user);
    this.fallbackUsers.set(user.email, user);
    try {
      await DatabasePool.query(
        `INSERT INTO auth_schema.users (id, email, password_hash, status, created_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
        [user.id, user.email, user.passwordHash, 'ACTIVE', user.createdAt]
      );
    } catch (err) {
      console.warn('[PostgresAuthRepository] DB write fallback engaged:', (err as Error).message);
    }
  }
}
