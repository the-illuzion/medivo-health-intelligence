import { PasswordService } from '../../infrastructure/security/PasswordService.js';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  skinType?: string;
  hipaaConsent: boolean;
  createdAt: Date;
}

export class User {
  constructor(private props: UserProps) {}

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get email(): string { return this.props.email; }
  get passwordHash(): string { return this.props.passwordHash; }
  get skinType(): string | undefined { return this.props.skinType; }
  get hipaaConsent(): boolean { return this.props.hipaaConsent; }
  get createdAt(): Date { return this.props.createdAt; }

  public async verifyPassword(inputPassword: string): Promise<boolean> {
    if (!inputPassword) return false;
    return PasswordService.verify(inputPassword, this.props.passwordHash);
  }

  public verifyPasswordSync(inputPassword: string): boolean {
    if (!inputPassword) return false;
    return PasswordService.verifySync(inputPassword, this.props.passwordHash);
  }

  public needsPasswordRehash(): boolean {
    return PasswordService.needsRehash(this.props.passwordHash);
  }

  public setPasswordHash(newHash: string): void {
    this.props.passwordHash = newHash;
  }

  toDTO() {
    return {
      id: this.props.id,
      name: this.props.name,
      email: this.props.email,
      skinType: this.props.skinType,
      hipaaConsent: this.props.hipaaConsent,
      createdAt: this.props.createdAt.toISOString(),
    };
  }
}
