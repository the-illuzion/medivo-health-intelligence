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
      oiliness: Math.floor(50 + Math.random() * 25),
      texture: Math.floor(75 + Math.random() * 20),
      poreClarity: Math.floor(75 + Math.random() * 20),
      pigmentation: Math.floor(70 + Math.random() * 25),
      wrinkles: Math.floor(75 + Math.random() * 20),
      acneScore: Math.floor(80 + Math.random() * 18),
      darkCircles: Math.floor(65 + Math.random() * 30),
      eyeBags: Math.floor(70 + Math.random() * 25),
      rednessScore: Math.floor(8 + Math.random() * 15),
      firmness: Math.floor(75 + Math.random() * 20),
      radiance: Math.floor(75 + Math.random() * 20),
      skinAge: 26,
      skinType: 'Combination',
      barrierHealth: Math.floor(80 + Math.random() * 18),
    },

    recommendations: [
      'Incorporate Hyaluronic Serum twice daily',
      'Broad spectrum SPF 50 application',
    ],
    scannedAt: new Date(),
    ...overrides,
  });
}
