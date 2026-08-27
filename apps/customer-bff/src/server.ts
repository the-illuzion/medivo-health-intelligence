import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import mobileBffRouter from './routes/index.js';
import adminBffRouter from './routes/admin-bff.routes.js';
import doctorBffRouter from './routes/doctor-bff.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { DatabasePool } from '@medivo/service-api';

const app = express();
const PORT = env.PORT || 4000;

// Auto-initialize PostgreSQL 13 domain schemas on startup
DatabasePool.initializeSchemas().catch((err) => {
  console.warn('[Database Auto-Init]:', err.message);
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Internal Docker Container Healthcheck
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Medivo Unified BFF Gateway',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Standardized BFF Routes & Healthchecks
app.use('/api/mobile-bff', mobileBffRouter);
app.use('/api/admin-bff', adminBffRouter);
app.use('/api/doctor-bff', doctorBffRouter);

// Backwards-compatibility alias for v1 mobile clients
app.use('/api/v1', mobileBffRouter);

// Centralized Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Medivo BFF Gateway running on http://localhost:${PORT}`);
  console.log(`   ├─ Mobile BFF: http://localhost:${PORT}/api/mobile-bff (Health: /api/mobile-bff/health)`);
  console.log(`   ├─ Admin BFF:  http://localhost:${PORT}/api/admin-bff  (Health: /api/admin-bff/health)`);
  console.log(`   └─ Doctor BFF: http://localhost:${PORT}/api/doctor-bff (Health: /api/doctor-bff/health)`);
});
