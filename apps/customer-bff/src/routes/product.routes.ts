import { Router } from 'express';
import { listProducts } from '../controllers/product.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Protect product catalog endpoint with authentication
router.use(authenticateToken);

router.get('/', listProducts);

export default router;
