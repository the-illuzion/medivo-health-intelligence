import { Router } from 'express';
import { checkout, getOrderDetails } from '../controllers/order.controller.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { checkoutSchema } from '../schemas/dto.schemas.js';

const router = Router();

router.post('/checkout', validateRequest(checkoutSchema), checkout);
router.get('/:id', getOrderDetails);

export default router;
