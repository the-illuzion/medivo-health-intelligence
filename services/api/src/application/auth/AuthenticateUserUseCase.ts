import { IAuthRepository } from '../../domain/repositories/IAuthRepository.js';
import { JwtTokenService } from '../../infrastructure/security/JwtTokenService.js';
import { PasswordService } from '../../infrastructure/security/PasswordService.js';

export class AuthenticateUserUseCase {
  constructor(
    private authRepo: IAuthRepository,
    private jwtService: JwtTokenService
  ) {}

  async execute(email: string, passwordInput: string) {
    const user = await this.authRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await user.verifyPassword(passwordInput);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Transparently upgrade legacy plain/mock password hashes to strong scrypt hashes on successful login
    if (user.needsPasswordRehash()) {
      try {
        const secureHash = await PasswordService.hash(passwordInput);
        user.setPasswordHash(secureHash);
        await this.authRepo.save(user);
      } catch (rehashErr) {
        console.warn('[AuthenticateUserUseCase] Auto-rehash notice:', (rehashErr as Error).message);
      }
    }

    const token = await this.jwtService.generateToken(user.id, 'PATIENT');
    return {
      user: user.toDTO(),
      token,
    };
  }
}
