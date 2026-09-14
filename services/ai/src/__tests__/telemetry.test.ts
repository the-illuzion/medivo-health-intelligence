import { describe, it, expect } from 'vitest';
import { SubDermalTelemetryEngine } from '../domain/SubDermalTelemetryEngine.js';

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

    expect(metrics.hydration).toBeGreaterThanOrEqual(60);
    expect(metrics.texture).toBeGreaterThanOrEqual(60);
    expect(metrics.overallScore).toBeGreaterThanOrEqual(60);
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
