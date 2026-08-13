import { Appointment } from '../models/Appointment.js';
import { PostgresAppointmentRepository } from '../repositories/PostgresAppointmentRepository.js';

export class AppointmentService {
  constructor(private repo: PostgresAppointmentRepository = new PostgresAppointmentRepository()) {}

  public async getAppointments(): Promise<Appointment[]> {
    return this.repo.findAll();
  }

  public async book(patientId: string, doctorId: string, scheduledTime: string): Promise<Appointment> {
    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId,
      doctorId,
      scheduledTime,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
    };

    await this.repo.save(appointment);
    return appointment;
  }
}
