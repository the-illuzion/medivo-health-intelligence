import { Response, NextFunction } from 'express';
import { deviceService } from '../services/device.service.js';
import { vitalsService } from '../services/vitals.service.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const listDevices = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const devices = deviceService.getDevices(userId);
    res.json({ success: true, data: devices });
  } catch (err) {
    next(err);
  }
};

export const connectDevice = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const { name, deviceName, kind, sharingScopes } = req.body;
    const finalName = name || deviceName || 'Wearable Device';
    const devices = deviceService.connectDevice(userId, finalName, kind, sharingScopes);
    vitalsService.recordDeviceSync(userId, finalName);
    res.json({ success: true, data: devices });
  } catch (err) {
    next(err);
  }
};

export const toggleDeviceSync = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr-101';
    const { deviceId, isEnabled } = req.body;
    const targetId = deviceId || req.params.id;
    const devices = deviceService.toggleDeviceSync(userId, targetId, isEnabled);
    res.json({ success: true, data: devices });
  } catch (err) {
    next(err);
  }
};
