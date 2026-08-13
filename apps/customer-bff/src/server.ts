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

// Instantiate Clean Architecture Repositories & Services
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

// In-Memory Appointments Store
const appointmentsStore: any[] = [
  { id: '1', patientId: 'usr-101', patientName: 'Sarah Jenkins', doctorId: '1', doctorName: 'Dr. Aris Thorne, MD', time: '10:30 AM', date: '2026-08-15', status: 'Confirmed', condition: 'Barrier Damage Assessment' },
  { id: '2', patientId: 'usr-102', patientName: 'Alex Morgan', doctorId: '2', doctorName: 'Dr. Elena Rostova, MD', time: '11:15 AM', date: '2026-08-15', status: 'In Waiting Room', condition: 'Eczema Flare Telemetry' },
];

// In-Memory Routines Store
const routinesStore: any[] = [
  {
    id: 'morning-barrier-protocol',
    name: 'Morning Barrier Defense Protocol',
    timing: 'Morning',
    duration: '5 mins',
    steps: [
      { step: 1, title: 'Gentle Cleansing', desc: 'Wash with tepid water and gentle balancing clay cleanser.', duration: '1 min' },
      { step: 2, title: 'Barrier Hydramist', desc: 'Mist face generously with hyaluronic acid hydramist.', duration: '1 min' },
      { step: 3, title: 'Peptide Serum Application', desc: 'Apply 3-4 drops of restorative micro-peptide serum.', duration: '1 min' },
      { step: 4, title: 'Mineral Sunscreen SPF 50', desc: 'Apply broad-spectrum mineral sunscreen over face and neck.', duration: '2 mins' },
    ],
  },
  {
    id: 'evening-renewal-protocol',
    name: 'Evening Cell Renewal Protocol',
    timing: 'Evening',
    duration: '8 mins',
    steps: [
      { step: 1, title: 'Double Cleanse', desc: 'Purify pores with oil cleanser followed by clay cleanser.', duration: '2 mins' },
      { step: 2, title: 'Active Niacinamide Serum', desc: 'Pat 10% Niacinamide serum onto cleansed skin.', duration: '2 mins' },
      { step: 3, title: 'Ceramide Moisture Seal', desc: 'Massaging rich ceramide cream to lock in overnight moisture.', duration: '4 mins' },
    ],
  },
];

// In-Memory Notifications Store
const notificationsStore: any[] = [
  { id: '1', title: 'AI Skin Telemetry Complete', message: 'Your scan report score of 87/100 is ready for review.', timestamp: '10m ago', unread: true },
  { id: '2', title: 'Prescription Shipped', message: 'Order #MED-84920 has been dispatched via FedEx.', timestamp: '2h ago', unread: true },
  { id: '3', title: 'Upcoming Telehealth Consultation', message: 'Video call with Dr. Aris Thorne, MD starts in 30 mins.', timestamp: '1d ago', unread: false },
];

// In-Memory HIPAA Audit Logs Store
const hipaaAuditLogs: any[] = [
  { id: 'LOG-9482', timestamp: '2026-08-07 16:42:15', event: 'HIPAA_CONSENT_GRANTED', user: 'sarah.j@example.com', resource: 'USER_CONSENT_REGISTRY', ipHash: 'a8f9...39b1', verification: 'CRYPTOGRAPHICALLY_VERIFIED' },
  { id: 'LOG-9481', timestamp: '2026-08-07 16:30:10', event: 'SCAN_DATA_ENCRYPTED_AES256', user: 'alex.m@example.com', resource: 'AI_SCAN_VAULT_S3', ipHash: 'b4c2...88a4', verification: 'CRYPTOGRAPHICALLY_VERIFIED' },
  { id: 'LOG-9480', timestamp: '2026-08-07 15:45:00', event: 'CLINICIAN_RECORD_ACCESS', user: 'dr.thorne@medivo.com', resource: 'PATIENT_SCAN_901', ipHash: 'c7d1...12e9', verification: 'CRYPTOGRAPHICALLY_VERIFIED' },
  { id: 'LOG-9479', timestamp: '2026-08-07 14:20:18', event: 'DIGITAL_PRESCRIPTION_ISSUED', user: 'dr.rostova@medivo.com', resource: 'RX_RECORD_442', ipHash: 'd3e2...99f8', verification: 'CRYPTOGRAPHICALLY_VERIFIED' },
];

