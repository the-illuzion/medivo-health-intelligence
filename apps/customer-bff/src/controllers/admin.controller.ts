import { Request, Response, NextFunction } from 'express';
import { auditService } from '../services/audit.service.js';

export const getHipaaAuditLogs = (_req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = auditService.getLogs();
    res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
};

export const getTelemetryStats = (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: {
        totalScans: 14892,
        activeUsers: 8410,
        completedConsultations: 1240,
        mrr: 184500,
        nodes: [
          { name: 'Customer BFF API', port: 4000, status: '100% ONLINE' },
          { name: 'AI Vision Inference Engine', type: 'PyTorch', status: 'OPERATIONAL' },
          { name: 'PostgreSQL Database', type: '13 Schema Monolith', status: 'HEALTHY' },
        ],
      },
    });
  } catch (err) {
    next(err);
  }
};
