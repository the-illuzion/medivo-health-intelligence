import { Request, Response, NextFunction } from 'express';
import { InMemoryDoctorRepository, ListDoctorsUseCase } from '@medivo/service-api';

const doctorRepo = new InMemoryDoctorRepository();
const listDoctorsUseCase = new ListDoctorsUseCase(doctorRepo);

export const listDoctors = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const doctors = await listDoctorsUseCase.execute();
    res.json({ success: true, data: doctors });
  } catch (err) {
    next(err);
  }
};
