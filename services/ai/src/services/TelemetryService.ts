import { AIProviderFactory } from '../providers/AIProviderFactory.js';
import { TelemetryAnalysisResult } from '../models/TelemetryMetrics.js';
import { SkinAnalysisRepository } from '../repositories/SkinAnalysisRepository.js';
import { env } from '../config/env.js';

export class TelemetryService {
  constructor(private scanRepo: SkinAnalysisRepository = new SkinAnalysisRepository()) {}

  public async processScan(userId: string, imageBase64: string): Promise<TelemetryAnalysisResult> {
    const provider = AIProviderFactory.getProvider();
    const providerResult = await provider.analyzeImage(imageBase64);

    const scanId = `scn-${Date.now()}`;

    const result: TelemetryAnalysisResult = {
      scanId,
      userId,
      overallScore: providerResult.overallScore,
      metrics: providerResult.metrics,
      recommendations: providerResult.recommendations,
      modelVersion: `${env.MODEL_VERSION} (${provider.name})`,
      timestamp: new Date().toISOString(),
    };

    await this.scanRepo.save(result);
    return result;
  }

  public async getHistory(userId: string): Promise<TelemetryAnalysisResult[]> {
    return this.scanRepo.findByUserId(userId);
  }
}
