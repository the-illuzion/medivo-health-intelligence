import { describe, it, expect } from 'vitest';
import { SubDermalTelemetryEngine } from '../domain/SubDermalTelemetryEngine.js';

describe('SubDermalTelemetryEngine', () => {
  it('should compute valid hydration, texture, and overall score from base64 payload', () => {
    const mockBase64 = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const metrics = SubDermalTelemetryEngine.analyzeImagePayload(mockBase64);

    expect(metrics.hydration).toBeGreaterThanOrEqual(60);
    expect(metrics.texture).toBeGreaterThanOrEqual(60);
    expect(metrics.overallScore).toBeGreaterThanOrEqual(60);
  });
});
