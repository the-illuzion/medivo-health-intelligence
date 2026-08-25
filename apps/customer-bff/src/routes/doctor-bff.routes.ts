import { Router } from 'express';
import appointmentRoutes from './appointment.routes.js';
import scanRoutes from './scan.routes.js';
import doctorRoutes from './doctor.routes.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const doctorBffRouter = Router();

// Doctor BFF Health Check
doctorBffRouter.get('/health', (_req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Medivo Doctor BFF',
    timestamp: new Date().toISOString(),
  });
});

// Protect Doctor BFF routes
doctorBffRouter.use(authenticateToken);
doctorBffRouter.use(requireRole(['DOCTOR', 'CLINICIAN', 'ADMIN']));

doctorBffRouter.use('/appointments', appointmentRoutes);
doctorBffRouter.use('/scans', scanRoutes);
doctorBffRouter.use('/doctors', doctorRoutes);

export default doctorBffRouter;
