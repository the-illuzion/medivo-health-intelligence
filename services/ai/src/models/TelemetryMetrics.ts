export interface TelemetryMetrics {
  // 15 Core Clinical Skin Attributes from Perfect AI
  hydration: number;         // 1. Stratum Corneum Hydration (0-100%)
  oiliness: number;          // 2. Oiliness / Sebum Balance (0-100%)
  texture: number;           // 3. Epidermal Micro-Texture & Smoothness (0-100)
  poreClarity: number;       // 4. Pore Clarity & Visibility (0-100%)
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

  // Photoprotection & Vital Telemetry
  photoprotection?: string;
  heartRate?: number;
  stressIndex?: number;
  oilinessLevel?: string;
  overallScore?: number;
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
