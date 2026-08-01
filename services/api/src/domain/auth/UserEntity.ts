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
