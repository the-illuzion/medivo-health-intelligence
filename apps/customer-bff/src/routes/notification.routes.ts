import { Router } from 'express';
import { listNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', listNotifications);
router.put('/:id/read', markAsRead);
router.post('/mark-all-read', markAllAsRead);

export default router;
