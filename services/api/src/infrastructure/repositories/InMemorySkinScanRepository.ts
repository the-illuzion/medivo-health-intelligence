import { SkinScan } from '../../domain/skin/SkinScanEntity.js';
import { ISkinScanRepository } from '../../domain/repositories/ISkinScanRepository.js';

export class InMemorySkinScanRepository implements ISkinScanRepository {
  private scans: SkinScan[] = [];

  constructor() {
    // Seed initial scans for Sarah Jenkins
    this.scans.push(
      new SkinScan({
        id: 'scn-901',
        userId: 'usr-101',
        overallScore: 87,
        grade: 'Optimal Grade',
        metrics: {
          hydration: 76,
          oiliness: 58,
          texture: 84,
          poreClarity: 85,
          pigmentation: 79,
          wrinkles: 86,
          acneScore: 92,
          darkCircles: 72,
          eyeBags: 78,
          rednessScore: 12,
          firmness: 85,
          radiance: 86,
          skinAge: 26,
          skinType: 'Combination',
          barrierHealth: 92,
        },
        recommendations: [
          'Incorporate Hyaluronic Serum twice daily',
          'Daily SPF 50 Application',
          'Hydra-Gel Eye Contour for periorbital circles',
        ],
        riskLevel: 'LOW',
        consentVersion: 'v1.0',
        scannedAt: new Date('2026-07-28T09:15:00Z'),
      }),
      new SkinScan({
        id: 'scn-900',
        userId: 'usr-101',
        overallScore: 83,
        grade: 'Good Condition',
        metrics: {
          hydration: 70,
          oiliness: 55,
          texture: 82,
          poreClarity: 82,
          pigmentation: 76,
          wrinkles: 84,
          acneScore: 90,
          darkCircles: 71,
          eyeBags: 75,
          rednessScore: 14,
          firmness: 82,
          radiance: 84,
          skinAge: 27,
          skinType: 'Combination',
          barrierHealth: 88,
        },

        recommendations: [
          'Increase water intake and apply barrier cream',
        ],
        riskLevel: 'LOW',
        consentVersion: 'v1.0',
        scannedAt: new Date('2026-07-21T08:30:00Z'),
      })
    );
  }

  async save(scan: SkinScan): Promise<void> {
    this.scans.unshift(scan);
  }

  async findById(id: string): Promise<SkinScan | null> {
    const scan = this.scans.find((s) => s.id === id);
    return scan || null;
  }

  async findByUserId(userId: string): Promise<SkinScan[]> {
    return this.scans.filter((s) => s.userId === userId);
  }

  async findLatestByUserId(userId: string): Promise<SkinScan | null> {
    const userScans = await this.findByUserId(userId);
    return userScans.length > 0 ? userScans[0] : null;
  }
}
