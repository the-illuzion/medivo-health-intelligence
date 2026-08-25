import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes.js';
import scanRoutes from './scan.routes.js';
import routineRoutes from './routine.routes.js';
import coachRoutes from './coach.routes.js';
import doctorRoutes from './doctor.routes.js';
import appointmentRoutes from './appointment.routes.js';
import productRoutes from './product.routes.js';
import orderRoutes from './order.routes.js';
import notificationRoutes from './notification.routes.js';
import privacyRoutes from './privacy.routes.js';
import adminRoutes from './admin.routes.js';
import { checkout } from '../controllers/order.controller.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { checkoutSchema } from '../schemas/dto.schemas.js';

const mobileBffRouter = Router();

// Mobile / Customer BFF Health Check
mobileBffRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Medivo Mobile Customer BFF',
    timestamp: new Date().toISOString(),
  });
});

// Authentication & Profile Endpoints
mobileBffRouter.use('/auth', authRoutes);
mobileBffRouter.use('/user', authRoutes);

// Protected Clinical & E-Commerce Endpoints
mobileBffRouter.use('/scans', scanRoutes);
mobileBffRouter.use('/routines', routineRoutes);
mobileBffRouter.use('/coach', coachRoutes);
mobileBffRouter.use('/doctors', doctorRoutes);
mobileBffRouter.use('/appointments', appointmentRoutes);
mobileBffRouter.use('/products', productRoutes);
mobileBffRouter.use('/orders', orderRoutes);
mobileBffRouter.use('/notifications', notificationRoutes);
mobileBffRouter.use('/privacy', privacyRoutes);
mobileBffRouter.use('/admin', adminRoutes);

// Protected Checkout
mobileBffRouter.post('/checkout', authenticateToken, validateRequest(checkoutSchema), checkout);

export default mobileBffRouter;
