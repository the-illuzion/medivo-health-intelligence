import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SubDermalTelemetryEngine } from '../domain/SubDermalTelemetryEngine.js';
import { PerfectCorpAdapter } from '../providers/PerfectCorpAdapter.js';
import { ShenAIAdapter } from '../providers/ShenAIAdapter.js';
import { UnifiedAIAdapter } from '../providers/UnifiedAIAdapter.js';
import { env } from '../config/env.js';

function createValidTestImageBase64(): string {
  const buf = Buffer.alloc(1200);
  for (let i = 0; i < buf.length; i += 3) {
    buf[i] = 160 + (i % 30); // R
    buf[i + 1] = 120 + ((i * 2) % 25); // G
    buf[i + 2] = 100 + ((i * 3) % 20); // B
  }
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

function createDarkTestImageBase64(): string {
  const buf = Buffer.alloc(1200, 10);
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

function createBlankTestImageBase64(): string {
  const buf = Buffer.alloc(1200, 128);
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

function createOverExposedTestImageBase64(): string {
  const buf = Buffer.alloc(1200, 250);
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

describe('SubDermalTelemetryEngine', () => {
  it('should compute valid hydration, texture, and overall score from real base64 payload', () => {
    const validImage = createValidTestImageBase64();
    const metrics = SubDermalTelemetryEngine.analyzeImagePayload(validImage);

    expect(metrics.hydration).toBeGreaterThanOrEqual(50);
    expect(metrics.texture).toBeGreaterThanOrEqual(50);
    expect(metrics.overallScore).toBeGreaterThanOrEqual(50);
    expect(metrics.poreClarity).toBeDefined();
    expect(metrics.barrierHealth).toBeDefined();
    expect(metrics.skinAge).toBeDefined();
  });

  it('should reject dark or under-exposed frames with descriptive error', () => {
    const darkImage = createDarkTestImageBase64();
    expect(() => SubDermalTelemetryEngine.analyzeImagePayload(darkImage)).toThrow('Image is too dark or under-exposed');
  });

  it('should reject blank or monochromatic frames with descriptive error', () => {
    const blankImage = createBlankTestImageBase64();
    expect(() => SubDermalTelemetryEngine.analyzeImagePayload(blankImage)).toThrow('Blank or uniform frame detected');
  });

  it('should reject severely over-exposed frames with descriptive error', () => {
    const overExposed = createOverExposedTestImageBase64();
    expect(() => SubDermalTelemetryEngine.analyzeImagePayload(overExposed)).toThrow('Image is severely over-exposed');
  });
});

describe('Third-Party API Adapters', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    env.PERFECT_CORP_API_KEY = undefined;
    env.PERFECT_CORP_SECRET_KEY = undefined;
    env.SHEN_API_KEY = undefined;
    env.SHEN_CLIENT_SECRET = undefined;
  });

  it('PerfectCorpAdapter should throw error when credentials are not configured', async () => {
    const adapter = new PerfectCorpAdapter();
    expect(adapter.isConfigured()).toBe(false);
    await expect(adapter.analyzeImage('base64payload')).rejects.toThrow('Third-party API credentials');
  });

  it('PerfectCorpAdapter should parse live external API response dynamically when configured', async () => {
    env.PERFECT_CORP_API_KEY = 'test_key';
    env.PERFECT_CORP_SECRET_KEY = 'test_secret';

    const mockApiResponse = {
      data: {
        hydration: 91,
        oiliness: 42,
        texture: 89,
        pores: 87,
        spots: 93,
        wrinkles: 90,
        acne: 95,
        dark_circles: 81,
        eye_bags: 84,
        redness: 9,
        firmness: 88,
        radiance: 92,
        skin_age: 24,
        skin_type: 'Normal',
        barrier_health: 94,
        heart_rate: 68,
        stress_index: 12,
      },
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockApiResponse,
    } as any);

    const adapter = new PerfectCorpAdapter();
    expect(adapter.isConfigured()).toBe(true);

    const result = await adapter.analyzeImage('test-image-data');
    expect(result.metrics.hydration).toBe(91);
    expect(result.metrics.oiliness).toBe(42);
    expect(result.metrics.texture).toBe(89);
    expect(result.metrics.skinAge).toBe(24);
    expect(result.metrics.skinType).toBe('Normal');
    expect(result.metrics.heartRate).toBe(68);
    expect(result.overallScore).toBeGreaterThanOrEqual(80);
  });

  it('ShenAIAdapter should throw error when credentials are not configured', async () => {
    const adapter = new ShenAIAdapter();
    expect(adapter.isConfigured()).toBe(false);
    await expect(adapter.analyzeImage('base64payload')).rejects.toThrow('Third-party rPPG API credentials');
  });

  it('ShenAIAdapter should parse live external rPPG vitals response dynamically when configured', async () => {
    env.SHEN_API_KEY = 'shen_key_123';
    env.SHEN_CLIENT_SECRET = 'shen_secret_456';

    const mockShenResponse = {
      data: {
        bpm: 66,
        stressIndex: 14,
        hydration: 86,
        oiliness: 50,
        texture: 88,
        poreClarity: 86,
        pigmentation: 90,
        wrinkles: 87,
        acne: 92,
        darkCircles: 80,
        eyeBags: 82,
        redness: 11,
        firmness: 85,
        skinAge: 25,
        skinType: 'Normal',
        barrierHealth: 90,
      },
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockShenResponse,
    } as any);

    const adapter = new ShenAIAdapter();
    expect(adapter.isConfigured()).toBe(true);

    const result = await adapter.analyzeImage('test-image-data');
    expect(result.metrics.heartRate).toBe(66);
    expect(result.metrics.stressIndex).toBe(14);
    expect(result.metrics.hydration).toBe(86);
    expect(result.metrics.skinAge).toBe(25);
  });

  it('UnifiedAIAdapter should orchestrate external providers when configured', async () => {
    env.PERFECT_CORP_API_KEY = 'test_key';
    env.PERFECT_CORP_SECRET_KEY = 'test_secret';
    env.SHEN_API_KEY = 'shen_key';
    env.SHEN_CLIENT_SECRET = 'shen_secret';

    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('perfectcorp')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            data: { hydration: 88, texture: 84, skin_age: 26, skin_type: 'Combination', barrier_health: 89 },
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          data: { bpm: 70, stressIndex: 16 },
        }),
      });
    });

    const unified = new UnifiedAIAdapter();
    const result = await unified.analyzeImage('test-image');
    expect(result.metrics.hydration).toBe(88);
    expect(result.metrics.heartRate).toBe(70);
    expect(result.metrics.stressIndex).toBe(16);
  });
});

