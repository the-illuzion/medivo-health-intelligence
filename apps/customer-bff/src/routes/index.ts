import { Router } from 'express';
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

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/user', authRoutes);
apiRouter.use('/scans', scanRoutes);
apiRouter.use('/routines', routineRoutes);
apiRouter.use('/coach', coachRoutes);
apiRouter.use('/doctors', doctorRoutes);
apiRouter.use('/appointments', appointmentRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/', orderRoutes); // Support POST /api/v1/checkout directly
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/privacy', privacyRoutes);
apiRouter.use('/admin', adminRoutes);

export default apiRouter;
