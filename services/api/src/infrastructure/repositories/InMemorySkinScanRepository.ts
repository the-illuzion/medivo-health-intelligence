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
        metrics: { hydration: 76, texture: 84, pigmentation: 79, darkCircles: 72 },
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
        metrics: { hydration: 70, texture: 82, pigmentation: 76, darkCircles: 71 },
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
