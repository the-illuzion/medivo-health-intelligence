export interface DoctorProps {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviewsCount: number;
  specialty: string;
  price: number;
  nextAvailable: string;
  avatarBg: string;
  slots: string[];
}

export class Doctor {
  constructor(private props: DoctorProps) {}

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }

  toDTO() {
    return { ...this.props };
  }
}
