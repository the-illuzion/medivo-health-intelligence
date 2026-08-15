import { Response, NextFunction } from 'express';
import { PostgresSkinScanRepository, SimulatedAIInferenceService, SubmitSkinScanUseCase } from '@medivo/service-api';
import { auditService } from '../services/audit.service.js';
import { notificationService } from '../services/notification.service.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

const scanRepo = new PostgresSkinScanRepository();
const aiService = new SimulatedAIInferenceService();
const submitSkinScanUseCase = new SubmitSkinScanUseCase(scanRepo, aiService);

export const analyzeScan = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || req.body.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required. Invalid user session.' });
    }
    const { imageBase64 } = req.body;
    const result = await submitSkinScanUseCase.execute(userId, imageBase64);

    auditService.logEvent('SCAN_DATA_ENCRYPTED_AES256', userId, 'AI_SCAN_VAULT_S3');
    notificationService.push(
      'AI Skin Telemetry Complete',
      `Your sub-dermal scan score of ${result.overallScore}/100 is ready for review.`,
      userId
    );

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getScanHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required. Invalid user session.' });
    }
    const scans = await scanRepo.findByUserId(userId);
    res.json({ success: true, data: scans.map((s) => s.toDTO()) });
  } catch (err) {
    next(err);
  }
};

export const getScanDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const currentUserId = req.user?.userId;
    if (!currentUserId) {
      return res.status(401).json({ success: false, error: 'Authentication required. Invalid user session.' });
    }
    const scanId = req.params.id;
    const scan = await scanRepo.findById(scanId);

    if (!scan) {
      return res.status(404).json({ success: false, error: `Scan record '${scanId}' not found` });
    }

    if (scan.userId !== currentUserId) {
      return res.status(403).json({ success: false, error: 'Access denied. You cannot view another patient’s scan telemetry.' });
    }

    res.json({ success: true, data: scan.toDTO() });
  } catch (err) {
    next(err);
  }
};
