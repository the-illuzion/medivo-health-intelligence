import { describe, it, expect } from 'vitest';
import { AuthenticateUserUseCase } from '../auth/AuthenticateUserUseCase.js';
import { InMemoryAuthRepository } from '../../infrastructure/repositories/InMemoryAuthRepository.js';
import { JwtTokenService } from '../../infrastructure/security/JwtTokenService.js';

describe('AuthenticateUserUseCase', () => {
  const authRepo = new InMemoryAuthRepository();
  const jwtService = new JwtTokenService();
  const useCase = new AuthenticateUserUseCase(authRepo, jwtService);

  it('should authenticate user and return user DTO + valid JWT token', async () => {
    const result = await useCase.execute('sarah.j@example.com', 'hashed_password_123');

    expect(result.user.name).toBe('Sarah Jenkins');
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe('string');
  });

  it('should throw error when email is not found', async () => {
    await expect(useCase.execute('nonexistent@example.com', 'pass')).rejects.toThrow('Invalid email or password');
  });
});
