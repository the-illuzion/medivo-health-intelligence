import { Request, Response, NextFunction } from 'express';
import { AppointmentService } from '../services/AppointmentService.js';

const appointmentService = new AppointmentService();

export const listAppointments = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await appointmentService.getAppointments();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const bookAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patientId, doctorId, scheduledTime } = req.body;
    const appointment = await appointmentService.book(patientId, doctorId, scheduledTime);
    res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};
