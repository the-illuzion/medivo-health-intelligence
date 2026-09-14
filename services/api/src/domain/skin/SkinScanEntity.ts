export interface SkinMetrics {
  // 15 Core Clinical Skin Attributes
  hydration: number;         // 1. Stratum Corneum Hydration (0-100%)
  oiliness: number;          // 2. Oiliness / Sebum Balance (0-100%)
  texture: number;           // 3. Epidermal Micro-Texture & Smoothness (0-100)
  poreClarity: number;       // 4. Pore Clarity & Refinement (0-100%)
  pigmentation: number;      // 5. Melanin & Dark Spots Uniformity (0-100)
  wrinkles: number;          // 6. Fine Lines & Wrinkle Smoothness (0-100)
  acneScore: number;         // 7. Acne & Blemish Clarity (0-100)
  darkCircles: number;       // 8. Periorbital Dark Circles (0-100)
  eyeBags: number;           // 9. Under-Eye Bags & Puffiness (0-100)
  rednessScore: number;      // 10. Dermal Erythema & Redness (0-100%)
  firmness: number;          // 11. Dermal Elasticity & Firmness (0-100)
  radiance: number;          // 12. Radiance & Luminosity Index (0-100)
  skinAge: number;           // 13. Estimated Biological Skin Age (Years)
  skinType: string;          // 14. Skin Type ('Combination' | 'Oily' | 'Dry' | 'Normal' | 'Sensitive')
  barrierHealth: number;     // 15. Epidermal Barrier Integrity (0-100%)

  // Photoprotection & Vital Telemetry
  photoprotection?: string;
  heartRate?: number;
  stressIndex?: number;
  oilinessLevel?: string;
}

export interface SkinScanProps {
  id: string;
  userId: string;
  overallScore: number;
  grade?: string;
  metrics: SkinMetrics;
  recommendations: string[];
  riskLevel?: 'LOW' | 'MODERATE' | 'HIGH';
  consentVersion?: string;
  scannedAt: Date;
}

export class SkinScan {
  constructor(private props: SkinScanProps) {}

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get overallScore(): number { return this.props.overallScore; }
  get grade(): string {
    if (this.props.grade) return this.props.grade;
    if (this.props.overallScore >= 85) return 'Optimal Grade';
    if (this.props.overallScore >= 70) return 'Good Condition';
    if (this.props.overallScore >= 55) return 'Attention Advised';
    return 'Clinical Review Recommended';
  }
  get metrics(): SkinMetrics { return this.props.metrics; }
  get recommendations(): string[] { return this.props.recommendations; }
  get riskLevel(): 'LOW' | 'MODERATE' | 'HIGH' { return this.props.riskLevel || 'LOW'; }
  get consentVersion(): string { return this.props.consentVersion || 'v1.0'; }
  get scannedAt(): Date { return this.props.scannedAt; }

  toDTO() {
    const m = this.props.metrics;
    return {
      id: this.props.id,
      userId: this.props.userId,
      overallScore: this.props.overallScore,
      grade: this.grade,
      metrics: {
        hydration: m.hydration,
        oiliness: m.oiliness,
        texture: m.texture,
        poreClarity: m.poreClarity ?? m.texture,
        pigmentation: m.pigmentation,
        wrinkles: m.wrinkles,
        acneScore: m.acneScore,
        darkCircles: m.darkCircles,
        eyeBags: m.eyeBags,
        rednessScore: m.rednessScore,
        firmness: m.firmness,
        radiance: m.radiance,
        skinAge: m.skinAge,
        skinType: m.skinType,
        barrierHealth: m.barrierHealth,
        photoprotection: m.photoprotection || (m.darkCircles < 65 || m.pigmentation < 75 ? 'SPF 50 Active' : 'SPF 30 Active'),
        heartRate: m.heartRate,
        stressIndex: m.stressIndex,
        oilinessLevel: m.oilinessLevel || (m.oiliness > 70 ? 'High Sebum Production' : m.oiliness < 45 ? 'Low Lipids / Dry' : 'Balanced Sebum'),
      },
      recommendations: this.props.recommendations,
      riskLevel: this.riskLevel,
      consentVersion: this.consentVersion,
      scannedAt: this.props.scannedAt.toISOString(),
    };
  }
}


