export interface AIProviderResult {
  overallScore: number;
  metrics: {
    hydration: number;
    texture: number;
    pigmentation: number;
    darkCircles: number;
    skinAge?: number;
    rednessScore?: number;
    poreClarity?: number;
    photoprotection?: string;
  };
  recommendations: string[];
  providerName: string;
}

export interface IAIProviderAdapter {
  name: string;
  isConfigured(): boolean;
  analyzeImage(imageBase64: string): Promise<AIProviderResult>;
}
