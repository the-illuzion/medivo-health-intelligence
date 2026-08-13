import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import commerceRoutes from './routes/commerce.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = env.PORT || 4003;

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Medivo Skincare Commerce Service',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/commerce', commerceRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🛍️ Medivo Commerce Service running on http://localhost:${PORT}`);
});
