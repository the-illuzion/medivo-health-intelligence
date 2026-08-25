import { Router } from 'express';
import { getHipaaAuditLogs, getTelemetryStats } from '../controllers/admin.controller.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Strictly protect all administrative telemetry and audit endpoints
router.use(authenticateToken);
router.use(requireRole(['ADMIN', 'CLINICIAN']));

router.get('/hipaa-audit', getHipaaAuditLogs);
router.get('/telemetry-stats', getTelemetryStats);

export default router;
