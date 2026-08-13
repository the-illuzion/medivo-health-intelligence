export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledTime: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt?: string;
}
