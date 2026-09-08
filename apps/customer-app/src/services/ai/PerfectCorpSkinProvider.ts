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
        hydration: json.hydration ?? json.moisture ?? 90,
        oiliness: json.oiliness ?? json.sebum ?? 58,
        texture: json.texture ?? json.smoothness ?? 86,
        poreClarity: json.pores ?? json.pore_clarity ?? 85,
        pigmentation: json.spots ?? json.pigmentation ?? 88,
        wrinkles: json.wrinkles ?? json.fine_lines ?? 88,
        acneScore: json.acne ?? json.acne_score ?? 94,
        darkCircles: json.dark_circles ?? 75,
        eyeBags: json.eye_bags ?? 80,
        rednessScore: json.redness ?? 12,
        firmness: json.firmness ?? json.elasticity ?? 86,
        radiance: json.radiance ?? json.glow ?? 88,
        skinAge: json.skin_age ?? 26,
        skinType: json.skin_type || 'Combination',
        barrierHealth: json.barrier_health ?? 92,
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
      hydration: 90,
      oiliness: 58,
      texture: 86,
      poreClarity: 85,
      pigmentation: 88,
      wrinkles: 88,
      acneScore: 94,
      darkCircles: 75,
      eyeBags: 80,
      rednessScore: 12,
      firmness: 86,
      radiance: 88,
      skinAge: 26,
      skinType: 'Combination',
      barrierHealth: 92,
      concernsDetected: ['Mild Epidermal Redness', 'Subtle Dehydration'],
    };
  }
}
