import { SubDermalTelemetryEngine } from '../domain/SubDermalTelemetryEngine.js';
import { TelemetryAnalysisResult } from '../models/TelemetryMetrics.js';
import { SkinAnalysisRepository } from '../repositories/SkinAnalysisRepository.js';
import { env } from '../config/env.js';

export class TelemetryService {
  constructor(private scanRepo: SkinAnalysisRepository = new SkinAnalysisRepository()) {}

  public async processScan(userId: string, imageBase64: string): Promise<TelemetryAnalysisResult> {
    const metrics = SubDermalTelemetryEngine.analyzeImagePayload(imageBase64);
    const scanId = `scn-${Date.now()}`;

    const result: TelemetryAnalysisResult = {
      scanId,
      userId,
      overallScore: metrics.overallScore,
      metrics,
      recommendations: [
        'Incorporate Triple-Weight Hyaluronic Acid Serum twice daily',
        'Broad spectrum Mineral SPF 50 application',
        'Ceramide Moisture Cream for periorbital barrier recovery',
      ],
      modelVersion: env.MODEL_VERSION,
      timestamp: new Date().toISOString(),
    };

    await this.scanRepo.save(result);
    return result;
  }

  public async getHistory(userId: string): Promise<TelemetryAnalysisResult[]> {
    return this.scanRepo.findByUserId(userId);
  }
}
