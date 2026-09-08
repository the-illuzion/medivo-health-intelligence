export interface AIProviderResult {
  overallScore: number;
  grade?: string;
  metrics: {
    hydration: number;
    texture: number;
    pigmentation: number;
    darkCircles: number;
    skinAge?: number;
    rednessScore?: number;
    poreClarity?: number;
    photoprotection?: string;
    heartRate?: number;
    stressIndex?: number;
    barrierHealth?: number;
    acneScore?: number;
    oilinessLevel?: string;
  };
  recommendations: string[];
  riskLevel?: 'LOW' | 'MODERATE' | 'HIGH';
  providerName: string;
}

export interface IAIProviderAdapter {
  name: string;
  isConfigured(): boolean;
  analyzeImage(imageBase64: string): Promise<AIProviderResult>;
}
