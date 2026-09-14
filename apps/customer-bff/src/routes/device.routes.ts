import { Router } from 'express';
import { listDevices, connectDevice, toggleDeviceSync } from '../controllers/device.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, listDevices);
router.post('/connect', authenticateToken, connectDevice);
router.patch('/:id/toggle', authenticateToken, toggleDeviceSync);
router.post('/toggle', authenticateToken, toggleDeviceSync);

export default router;
