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
}

export interface TelemetryAnalysisResult {
  scanId: string;
  userId: string;
  overallScore: number;
  metrics: TelemetryMetrics;
  recommendations: string[];
  modelVersion: string;
  timestamp: string;
}
