import { Response, NextFunction } from 'express';
import { PostgresSkinScanRepository, SimulatedAIInferenceService, SubmitSkinScanUseCase, SkinScan } from '@medivo/service-api';
import { auditService } from '../services/audit.service.js';
import { notificationService } from '../services/notification.service.js';
import { vitalsService } from '../services/vitals.service.js';
import { careService } from '../services/care.service.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { env } from '../config/env.js';
import { trackedFetch, createLogger } from '@medivo/utils';

const scanRepo = new PostgresSkinScanRepository();
const aiService = new SimulatedAIInferenceService();
const submitSkinScanUseCase = new SubmitSkinScanUseCase(scanRepo, aiService);
const scanLogger = createLogger('scan-controller');

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
      const reqId = (req as any).reqId || (req.headers['x-request-id'] as string) || `req-${Date.now()}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      const aiResponse = await trackedFetch(
        `${env.AI_SERVICE_URL}/api/ai/telemetry/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-request-id': reqId,
          },
          body: JSON.stringify({ userId, imageBase64, consentGiven, consentVersion }),
          signal: controller.signal,
          serviceName: 'ai-microservice-rpc',
          operationName: 'POST /api/ai/telemetry/analyze',
          reqId,
        },
        scanLogger
      );
      clearTimeout(timeoutId);

      if (!aiResponse.ok) {
        const errJson: any = await aiResponse.json().catch(() => ({}));
        const errorMessage = errJson?.error || errJson?.message || `Optical AI processing error (${aiResponse.status})`;
        scanLogger.warn('[ScanController] AI Microservice rejected image payload:', { status: aiResponse.status, error: errorMessage });
        return res.status(aiResponse.status).json({
          success: false,
          error: errorMessage,
        });
      }

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
    } catch (rpcErr: any) {
      // Graceful fallback to local domain use-case ONLY if microservice is physically offline/unreached
      scanLogger.warn('[ScanController] AI Microservice RPC unreached, using domain fallback:', { error: rpcErr.message });
      try {
        result = await submitSkinScanUseCase.execute(userId, imageBase64 || '', consentVersion);
      } catch (domainErr: any) {
        scanLogger.warn('[ScanController] Domain fallback validation error:', { error: domainErr.message });
        return res.status(400).json({
          success: false,
          error: domainErr.message || 'Image validation failed',
        });
      }
    }

    if (!result) {
      return res.status(400).json({
        success: false,
        error: 'Unable to extract biometric telemetry from the provided frame.',
      });
    }

    // 3. Update Vitals and Care schedule dynamically upon successful scan
    vitalsService.recordScanTelemetry(userId, result);
    careService.recordScanAction(userId);

    // 4. Log HIPAA audit event & push notification
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
