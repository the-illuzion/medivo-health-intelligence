import { SkinScan } from '../../domain/skin/SkinScanEntity.js';
import { ISkinScanRepository } from '../../domain/repositories/ISkinScanRepository.js';
import { SimulatedAIInferenceService } from '../../infrastructure/ai/SimulatedAIInferenceService.js';

export class SubmitSkinScanUseCase {
  constructor(
    private scanRepo: ISkinScanRepository,
    private aiService: SimulatedAIInferenceService
  ) {}

  async execute(userId: string, imageBase64: string) {
    const aiResult = await this.aiService.processFaceScan(imageBase64);

    const scan = new SkinScan({
      id: `scn-${Date.now()}`,
      userId,
      overallScore: aiResult.overallScore,
      metrics: aiResult.metrics,
      recommendations: aiResult.recommendations,
      scannedAt: new Date(),
    });

    await this.scanRepo.save(scan);
    return scan.toDTO();
  }
}
