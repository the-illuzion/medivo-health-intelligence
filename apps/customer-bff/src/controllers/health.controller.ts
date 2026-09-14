import type { NextFunction, Response } from 'express';
import {
  GetHealthConnectionUseCase,
  HealthSyncBatchTooLargeError,
  InvalidHealthSampleError,
  PostgresHealthRepository,
  SyncHealthDataUseCase,
} from '@medivo/service-api';
import type { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { healthSyncSchema } from '../schemas/health.schemas.js';

const healthRepository = new PostgresHealthRepository();
const syncHealthDataUseCase = new SyncHealthDataUseCase(healthRepository);
const getHealthConnectionUseCase = new GetHealthConnectionUseCase(healthRepository);

export async function syncHealthData(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const payload = healthSyncSchema.parse(req.body);
    const result = await syncHealthDataUseCase.execute(userId, payload);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof InvalidHealthSampleError || error instanceof HealthSyncBatchTooLargeError) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
}

export async function getAppleHealthConnection(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const connection = await getHealthConnectionUseCase.execute(userId, 'apple_health');
    res.status(200).json({ success: true, data: connection });
  } catch (error) {
    next(error);
  }
}
