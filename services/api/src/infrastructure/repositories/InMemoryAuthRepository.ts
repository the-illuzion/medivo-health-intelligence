import { User } from '../../domain/auth/UserEntity.js';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository.js';
import { PasswordService } from '../security/PasswordService.js';

export class InMemoryAuthRepository implements IAuthRepository {
  private users: Map<string, User> = new Map();

  constructor() {
    // Seed default test user
    const testUser = new User({
      id: 'usr-101',
      name: 'Alex Morgan',
      email: 'test@yopmail.com',
      passwordHash: PasswordService.hashSync('Test@123'),
      skinType: 'Combination',
      hipaaConsent: true,
      createdAt: new Date('2026-01-15T00:00:00Z'),
    });
    this.users.set(testUser.id, testUser);
    this.users.set(testUser.email, testUser);

    const sarahUser = new User({
      id: 'usr-100',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      passwordHash: PasswordService.hashSync('password123'),
      skinType: 'Combination',
      hipaaConsent: true,
      createdAt: new Date('2026-01-15T00:00:00Z'),
    });
    this.users.set(sarahUser.id, sarahUser);
    this.users.set(sarahUser.email, sarahUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.get(email.toLowerCase()) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
    this.users.set(user.email.toLowerCase(), user);
  }
}
