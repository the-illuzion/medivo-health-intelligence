import { Request, Response, NextFunction } from 'express';
import { auditService } from '../services/audit.service.js';

export const getHipaaConsent = (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: { userId: 'usr-101', hipaaConsent: true, grantedAt: '2026-01-15T00:00:00Z' },
    });
  } catch (err) {
    next(err);
  }
};

export const updateHipaaConsent = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { consent } = req.body;
    auditService.logEvent(
      consent ? 'HIPAA_CONSENT_GRANTED' : 'HIPAA_CONSENT_REVOKED',
      'sarah.j@example.com',
      'USER_CONSENT_REGISTRY'
    );
    res.json({ success: true, data: { userId: 'usr-101', hipaaConsent: !!consent } });
  } catch (err) {
    next(err);
  }
};
