import { z } from 'zod';

export const bookAppointmentSchema = z.object({
  patientId: z.string().min(1, 'patientId is required'),
  doctorId: z.string().min(1, 'doctorId is required'),
  scheduledTime: z.string().min(1, 'scheduledTime is required'),
});

export type BookAppointmentDTO = z.infer<typeof bookAppointmentSchema>;
