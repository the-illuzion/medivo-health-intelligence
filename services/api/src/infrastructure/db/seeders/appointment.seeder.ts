import { DatabasePool } from '../DatabasePool.js';

export async function seedAppointments(): Promise<void> {
  const appointments = [
    { id: 'apt-101', patientId: 'usr-101', doctorId: '1', scheduledTime: '2026-08-15 10:30:00', status: 'SCHEDULED' },
    { id: 'apt-102', patientId: 'usr-102', doctorId: '2', scheduledTime: '2026-08-15 11:15:00', status: 'SCHEDULED' },
  ];

  for (const apt of appointments) {
    try {
      await DatabasePool.query(
        `INSERT INTO appointment_schema.appointments (id, patient_id, doctor_id, scheduled_time, status)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status`,
        [apt.id, apt.patientId, apt.doctorId, apt.scheduledTime, apt.status]
      );
    } catch (err: any) {
      console.warn('[AppointmentSeeder Warning]:', err.message);
    }
  }
}
