import type { NextFunction, Response } from 'express';
import {
  DisconnectHealthConnectionUseCase,
  GetHealthConnectionUseCase,
  GetHealthSummaryUseCase,
  HealthSyncBatchTooLargeError,
  InvalidHealthSampleError,
  PostgresHealthRepository,
  SyncHealthDataUseCase,
} from '@medivo/service-api';
import type { HealthSummaryPeriod } from '@medivo/service-api';
import type { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { healthSyncSchema } from '../schemas/health.schemas.js';

const healthRepository = new PostgresHealthRepository();
const syncHealthDataUseCase = new SyncHealthDataUseCase(healthRepository);
const getHealthConnectionUseCase = new GetHealthConnectionUseCase(healthRepository);
const disconnectHealthConnectionUseCase = new DisconnectHealthConnectionUseCase(healthRepository);
const getHealthSummaryUseCase = new GetHealthSummaryUseCase(healthRepository);
const HEALTH_SUMMARY_PERIODS: readonly HealthSummaryPeriod[] = ['day', 'week', 'month'];

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

export async function getAppleHealthSummary(
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

    const periodValue = typeof req.query.period === 'string' ? req.query.period : 'day';
    if (!HEALTH_SUMMARY_PERIODS.includes(periodValue as HealthSummaryPeriod)) {
      res.status(400).json({ success: false, error: 'period must be day, week, or month' });
      return;
    }

    const timezoneOffsetValue =
      typeof req.query.timezoneOffsetMinutes === 'string' ? req.query.timezoneOffsetMinutes : '0';
    const timezoneOffsetMinutes = Number(timezoneOffsetValue);
    if (!Number.isFinite(timezoneOffsetMinutes)) {
      res.status(400).json({ success: false, error: 'timezoneOffsetMinutes must be numeric' });
      return;
    }

    const summary = await getHealthSummaryUseCase.execute(
      userId,
      'apple_health',
      periodValue as HealthSummaryPeriod,
      timezoneOffsetMinutes,
    );
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid timezone offset.') {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    next(error);
  }
}

export async function disconnectAppleHealthConnection(
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

    await disconnectHealthConnectionUseCase.execute(userId, 'apple_health');
    res.status(200).json({ success: true, data: { disconnected: true } });
  } catch (error) {
    next(error);
  }
}
