import { describe, it, expect } from 'vitest';
import { SubmitSkinScanUseCase } from '../skin/SubmitSkinScanUseCase.js';
import { InMemorySkinScanRepository } from '../../infrastructure/repositories/InMemorySkinScanRepository.js';
import { SimulatedAIInferenceService } from '../../infrastructure/ai/SimulatedAIInferenceService.js';

describe('SubmitSkinScanUseCase', () => {
  const scanRepo = new InMemorySkinScanRepository();
  const aiService = new SimulatedAIInferenceService();
  const useCase = new SubmitSkinScanUseCase(scanRepo, aiService);

  it('should process face scan image payload and persist scan entity', async () => {
    const result = await useCase.execute('usr-101', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAE...');

    expect(result.id).toBeDefined();
    expect(result.userId).toBe('usr-101');
    expect(result.overallScore).toBeGreaterThanOrEqual(60);
    expect(result.metrics.hydration).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });
});
