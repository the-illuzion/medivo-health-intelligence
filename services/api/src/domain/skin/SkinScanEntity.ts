export interface SkinMetrics {
  hydration: number;       // 0-100%
  texture: number;         // 0-100
  pigmentation: number;    // 0-100
  darkCircles: number;     // 0-100
  skinAge?: number;        // Estimated dermal age in years
  rednessScore?: number;   // Dermal erythema percentage (0-100%)
  poreClarity?: number;    // Pore clarity percentage (0-100%)
  photoprotection?: string;// Dynamic photoprotection status
  acneScore?: number;
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
    const hydration = this.props.metrics.hydration ?? 85;
    const texture = this.props.metrics.texture ?? 82;
    const pigmentation = this.props.metrics.pigmentation ?? 88;
    const darkCircles = this.props.metrics.darkCircles ?? 74;

    const skinAge = this.props.metrics.skinAge ?? 26;
    const rednessScore = this.props.metrics.rednessScore ?? Math.round(100 - pigmentation);
    const poreClarity = this.props.metrics.poreClarity ?? texture;
    const photoprotection = this.props.metrics.photoprotection ?? (darkCircles > 50 ? 'SPF 50 Active' : 'SPF 30 Active');

    return {
      id: this.props.id,
      userId: this.props.userId,
      overallScore: this.props.overallScore,
      grade: this.grade,
      metrics: {
        hydration,
        texture,
        pigmentation,
        darkCircles,
        skinAge,
        rednessScore,
        poreClarity,
        photoprotection,
        acneScore: this.props.metrics.acneScore,
        oilinessLevel: this.props.metrics.oilinessLevel,
      },
      recommendations: this.props.recommendations,
      riskLevel: this.riskLevel,
      consentVersion: this.consentVersion,
      scannedAt: this.props.scannedAt.toISOString(),
    };
  }
}
