import { Response, NextFunction } from 'express';
import { auditService } from '../services/audit.service.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getHipaaConsent = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required. Invalid user session.' });
    }
    res.json({
      success: true,
      data: { userId, hipaaConsent: true, grantedAt: new Date().toISOString() },
    });
  } catch (err) {
    next(err);
  }
};

export const updateHipaaConsent = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required. Invalid user session.' });
    }
    const { consent } = req.body;
    auditService.logEvent(
      consent ? 'HIPAA_CONSENT_GRANTED' : 'HIPAA_CONSENT_REVOKED',
      userId,
      'USER_CONSENT_REGISTRY'
    );
    res.json({ success: true, data: { userId, hipaaConsent: !!consent } });
  } catch (err) {
    next(err);
  }
};
