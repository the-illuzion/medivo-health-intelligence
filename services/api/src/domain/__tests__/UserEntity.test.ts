import { describe, it, expect } from 'vitest';
import { User } from '../auth/UserEntity.js';

describe('User Domain Entity', () => {
  it('should instantiate User entity correctly with HIPAA consent', () => {
    const user = new User({
      id: 'usr-101',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      passwordHash: 'hashed_password_123',
      skinType: 'Combination',
      hipaaConsent: true,
      createdAt: new Date('2026-01-15T00:00:00Z'),
    });

    expect(user.id).toBe('usr-101');
    expect(user.name).toBe('Sarah Jenkins');
    expect(user.email).toBe('sarah.j@example.com');
    expect(user.hipaaConsent).toBe(true);
    expect(user.toDTO()).toEqual({
      id: 'usr-101',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      skinType: 'Combination',
      hipaaConsent: true,
      createdAt: '2026-01-15T00:00:00.000Z',
    });
  });
});
