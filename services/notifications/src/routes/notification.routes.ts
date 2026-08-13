import { Router } from 'express';
import { listNotifications, sendNotification } from '../controllers/notification.controller.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { sendNotificationSchema } from '../schemas/notification.schemas.js';

const router = Router();

router.get('/', listNotifications);
router.post('/send', validateRequest(sendNotificationSchema), sendNotification);

export default router;
