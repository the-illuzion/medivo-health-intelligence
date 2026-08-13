import { Router } from 'express';
import { getHipaaAuditLogs, getTelemetryStats } from '../controllers/admin.controller.js';

const router = Router();

router.get('/hipaa-audit', getHipaaAuditLogs);
router.get('/telemetry-stats', getTelemetryStats);

export default router;
