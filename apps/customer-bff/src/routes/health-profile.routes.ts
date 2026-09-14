import { Router } from 'express';
import {
  getHealthProfile,
  updateHealthProfile,
  addMedication,
  addCareNetworkMember,
  addHealthRecord,
} from '../controllers/health-profile.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getHealthProfile);
router.put('/', authenticateToken, updateHealthProfile);
router.post('/medications', authenticateToken, addMedication);
router.post('/care-network', authenticateToken, addCareNetworkMember);
router.post('/records', authenticateToken, addHealthRecord);

export default router;
