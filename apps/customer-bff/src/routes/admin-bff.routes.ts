import { Router } from 'express';
import { getHipaaAuditLogs, getTelemetryStats } from '../controllers/admin.controller.js';
import { listDoctors } from '../controllers/doctor.controller.js';
import { listProducts } from '../controllers/product.controller.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const adminBffRouter = Router();

// Admin BFF Health Check
adminBffRouter.get('/health', (_req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Medivo Admin BFF',
    timestamp: new Date().toISOString(),
  });
});

// Protect Admin BFF routes
adminBffRouter.use(authenticateToken);
adminBffRouter.use(requireRole(['ADMIN', 'CLINICIAN']));

adminBffRouter.get('/hipaa-audit', getHipaaAuditLogs);
adminBffRouter.get('/telemetry-stats', getTelemetryStats);
adminBffRouter.get('/doctors', listDoctors);
adminBffRouter.get('/products', listProducts);

export default adminBffRouter;
