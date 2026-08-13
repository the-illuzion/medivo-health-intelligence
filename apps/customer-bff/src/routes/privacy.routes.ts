import { Router } from 'express';
import { getHipaaConsent, updateHipaaConsent } from '../controllers/privacy.controller.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { hipaaConsentSchema } from '../schemas/dto.schemas.js';

const router = Router();

router.get('/hipaa-consent', getHipaaConsent);
router.post('/hipaa-consent', validateRequest(hipaaConsentSchema), updateHipaaConsent);

export default router;
