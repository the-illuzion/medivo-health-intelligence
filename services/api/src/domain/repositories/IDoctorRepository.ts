import { Doctor } from '../appointments/DoctorEntity.js';

export interface IDoctorRepository {
  findAll(): Promise<Doctor[]>;
  findById(id: string): Promise<Doctor | null>;
}
