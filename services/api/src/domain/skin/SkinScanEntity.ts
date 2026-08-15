export interface SkinMetrics {
  hydration: number;       // 0-100%
  texture: number;         // 0-100
  pigmentation: number;    // 0-100
  darkCircles: number;     // 0-100
  skinAge?: number;        // Estimated dermal age in years
  rednessScore?: number;   // Dermal erythema percentage (0-100%)
  poreClarity?: number;    // Pore clarity percentage (0-100%)
  photoprotection?: string;// Dynamic photoprotection status
}

export interface SkinScanProps {
  id: string;
  userId: string;
  overallScore: number;
  metrics: SkinMetrics;
  recommendations: string[];
  scannedAt: Date;
}

export class SkinScan {
  constructor(private props: SkinScanProps) {}

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get overallScore(): number { return this.props.overallScore; }
  get metrics(): SkinMetrics { return this.props.metrics; }
  get recommendations(): string[] { return this.props.recommendations; }
  get scannedAt(): Date { return this.props.scannedAt; }

  toDTO() {
    const hydration = this.props.metrics.hydration ?? 92;
    const texture = this.props.metrics.texture ?? 85;
    const pigmentation = this.props.metrics.pigmentation ?? 91;
    const darkCircles = this.props.metrics.darkCircles ?? 72;

    const skinAge = this.props.metrics.skinAge ?? 26;
    const rednessScore = this.props.metrics.rednessScore ?? Math.round(100 - pigmentation);
    const poreClarity = this.props.metrics.poreClarity ?? texture;
    const photoprotection = this.props.metrics.photoprotection ?? (darkCircles > 50 ? 'SPF 50 Active' : 'SPF 30 Active');

    return {
      id: this.props.id,
      userId: this.props.userId,
      overallScore: this.props.overallScore,
      metrics: {
        hydration,
        texture,
        pigmentation,
        darkCircles,
        skinAge,
        rednessScore,
        poreClarity,
        photoprotection,
      },
      recommendations: this.props.recommendations,
      scannedAt: this.props.scannedAt.toISOString(),
    };
  }
}
