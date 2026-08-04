export type AIProviderType = 'perfect_corp' | 'shen_ai' | 'medivo_internal' | 'mock';

export interface PerfectCorpSkinAnalysis {
  overallScore: number;
  skinAge: number;
  spotsScore: number;
  wrinklesScore: number;
  textureScore: number;
  rednessScore: number;
  moistureScore: number;
  darkCirclesScore: number;
  acneScore: number;
  firmnessScore: number;
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
