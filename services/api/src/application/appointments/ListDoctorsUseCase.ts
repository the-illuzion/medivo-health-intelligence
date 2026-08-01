import { IDoctorRepository } from '../../domain/repositories/IDoctorRepository.js';

export class ListDoctorsUseCase {
  constructor(private doctorRepo: IDoctorRepository) {}

  async execute() {
    const doctors = await this.doctorRepo.findAll();
    return doctors.map((d) => d.toDTO());
  }
}
