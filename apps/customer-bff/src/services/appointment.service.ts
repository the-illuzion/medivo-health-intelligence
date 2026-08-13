export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  time: string;
  date: string;
  status: 'Confirmed' | 'In Waiting Room' | 'Completed' | 'Cancelled';
  condition: string;
  createdAt: string;
}

class DynamicAppointmentService {
  private appointments: Appointment[] = [
    {
      id: 'apt-101',
      patientId: 'usr-101',
      patientName: 'Sarah Jenkins',
      doctorId: '1',
      doctorName: 'Dr. Aris Thorne, MD',
      time: '10:30 AM',
      date: '2026-08-15',
      status: 'Confirmed',
      condition: 'Barrier Damage Assessment',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'apt-102',
      patientId: 'usr-102',
      patientName: 'Alex Morgan',
      doctorId: '2',
      doctorName: 'Dr. Elena Rostova, MD',
      time: '11:15 AM',
      date: '2026-08-15',
      status: 'In Waiting Room',
      condition: 'Eczema Flare Telemetry',
      createdAt: new Date().toISOString(),
    },
  ];

  public getAll(): Appointment[] {
    return this.appointments;
  }

  public getById(id: string): Appointment | null {
    return this.appointments.find((a) => a.id === id) || null;
  }

  public create(data: { patientId?: string; patientName?: string; doctorId: string; doctorName: string; time: string; date: string; condition?: string }): Appointment {
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: data.patientId || 'usr-101',
      patientName: data.patientName || 'Sarah Jenkins',
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      time: data.time,
      date: data.date,
      status: 'Confirmed',
      condition: data.condition || 'General Tele-Dermatology Telemetry',
      createdAt: new Date().toISOString(),
    };
    this.appointments.unshift(newAppointment);
    return newAppointment;
  }
}

export const appointmentService = new DynamicAppointmentService();
