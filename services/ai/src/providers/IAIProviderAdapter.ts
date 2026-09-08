import { TelemetryMetrics } from '../models/TelemetryMetrics.js';

export interface AIProviderResult {
  overallScore: number;
  grade?: string;
  metrics: TelemetryMetrics;
  recommendations: string[];
  riskLevel?: 'LOW' | 'MODERATE' | 'HIGH';
  providerName: string;
}


export interface IAIProviderAdapter {
  name: string;
  isConfigured(): boolean;
  analyzeImage(imageBase64: string): Promise<AIProviderResult>;
}
