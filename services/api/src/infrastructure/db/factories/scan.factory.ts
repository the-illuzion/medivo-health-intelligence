import { SkinScan, SkinScanProps } from '../../../domain/skin/SkinScanEntity.js';

export function buildSkinScanFactory(overrides?: Partial<SkinScanProps>): SkinScan {
  const id = `scn-${Math.floor(1000 + Math.random() * 9000)}`;
  const overallScore = Math.floor(70 + Math.random() * 25);
  return new SkinScan({
    id,
    userId: 'usr-101',
    overallScore,
    metrics: {
      hydration: Math.floor(70 + Math.random() * 25),
      texture: Math.floor(75 + Math.random() * 20),
      pigmentation: Math.floor(70 + Math.random() * 25),
      darkCircles: Math.floor(65 + Math.random() * 30),
    },
    recommendations: [
      'Incorporate Hyaluronic Serum twice daily',
      'Broad spectrum SPF 50 application',
    ],
    scannedAt: new Date(),
    ...overrides,
  });
}
