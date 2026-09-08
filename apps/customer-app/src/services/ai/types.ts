export type AIProviderType = 'perfect_corp' | 'shen_ai' | 'medivo_internal' | 'mock';

export interface PerfectCorpSkinAnalysis {
  overallScore: number;
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
  concernsDetected: string[];
}


export interface ShenAIVitalsAnalysis {
  heartRate: number; // BPM
  respirationRate: number; // RPM
  hrv: number; // ms
  stressIndex: number; // 0 - 100
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  vascularAge: number;
  signalQuality: number; // %
}

export interface CombinedAIReport {
  id: string;
  timestamp: string;
  provider: AIProviderType;
  skin?: PerfectCorpSkinAnalysis;
  vitals?: ShenAIVitalsAnalysis;
  aiInsights: string[];
  recommendations: string[];
}

export interface SkinAnalysisProvider {
  name: string;
  analyzeSkinImage(imageBase64: string): Promise<PerfectCorpSkinAnalysis>;
}

export interface VitalsAnalysisProvider {
  name: string;
  analyzeVitalsStream(frameData: string): Promise<ShenAIVitalsAnalysis>;
}
