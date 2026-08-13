import { Router } from 'express';
import { listAppointments, bookAppointment, getAppointmentDetails } from '../controllers/appointment.controller.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { bookAppointmentSchema } from '../schemas/dto.schemas.js';

const router = Router();

router.get('/', listAppointments);
router.post('/book', validateRequest(bookAppointmentSchema), bookAppointment);
router.get('/:id', getAppointmentDetails);

export default router;
