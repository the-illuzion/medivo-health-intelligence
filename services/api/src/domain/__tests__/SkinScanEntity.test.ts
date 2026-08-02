import { describe, it, expect } from 'vitest';
import { SkinScan } from '../skin/SkinScanEntity.js';

describe('SkinScan Domain Entity', () => {
  it('should instantiate SkinScan entity with valid metrics and recommendations', () => {
    const scan = new SkinScan({
      id: 'scn-901',
      userId: 'usr-101',
      overallScore: 87,
      metrics: { hydration: 76, texture: 84, pigmentation: 79, darkCircles: 72 },
      recommendations: ['Incorporate Hyaluronic Serum', 'Apply SPF 50'],
      scannedAt: new Date('2026-07-28T09:15:00Z'),
    });

    expect(scan.overallScore).toBe(87);
    expect(scan.metrics.hydration).toBe(76);
    expect(scan.recommendations).toHaveLength(2);
    expect(scan.toDTO().scannedAt).toBe('2026-07-28T09:15:00.000Z');
  });
});
