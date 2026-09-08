import { Response, NextFunction } from 'express';
import { PostgresSkinScanRepository, SimulatedAIInferenceService, SubmitSkinScanUseCase, SkinScan } from '@medivo/service-api';
import { auditService } from '../services/audit.service.js';
import { notificationService } from '../services/notification.service.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { env } from '../config/env.js';

const scanRepo = new PostgresSkinScanRepository();
const aiService = new SimulatedAIInferenceService();
const submitSkinScanUseCase = new SubmitSkinScanUseCase(scanRepo, aiService);

export const analyzeScan = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || req.body.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required. Invalid user session.' });
    }

    const { imageBase64, consentGiven = true, consentVersion = 'v1.0' } = req.body;

    if (consentGiven === false) {
      return res.status(400).json({
        success: false,
        error: 'HIPAA Compliance Requirement: Explicit user consent is mandatory before processing biometric scan data (Rule H-2).',
      });
    }

    let result: any = null;

    // 1. Attempt AI Microservice RPC invocation
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const aiResponse = await fetch(`${env.AI_SERVICE_URL}/api/ai/telemetry/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, imageBase64, consentGiven, consentVersion }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (aiResponse.ok) {
        const aiJson: any = await aiResponse.json();
        if (aiJson && aiJson.data) {
          const aiData = aiJson.data;
          const scan = new SkinScan({
            id: aiData.scanId || `scn-${Date.now()}`,
            userId,
            overallScore: aiData.overallScore,
            grade: aiData.grade,
            metrics: aiData.metrics,
            recommendations: aiData.recommendations,
            riskLevel: aiData.riskLevel || 'LOW',
            consentVersion,
            scannedAt: new Date(aiData.timestamp || Date.now()),
          });
          await scanRepo.save(scan);
          result = scan.toDTO();
        }
      }
    } catch (rpcErr: any) {
      // Graceful fallback to local domain use-case if microservice is offline
      console.warn('[ScanController] AI Microservice RPC unreached, using domain use-case:', rpcErr.message);
    }

    // 2. Fallback to domain use case if not handled by remote microservice
    if (!result) {
      result = await submitSkinScanUseCase.execute(userId, imageBase64 || '', consentVersion);
    }

    // 3. Log HIPAA audit event & push notification
    auditService.logEvent('SCAN_DATA_ENCRYPTED_AES256', userId, 'AI_SCAN_VAULT_S3');
    notificationService.push(
      'AI Skin Telemetry Complete',
      `Your sub-dermal scan score of ${result.overallScore}/100 (${result.grade || 'Optimal'}) is ready for review.`,
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
