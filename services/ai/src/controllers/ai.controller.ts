import { Request, Response, NextFunction } from 'express';
import { TelemetryService } from '../services/TelemetryService.js';

const telemetryService = new TelemetryService();

export const analyzeSkin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, imageBase64, consentGiven = true, consentVersion = 'v1.0' } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }
    if (consentGiven === false) {
      return res.status(400).json({
        success: false,
        error: 'HIPAA Compliance Requirement: Explicit user consent is mandatory before processing biometric scan data (Rule H-2).',
      });
    }
    const result = await telemetryService.processScan(userId, imageBase64, consentVersion);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getScanHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId parameter is required' });
    }
    const history = await telemetryService.getHistory(userId);
    res.json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};
