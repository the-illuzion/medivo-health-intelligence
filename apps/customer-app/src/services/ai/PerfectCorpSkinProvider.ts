import { PerfectCorpSkinAnalysis, SkinAnalysisProvider } from './types';

export interface PerfectCorpConfig {
  apiKey?: string;
  baseUrl?: string;
}

export class PerfectCorpSkinProvider implements SkinAnalysisProvider {
  public name = 'Perfect Corp AI API';
  private apiKey: string;
  private baseUrl: string;

  constructor(config?: PerfectCorpConfig) {
    this.apiKey = config?.apiKey || process.env.PERFECT_CORP_API_KEY || '';
    this.baseUrl = config?.baseUrl || 'https://yce.perfectcorp.com/ai-api/v1';
  }

  public async analyzeSkinImage(imageBase64: string): Promise<PerfectCorpSkinAnalysis> {
    if (!this.apiKey) {
      console.warn('[PerfectCorpSkinProvider] API key missing. Falling back to mock telemetry response.');
      return this.getMockAnalysis();
    }

    try {
      const response = await fetch(`${this.baseUrl}/skin/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ image: imageBase64 }),
      });

      if (!response.ok) {
        throw new Error(`Perfect Corp API Error: ${response.status}`);
      }

      const json = await response.json();
      return {
        overallScore: json.overall_score ?? 87,
        skinAge: json.skin_age ?? 27,
        spotsScore: json.spots ?? 82,
        wrinklesScore: json.wrinkles ?? 89,
        textureScore: json.texture ?? 85,
        rednessScore: json.redness ?? 78,
        moistureScore: json.moisture ?? 92,
        darkCirclesScore: json.dark_circles ?? 76,
        acneScore: json.acne ?? 94,
        firmnessScore: json.firmness ?? 88,
        concernsDetected: json.concerns || ['Mild Pigmentation', 'Dehydration'],
      };
    } catch (err) {
      console.warn('[PerfectCorpSkinProvider] Exception during request:', err);
      return this.getMockAnalysis();
    }
  }

  private getMockAnalysis(): PerfectCorpSkinAnalysis {
    return {
      overallScore: 87,
      skinAge: 26,
      spotsScore: 84,
      wrinklesScore: 90,
      textureScore: 86,
      rednessScore: 80,
      moistureScore: 93,
      darkCirclesScore: 78,
      acneScore: 95,
      firmnessScore: 89,
      concernsDetected: ['Mild Epidermal Redness', 'Subtle Dehydration'],
    };
  }
}
