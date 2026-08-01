import { User } from '../../domain/auth/UserEntity.js';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository.js';

export class InMemoryAuthRepository implements IAuthRepository {
  private users: Map<string, User> = new Map();

  constructor() {
    // Seed default user
    const defaultUser = new User({
      id: 'usr-101',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      passwordHash: 'hashed_password_123',
      skinType: 'Combination',
      hipaaConsent: true,
      createdAt: new Date('2026-01-15T00:00:00Z'),
    });
    this.users.set(defaultUser.id, defaultUser);
    this.users.set(defaultUser.email, defaultUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.get(email) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
    this.users.set(user.email, user);
  }
}
