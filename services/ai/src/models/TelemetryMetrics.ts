export interface TelemetryMetrics {
  hydration: number;
  texture: number;
  pigmentation: number;
  darkCircles: number;
  overallScore: number;
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
