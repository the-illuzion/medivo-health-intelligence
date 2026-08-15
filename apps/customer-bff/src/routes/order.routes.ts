import { Router } from 'express';
import { getOrderDetails } from '../controllers/order.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/:id', getOrderDetails);

export default router;
