import { Router } from 'express';
import { listNotifications } from '../controllers/notification.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', listNotifications);

export default router;
