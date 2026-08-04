export interface DoctorConsultation {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  price: number;
  nextAvailable: string;
  slots: string[];
  providerName: string; // Third-party provider name (e.g., Teladoc, Doximity, Amwell)
}

export interface TelehealthProvider {
  name: string;
  getDoctors(): Promise<DoctorConsultation[]>;
  bookAppointment(doctorId: string, slot: string): Promise<{ appointmentId: string; videoUrl: string }>;
}

export class ExternalTelehealthService implements TelehealthProvider {
  public name = 'Medivo Telehealth Integration Network';

  public async getDoctors(): Promise<DoctorConsultation[]> {
    return [
      {
        id: 'doc_1',
        name: 'Dr. Elena Rostova, MD',
        specialty: 'Board-Certified Dermatologist',
        rating: 4.9,
        reviewsCount: 142,
        price: 95,
        nextAvailable: 'Today, 4:30 PM',
        slots: ['04:30 PM', '05:15 PM', '06:00 PM'],
        providerName: 'Doximity Care Network',
      },
      {
        id: 'doc_2',
        name: 'Dr. Marcus Vance, MD',
        specialty: 'Clinical Dermatology & Telehealth',
        rating: 4.95,
        reviewsCount: 210,
        price: 110,
        nextAvailable: 'Tomorrow, 10:00 AM',
        slots: ['10:00 AM', '11:30 AM', '02:00 PM'],
        providerName: 'Amwell Telehealth Provider',
      },
    ];
  }

  public async bookAppointment(doctorId: string, slot: string) {
    return {
      appointmentId: `apt_${Date.now().toString().slice(-4)}`,
      videoUrl: `https://telehealth.medivo.health/session/${doctorId}?slot=${encodeURIComponent(slot)}`,
    };
  }
}

export const externalTelehealthService = new ExternalTelehealthService();
