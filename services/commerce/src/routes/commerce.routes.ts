import { Router } from 'express';
import { listProducts, processCheckout } from '../controllers/commerce.controller.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { checkoutSchema } from '../schemas/commerce.schemas.js';

const router = Router();

router.get('/products', listProducts);
router.post('/checkout', validateRequest(checkoutSchema), processCheckout);

export default router;
