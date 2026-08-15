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
  private appointments: Appointment[] = [];

  public getAll(): Appointment[] {
    return this.appointments;
  }

  public getById(id: string): Appointment | null {
    return this.appointments.find((a) => a.id === id) || null;
  }

  public create(data: { patientId: string; patientName: string; doctorId: string; doctorName: string; time: string; date: string; condition?: string }): Appointment {
    if (!data.patientId || !data.patientName) {
      throw new Error('Patient authentication required to schedule an appointment.');
    }
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: data.patientId,
      patientName: data.patientName,
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
