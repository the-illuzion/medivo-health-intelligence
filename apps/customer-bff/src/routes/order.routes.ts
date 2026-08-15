import { Router } from 'express';
import { checkout, getOrderDetails } from '../controllers/order.controller.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { checkoutSchema } from '../schemas/dto.schemas.js';

const router = Router();

router.use(authenticateToken);

router.post('/checkout', validateRequest(checkoutSchema), checkout);
router.get('/orders/:id', getOrderDetails);
router.get('/:id', getOrderDetails);

export default router;
