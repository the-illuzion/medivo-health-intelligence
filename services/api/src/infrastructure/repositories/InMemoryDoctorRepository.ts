import { Doctor } from '../../domain/appointments/DoctorEntity.js';
import { IDoctorRepository } from '../../domain/repositories/IDoctorRepository.js';

export class InMemoryDoctorRepository implements IDoctorRepository {
  private doctors: Doctor[] = [
    new Doctor({
      id: '1',
      name: 'Dr. Aris Thorne, MD',
      title: 'Board-Certified Dermatologist',
      rating: 4.9,
      reviewsCount: 142,
      specialty: 'Clinical Dermatology & Tele-Health',
      price: 95,
      nextAvailable: 'Today at 03:00 PM',
      avatarBg: '#4338CA',
      slots: ['03:00 PM', '04:30 PM', '06:00 PM'],
    }),
    new Doctor({
      id: '2',
      name: 'Dr. Elena Rostova, MD',
      title: 'Cosmetic & Laser Specialist',
      rating: 4.8,
      reviewsCount: 98,
      specialty: 'Pigmentation & Acne Barrier Therapy',
      price: 110,
      nextAvailable: 'Tomorrow at 10:00 AM',
      avatarBg: '#059669',
      slots: ['10:00 AM', '01:30 PM', '03:00 PM'],
    }),
  ];

  async findAll(): Promise<Doctor[]> {
    return this.doctors;
  }

  async findById(id: string): Promise<Doctor | null> {
    return this.doctors.find((d) => d.id === id) || null;
  }
}
