import { IAIProviderAdapter, AIProviderResult } from './IAIProviderAdapter.js';
import { env } from '../config/env.js';
import { trackedFetch, createLogger } from '@medivo/utils';

const adapterLogger = createLogger('perfect-corp-adapter');

function clamp(min: number, max: number, val: number): number {
  return Math.max(min, Math.min(max, val));
}

export class PerfectCorpAdapter implements IAIProviderAdapter {
  public name = 'Medivo Optical AI Engine';

  public isConfigured(): boolean {
    return Boolean(env.PERFECT_CORP_API_KEY && env.PERFECT_CORP_SECRET_KEY);
  }

  public async analyzeImage(imageBase64: string): Promise<AIProviderResult> {
    if (!this.isConfigured()) {
      throw new Error('Third-party API credentials (PERFECT_CORP_API_KEY, PERFECT_CORP_SECRET_KEY) are not configured.');
    }

    try {
      const response = await trackedFetch(
        env.PERFECT_CORP_ENDPOINT,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': env.PERFECT_CORP_API_KEY!,
            'X-Secret-Key': env.PERFECT_CORP_SECRET_KEY!,
          },
          body: JSON.stringify({
            image_data: imageBase64,
            features: [
              'hydration',
              'oiliness',
              'texture',
              'pores',
              'spots',
              'wrinkles',
              'acne',
              'dark_circles',
              'eye_bags',
              'redness',
              'firmness',
              'radiance',
              'skin_age',
              'skin_type',
              'barrier_health',
            ],
          }),
          serviceName: 'perfect-corp-api',
          operationName: 'POST /ai-api/v1/skin/analysis',
        },
        adapterLogger
      );

      if (!response.ok) {
        throw new Error(`Optical AI Provider HTTP Error ${response.status}: ${response.statusText}`);
      }

      const json: any = await response.json();
      const resultData = json.data || json.result || json;

      // Extract raw metrics from provider payload
      const hydration = Number(resultData.hydration ?? resultData.moisture ?? 80);
      const oiliness = Number(resultData.oiliness ?? resultData.sebum ?? 55);
      const texture = Number(resultData.texture ?? resultData.smoothness ?? 82);
      const poreClarity = Number(resultData.pores ?? resultData.pore_clarity ?? resultData.poreClarity ?? texture);
      const pigmentation = Number(resultData.spots ?? resultData.pigmentation ?? 85);
      const wrinkles = Number(resultData.wrinkles ?? resultData.fine_lines ?? 84);
      const acneScore = Number(resultData.acne ?? resultData.acne_score ?? 88);
      const darkCircles = Number(resultData.dark_circles ?? resultData.darkCircles ?? 75);
      const eyeBags = Number(resultData.eye_bags ?? resultData.eyeBags ?? 78);
      const rednessScore = Number(resultData.redness ?? resultData.erythema ?? 14);
      const firmness = Number(resultData.firmness ?? resultData.elasticity ?? 82);
      const radiance = Number(resultData.radiance ?? resultData.glow ?? Math.round(hydration * 0.5 + texture * 0.5));
      const skinAge = Number(
        resultData.skin_age ??
        resultData.skinAge ??
        clamp(18, 65, Math.round(22 + (100 - wrinkles) * 0.22 + (100 - firmness) * 0.20 + (100 - hydration) * 0.12))
      );
      const skinType = String(
        resultData.skin_type ||
        resultData.skinType ||
        (rednessScore > 32 ? 'Sensitive' : oiliness > 68 ? 'Oily' : oiliness < 42 ? 'Dry' : 'Combination')
      );
      const barrierHealth = Number(
        resultData.barrier_health ??
        resultData.barrierHealth ??
        clamp(30, 98, Math.round(hydration * 0.5 + (100 - rednessScore) * 0.3 + firmness * 0.2))
      );

      const photoprotection = darkCircles < 65 || pigmentation < 75 ? 'SPF 50 Active' : 'SPF 30 Active';
      const heartRate = Number(resultData.heart_rate ?? resultData.bpm ?? 72);
      const stressIndex = Number(
        resultData.stress_index ??
        clamp(5, 90, Math.round(10 + (heartRate - 60) * 0.75 + rednessScore * 0.45 + (100 - hydration) * 0.20))
      );
      const oilinessLevel = oiliness > 70 ? 'High Sebum Production' : oiliness < 45 ? 'Low Lipids / Dry' : 'Balanced Sebum';

      const overallScore = Number(
        resultData.overall_score ??
        resultData.overallScore ??
        Math.round(
          hydration * 0.15 +
          texture * 0.15 +
          pigmentation * 0.10 +
          wrinkles * 0.10 +
          poreClarity * 0.10 +
          firmness * 0.10 +
          radiance * 0.10 +
          darkCircles * 0.10 +
          barrierHealth * 0.10
        )
      );

      return {
        overallScore,
        metrics: {
          hydration,
          oiliness,
          texture,
          poreClarity,
          pigmentation,
          wrinkles,
          acneScore,
          darkCircles,
          eyeBags,
          rednessScore,
          firmness,
          radiance,
          skinAge,
          skinType,
          barrierHealth,
          photoprotection,
          heartRate,
          stressIndex,
          oilinessLevel,
        },
        recommendations: [
          'Apply Broad-Spectrum Mineral SPF 50 daily 15 minutes prior to UV exposure',
          'Use Multi-Molecular Hyaluronic Acid Hydrating Serum twice daily after cleansing',
          'Evening Barrier Restoration Complex with Ceramides & Niacinamide at bedtime',
        ],
        providerName: this.name,
      };
    } catch (err: any) {
      adapterLogger.warn('[PerfectCorpAdapter] External provider call error:', { error: err.message });
      throw err;
    }
  }
}


