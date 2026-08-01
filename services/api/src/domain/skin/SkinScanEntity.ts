export interface SkinMetrics {
  hydration: number; // 0-100%
  texture: number;   // 0-100
  pigmentation: number; // 0-100
  darkCircles: number; // 0-100
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
    return {
      id: this.props.id,
      userId: this.props.userId,
      overallScore: this.props.overallScore,
      metrics: this.props.metrics,
      recommendations: this.props.recommendations,
      scannedAt: this.props.scannedAt.toISOString(),
    };
  }
}
