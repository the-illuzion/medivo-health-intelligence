import { Router } from 'express';
import { listAppointments, bookAppointment, getAppointmentDetails } from '../controllers/appointment.controller.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { bookAppointmentSchema } from '../schemas/dto.schemas.js';

const router = Router();

// Protect all appointment and telehealth endpoints
router.use(authenticateToken);

router.get('/', listAppointments);
router.post('/book', validateRequest(bookAppointmentSchema), bookAppointment);
router.get('/:id', getAppointmentDetails);

export default router;
