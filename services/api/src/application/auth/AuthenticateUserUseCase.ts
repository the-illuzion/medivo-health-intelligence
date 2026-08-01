import { IAuthRepository } from '../../domain/repositories/IAuthRepository.js';
import { JwtTokenService } from '../../infrastructure/security/JwtTokenService.js';

export class AuthenticateUserUseCase {
  constructor(
    private authRepo: IAuthRepository,
    private jwtService: JwtTokenService
  ) {}

  async execute(email: string, passwordHash: string) {
    const user = await this.authRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const token = this.jwtService.generateToken(user.id, user.email);
    return {
      user: user.toDTO(),
      token,
    };
  }
}
