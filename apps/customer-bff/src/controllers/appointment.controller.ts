import { Request, Response, NextFunction } from 'express';
import { appointmentService } from '../services/appointment.service.js';
import { auditService } from '../services/audit.service.js';
import { notificationService } from '../services/notification.service.js';

export const listAppointments = (_req: Request, res: Response, next: NextFunction) => {
  try {
    const appointments = appointmentService.getAll();
    res.json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
};

export const bookAppointment = (req: Request, res: Response, next: NextFunction) => {
  try {
    const newAppointment = appointmentService.create(req.body);
    
    auditService.logEvent('TELEHEALTH_BOOKING_CREATED', newAppointment.patientName, 'APPOINTMENT_SERVICE');
    notificationService.push(
      'Telehealth Consultation Booked',
      `Your video consultation with ${newAppointment.doctorName} is confirmed for ${newAppointment.date} at ${newAppointment.time}.`
    );

    res.status(201).json({ success: true, data: newAppointment });
  } catch (err) {
    next(err);
  }
};

export const getAppointmentDetails = (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointment = appointmentService.getById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment record not found' });
    }
    res.json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};
