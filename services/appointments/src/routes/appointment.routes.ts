import { Router } from 'express';
import { listAppointments, bookAppointment } from '../controllers/appointment.controller.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { bookAppointmentSchema } from '../schemas/appointment.schemas.js';

const router = Router();

router.get('/', listAppointments);
router.post('/book', validateRequest(bookAppointmentSchema), bookAppointment);

export default router;
