import express, { Request, Response } from 'express';
import cors from 'cors';
import { SubDermalTelemetryEngine } from './domain/SubDermalTelemetryEngine.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Medivo AI Vision Engine Service',
    engine: 'PyTorch / ONNX WebAssembly Pipeline',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/v1/ai/analyze', (req: Request, res: Response) => {
  try {
    const { imageBase64, userId } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'imageBase64 skin scan payload required' });
    }

    const metrics = SubDermalTelemetryEngine.analyzeImagePayload(imageBase64);
    
    res.json({
      success: true,
      data: {
        scanId: `scn-${Date.now()}`,
        userId: userId || 'usr-101',
        ...metrics,
        recommendations: [
          'Incorporate Triple-Weight Hyaluronic Acid Serum twice daily',
          'Broad spectrum Mineral SPF 50 application',
          'Ceramide Moisture Cream for periorbital barrier recovery',
        ],
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 Medivo AI Vision Service running on http://localhost:${PORT}`);
});
