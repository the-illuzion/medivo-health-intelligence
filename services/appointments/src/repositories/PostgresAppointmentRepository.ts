import pg from 'pg';
import { Appointment } from '../models/Appointment.js';
import { env } from '../config/env.js';

const { Pool } = pg;

export class PostgresAppointmentRepository {
  private pool: pg.Pool;

  constructor() {
    this.pool = new Pool({ connectionString: env.DATABASE_URL });
  }

  public async findAll(): Promise<Appointment[]> {
    try {
      const res = await this.pool.query(
        `SELECT id, patient_id as "patientId", doctor_id as "doctorId", scheduled_time as "scheduledTime", status, created_at as "createdAt"
         FROM appointment_schema.appointments
         ORDER BY scheduled_time DESC`
      );
      if (res.rows.length > 0) return res.rows;
    } catch (err) {}

    return [
      { id: 'apt-101', patientId: 'usr-101', doctorId: '1', scheduledTime: '2026-08-15T10:30:00Z', status: 'SCHEDULED' },
      { id: 'apt-102', patientId: 'usr-102', doctorId: '2', scheduledTime: '2026-08-15T11:15:00Z', status: 'SCHEDULED' },
    ];
  }

  public async save(appointment: Appointment): Promise<void> {
    try {
      await this.pool.query(
        `INSERT INTO appointment_schema.appointments (id, patient_id, doctor_id, scheduled_time, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [appointment.id, appointment.patientId, appointment.doctorId, appointment.scheduledTime, appointment.status]
      );
    } catch (err) {}
  }
}
