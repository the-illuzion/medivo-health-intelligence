import express, { Request, Response } from 'express';
import cors from 'cors';
import {
  InMemoryAuthRepository,
  InMemorySkinScanRepository,
  InMemoryDoctorRepository,
  InMemoryOrderRepository,
  SimulatedAIInferenceService,
  JwtTokenService,
  AuthenticateUserUseCase,
  SubmitSkinScanUseCase,
  ListDoctorsUseCase,
  GetOrderDetailsUseCase,
} from '@medivo/service-api';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Instantiate Clean Architecture Services & Repositories
const authRepo = new InMemoryAuthRepository();
const scanRepo = new InMemorySkinScanRepository();
const doctorRepo = new InMemoryDoctorRepository();
const orderRepo = new InMemoryOrderRepository();
const aiService = new SimulatedAIInferenceService();
const jwtService = new JwtTokenService();

const authenticateUserUseCase = new AuthenticateUserUseCase(authRepo, jwtService);
const submitSkinScanUseCase = new SubmitSkinScanUseCase(scanRepo, aiService);
const listDoctorsUseCase = new ListDoctorsUseCase(doctorRepo);
const getOrderDetailsUseCase = new GetOrderDetailsUseCase(orderRepo);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Medivo Customer BFF',
    timestamp: new Date().toISOString(),
  });
});

// Authentication endpoint
app.post('/api/v1/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authenticateUserUseCase.execute(email || 'sarah.j@example.com', password || 'hashed_password_123');
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(401).json({ success: false, error: err.message });
  }
});

// AI Skin Scan Inference endpoint
app.post('/api/v1/scans/analyze', async (req: Request, res: Response) => {
  try {
    const { userId, imageBase64 } = req.body;
    const result = await submitSkinScanUseCase.execute(userId || 'usr-101', imageBase64 || 'data:image/jpeg;base64,...');
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Scan History endpoint
app.get('/api/v1/scans/history', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'usr-101';
    const scans = await scanRepo.findByUserId(userId);
    res.json({ success: true, data: scans.map((s) => s.toDTO()) });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Doctor Directory endpoint
app.get('/api/v1/doctors', async (_req: Request, res: Response) => {
  try {
    const doctors = await listDoctorsUseCase.execute();
    res.json({ success: true, data: doctors });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Order Tracking endpoint
app.get('/api/v1/orders/:id', async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id || 'MED-84920';
    const order = await getOrderDetailsUseCase.execute(orderId);
    res.json({ success: true, data: order });
  } catch (err: any) {
    res.status(440).json({ success: false, error: err.message });
  }
});

// Skincare Store Marketplace endpoint
app.get('/api/v1/products', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Balancing Clay Cleanser', category: 'Cleansers', price: 34, rating: 4.9, tag: 'AI Recommended' },
      { id: 2, name: 'Vitamin C Brightening Drops', category: 'Serums', price: 58, rating: 4.8, tag: 'Top Rated' },
      { id: 3, name: 'Hydra Renew Serum', category: 'Serums', price: 62, rating: 4.9, tag: 'Best for Hydration' },
      { id: 4, name: 'Mineral SPF 50 Shield', category: 'Sunscreen', price: 42, rating: 4.7, tag: 'Essential' },
      { id: 5, name: 'Ceramide Barrier Cream', category: 'Moisturizers', price: 46, rating: 4.9, tag: 'Restorative' },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Medivo Customer BFF Server running on http://localhost:${PORT}`);
});
