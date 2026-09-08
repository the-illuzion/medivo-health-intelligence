export interface TelemetryMetrics {
  hydration: number;
  texture: number;
  pigmentation: number;
  darkCircles: number;
  overallScore?: number;
  skinAge?: number;
  rednessScore?: number;
  poreClarity?: number;
  photoprotection?: string;
  heartRate?: number;
  stressIndex?: number;
  barrierHealth?: number;
  acneScore?: number;
  oilinessLevel?: string;
}

export interface TelemetryAnalysisResult {
  scanId: string;
  userId: string;
  overallScore: number;
  grade?: string;
  metrics: TelemetryMetrics;
  recommendations: string[];
  riskLevel?: 'LOW' | 'MODERATE' | 'HIGH';
  consentVersion?: string;
  modelVersion: string;
  timestamp: string;
}
