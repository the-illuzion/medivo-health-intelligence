import express, { Request, Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 4001;
const JWT_SECRET = process.env.JWT_SECRET || 'medivo-production-jwt-secret-key';

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Medivo Auth & Session Service',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/v1/auth/issue-token', (req: Request, res: Response) => {
  const { userId, role } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, error: 'userId is required' });
  }

  const token = jwt.sign(
    { sub: userId, role: role || 'PATIENT', iss: 'medivo-auth-service' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ success: true, data: { token, expiresInSeconds: 86400 } });
});

app.post('/api/v1/auth/verify-token', (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, error: 'token is required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, valid: true, data: decoded });
  } catch (err: any) {
    res.status(401).json({ success: false, valid: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🔐 Medivo Auth Service running on http://localhost:${PORT}`);
});
