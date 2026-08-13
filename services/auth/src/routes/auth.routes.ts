import { Router } from 'express';
import { issueToken, verifyToken } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { issueTokenSchema, verifyTokenSchema } from '../schemas/auth.schemas.js';

const router = Router();

router.post('/issue-token', validateRequest(issueTokenSchema), issueToken);
router.post('/verify-token', validateRequest(verifyTokenSchema), verifyToken);

export default router;
