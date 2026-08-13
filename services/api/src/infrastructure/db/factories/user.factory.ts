import { User, UserProps } from '../../../domain/auth/UserEntity.js';

export function buildUserFactory(overrides?: Partial<UserProps>): User {
  const id = `usr-${Math.floor(1000 + Math.random() * 9000)}`;
  return new User({
    id,
    name: 'Test Patient',
    email: `patient_${id}@medivo.health`,
    passwordHash: 'hashed_secret_123',
    skinType: 'Combination',
    hipaaConsent: true,
    createdAt: new Date(),
    ...overrides,
  });
}
