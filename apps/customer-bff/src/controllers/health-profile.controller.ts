import { Response, NextFunction } from 'express';
import { healthProfileService } from '../services/health-profile.service.js';
import { careService } from '../services/care.service.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getHealthProfile = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const email = req.user?.email;
    const name = email === 'test@yopmail.com' ? 'Alex Morgan' : undefined;
    const data = healthProfileService.getProfile(userId, { name, email });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateHealthProfile = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const data = healthProfileService.updateProfile(userId, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const addMedication = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const data = healthProfileService.addMedication(userId, req.body);
    careService.addMedicationTask(userId, req.body.name, req.body.dosage, req.body.frequency);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const addCareNetworkMember = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const data = healthProfileService.addCareMember(userId, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const addHealthRecord = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const data = healthProfileService.addHealthRecord(userId, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
