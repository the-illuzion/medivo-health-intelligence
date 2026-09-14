import { describe, it, expect } from 'vitest';
import { SubmitSkinScanUseCase } from '../skin/SubmitSkinScanUseCase.js';
import { InMemorySkinScanRepository } from '../../infrastructure/repositories/InMemorySkinScanRepository.js';
import { SimulatedAIInferenceService } from '../../infrastructure/ai/SimulatedAIInferenceService.js';

function createValidTestImageBase64(): string {
  const buf = Buffer.alloc(1200);
  for (let i = 0; i < buf.length; i += 3) {
    buf[i] = 160 + (i % 30); // R channel
    buf[i + 1] = 120 + ((i * 2) % 25); // G channel
    buf[i + 2] = 100 + ((i * 3) % 20); // B channel
  }
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

function createDarkTestImageBase64(): string {
  const buf = Buffer.alloc(1200, 12);
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

function createBlankTestImageBase64(): string {
  const buf = Buffer.alloc(1200, 128);
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

describe('SubmitSkinScanUseCase', () => {
  const scanRepo = new InMemorySkinScanRepository();
  const aiService = new SimulatedAIInferenceService();
  const useCase = new SubmitSkinScanUseCase(scanRepo, aiService);

  it('should process face scan image payload and persist scan entity', async () => {
    const validImage = createValidTestImageBase64();
    const result = await useCase.execute('usr-101', validImage);

    expect(result.id).toBeDefined();
    expect(result.userId).toBe('usr-101');
    expect(result.overallScore).toBeGreaterThanOrEqual(60);
    expect(result.metrics.hydration).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('should reject dark or under-exposed frames with descriptive error', async () => {
    const darkImage = createDarkTestImageBase64();
    await expect(useCase.execute('usr-101', darkImage)).rejects.toThrow('Image is too dark or under-exposed');
  });

  it('should reject blank or monochromatic frames with descriptive error', async () => {
    const blankImage = createBlankTestImageBase64();
    await expect(useCase.execute('usr-101', blankImage)).rejects.toThrow('Blank or uniform frame detected');
  });
});
