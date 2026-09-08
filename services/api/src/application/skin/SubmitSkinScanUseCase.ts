import { SkinScan } from '../../domain/skin/SkinScanEntity.js';
import { ISkinScanRepository } from '../../domain/repositories/ISkinScanRepository.js';
import { SimulatedAIInferenceService } from '../../infrastructure/ai/SimulatedAIInferenceService.js';

export class SubmitSkinScanUseCase {
  constructor(
    private scanRepo: ISkinScanRepository,
    private aiService: SimulatedAIInferenceService
  ) {}

  async execute(userId: string, imageBase64: string, consentVersion: string = 'v1.0') {
    const aiResult = await this.aiService.processFaceScan(imageBase64);

    const scan = new SkinScan({
      id: `scn-${Date.now()}`,
      userId,
      overallScore: aiResult.overallScore,
      grade: aiResult.grade,
      metrics: aiResult.metrics,
      recommendations: aiResult.recommendations,
      riskLevel: aiResult.riskLevel,
      consentVersion,
      scannedAt: new Date(),
    });

    await this.scanRepo.save(scan);
    return scan.toDTO();
  }
}