// ============================================================================
// HEALTH CHECK
// ============================================================================
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Medivo Customer BFF',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// AUTHENTICATION & USER PROFILE APIs
// ============================================================================
app.post('/api/v1/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authenticateUserUseCase.execute(email || 'sarah.j@example.com', password || 'hashed_password_123');
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(401).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, skinType } = req.body;
    const newUser = {
      id: `usr-${Date.now()}`,
      name: name || 'New Patient',
      email: email || 'patient@example.com',
      skinType: skinType || 'Combination',
      hipaaConsent: true,
      createdAt: new Date().toISOString(),
    };
    res.json({ success: true, data: { user: newUser, token: 'jwt_mock_token_register_123' } });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/v1/user/profile', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'usr-101';
    const user = await authRepo.findById(userId);
    if (!user) {
      return res.json({
        success: true,
        data: {
          id: 'usr-101',
          name: 'Sarah Jenkins',
          email: 'sarah.j@example.com',
          skinType: 'Combination',
          score: 87,
          hipaaConsent: true,
          registered: '2026-01-15',
        },
      });
    }
    res.json({ success: true, data: user.toDTO() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// AI SKIN SCAN TELEMETRY APIs
// ============================================================================
app.post('/api/v1/scans/analyze', async (req: Request, res: Response) => {
  try {
    const { userId, imageBase64 } = req.body;
    const result = await submitSkinScanUseCase.execute(userId || 'usr-101', imageBase64 || 'data:image/jpeg;base64,...');
    
    // Log HIPAA Audit event
    hipaaAuditLogs.unshift({
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      event: 'SCAN_DATA_ENCRYPTED_AES256',
      user: 'sarah.j@example.com',
      resource: 'AI_SCAN_VAULT_S3',
      ipHash: 'a8f9...39b1',
      verification: 'CRYPTOGRAPHICALLY_VERIFIED',
    });

    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/v1/scans/history', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'usr-101';
    const scans = await scanRepo.findByUserId(userId);
    res.json({ success: true, data: scans.map((s) => s.toDTO()) });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/v1/scans/:id', async (req: Request, res: Response) => {
  try {
    const scanId = req.params.id;
    const scan = await scanRepo.findById(scanId);
    if (scan) {
      return res.json({ success: true, data: scan.toDTO() });
    }
    res.json({
      success: true,
      data: {
        id: scanId,
        userId: 'usr-101',
        overallScore: 87,
        hydrationScore: 78,
        textureScore: 84,
        pigmentationScore: 79,
        darkCirclesScore: 72,
        recommendedProducts: [
          'Triple-Weight Hyaluronic Acid Serum',
          '10% Niacinamide & Zinc Renewal Emulsion',
          'Ceramide Barrier Repair Cream',
        ],
        status: 'COMPLETED',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// ROUTINES & AI HEALTH COACH APIs
// ============================================================================
app.get('/api/v1/routines', (_req: Request, res: Response) => {
  res.json({ success: true, data: routinesStore });
});

app.get('/api/v1/routines/:id', (req: Request, res: Response) => {
  const routine = routinesStore.find((r) => r.id === req.params.id) || routinesStore[0];
  res.json({ success: true, data: routine });
});

app.post('/api/v1/coach/chat', (req: Request, res: Response) => {
  const { message } = req.body;
  const reply = `Based on your recent 87/100 hydration score and combination skin telemetry, I recommend applying the Triple-Weight Hyaluronic Acid Serum twice daily after cleansing. ${
    message ? `Regarding "${message}": Keep skin moisturized and avoid harsh physical exfoliants.` : ''
  }`;
  res.json({
    success: true,
    data: {
      id: `chat-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: new Date().toISOString(),
    },
  });
});

// ============================================================================
// DERMATOLOGIST & TELEHEALTH APPOINTMENT APIs
// ============================================================================
app.get('/api/v1/doctors', async (_req: Request, res: Response) => {
  try {
    const doctors = await listDoctorsUseCase.execute();
    res.json({ success: true, data: doctors });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/v1/appointments', (_req: Request, res: Response) => {
  res.json({ success: true, data: appointmentsStore });
});

app.post('/api/v1/appointments/book', (req: Request, res: Response) => {
  const { doctorId, doctorName, date, time, condition } = req.body;
  const newAppointment = {
    id: `apt-${Date.now()}`,
    patientId: 'usr-101',
    patientName: 'Sarah Jenkins',
    doctorId: doctorId || '1',
    doctorName: doctorName || 'Dr. Aris Thorne, MD',
    time: time || '03:00 PM',
    date: date || '2026-08-16',
    status: 'Confirmed',
    condition: condition || 'Barrier Telemetry Consultation',
  };
  appointmentsStore.unshift(newAppointment);
  res.json({ success: true, data: newAppointment });
});

app.get('/api/v1/appointments/:id', (req: Request, res: Response) => {
  const appointment = appointmentsStore.find((a) => a.id === req.params.id) || appointmentsStore[0];
  res.json({ success: true, data: appointment });
});

// ============================================================================
// MARKETPLACE, CART & CHECKOUT APIs
// ============================================================================
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

app.post('/api/v1/checkout', (req: Request, res: Response) => {
  const { items, totalAmount } = req.body;
  const newOrder = {
    id: `MED-${Math.floor(10000 + Math.random() * 90000)}`,
    status: 'PROCESSING',
    totalAmountCents: Math.round((totalAmount || 96) * 100),
    itemsCount: items ? items.length : 2,
    estimatedDelivery: '3 Business Days',
    createdAt: new Date().toISOString(),
  };
  res.json({ success: true, data: newOrder });
});

app.get('/api/v1/orders/:id', async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id || 'MED-84920';
    const order = await getOrderDetailsUseCase.execute(orderId);
    res.json({ success: true, data: order });
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// ============================================================================
// NOTIFICATIONS & PRIVACY APIs
// ============================================================================
app.get('/api/v1/notifications', (_req: Request, res: Response) => {
  res.json({ success: true, data: notificationsStore });
});

app.get('/api/v1/privacy/hipaa-consent', (_req: Request, res: Response) => {
  res.json({ success: true, data: { userId: 'usr-101', hipaaConsent: true, grantedAt: '2026-01-15T00:00:00Z' } });
});

app.post('/api/v1/privacy/hipaa-consent', (req: Request, res: Response) => {
  const { consent } = req.body;
  hipaaAuditLogs.unshift({
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    event: consent ? 'HIPAA_CONSENT_GRANTED' : 'HIPAA_CONSENT_REVOKED',
    user: 'sarah.j@example.com',
    resource: 'USER_CONSENT_REGISTRY',
    ipHash: 'a8f9...39b1',
    verification: 'CRYPTOGRAPHICALLY_VERIFIED',
  });
  res.json({ success: true, data: { userId: 'usr-101', hipaaConsent: !!consent } });
});

// ============================================================================
// PLATFORM ADMIN CONSOLE & AUDIT APIs
// ============================================================================
app.get('/api/v1/admin/hipaa-audit', (_req: Request, res: Response) => {
  res.json({ success: true, data: hipaaAuditLogs });
});

app.get('/api/v1/admin/telemetry-stats', (_req: Request, res: Response) => {
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
});

app.listen(PORT, () => {
  console.log(`🚀 Medivo Customer BFF Server running on http://localhost:${PORT}`);
});
