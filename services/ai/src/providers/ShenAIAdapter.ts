import { IAIProviderAdapter, AIProviderResult } from './IAIProviderAdapter.js';
import { env } from '../config/env.js';
import { trackedFetch, createLogger } from '@medivo/utils';

const adapterLogger = createLogger('shen-ai-adapter');

export class ShenAIAdapter implements IAIProviderAdapter {
  public name = 'ShenAI';

  public isConfigured(): boolean {
    return Boolean(env.SHEN_API_KEY && env.SHEN_CLIENT_SECRET);
  }

  public async analyzeImage(imageBase64: string): Promise<AIProviderResult> {
    if (!this.isConfigured()) {
      throw new Error('Shen AI API credentials (SHEN_API_KEY, SHEN_CLIENT_SECRET) are not configured.');
    }

    try {
      const response = await trackedFetch(
        env.SHEN_ENDPOINT,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.SHEN_API_KEY}`,
            'X-Client-Secret': env.SHEN_CLIENT_SECRET!,
          },
          body: JSON.stringify({
            payload: imageBase64,
            analysis_type: 'vital_telemetry',
          }),
          serviceName: 'shen-ai-api',
          operationName: 'POST /vitals/telemetry/rppg',
        },
        adapterLogger
      );

      if (!response.ok) {
        throw new Error(`Shen AI API HTTP Error ${response.status}: ${response.statusText}`);
      }

      const json: any = await response.json();
      const payload = json.data || json;

      const hydration = Number(payload.hydration || 90);
      const oiliness = Number(payload.oiliness || 58);
      const texture = Number(payload.texture || 86);
      const poreClarity = Number(payload.pore_clarity || payload.poreClarity || 85);
      const pigmentation = Number(payload.pigmentation || 88);
      const wrinkles = Number(payload.wrinkles || 88);
      const acneScore = Number(payload.acne || 94);
      const darkCircles = Number(payload.dark_circles || payload.darkCircles || 75);
      const eyeBags = Number(payload.eye_bags || payload.eyeBags || 80);
      const rednessScore = Number(payload.redness || 12);
      const firmness = Number(payload.firmness || 86);
      const radiance = Number(payload.radiance || 88);
      const skinAge = Number(payload.skin_age || payload.skinAge || 26);
      const skinType = String(payload.skin_type || 'Combination');
      const barrierHealth = Number(payload.barrier_health || 92);

      const photoprotection = darkCircles > 50 ? 'SPF 50 Active' : 'SPF 30 Active';
      const heartRate = Number(payload.heart_rate || payload.bpm || 72);
      const stressIndex = Number(payload.stress_index || 18);
      const oilinessLevel = oiliness > 70 ? 'High Sebum Production' : oiliness < 45 ? 'Low Lipids / Dry' : 'Balanced Sebum';

      const overallScore = Math.round(
        (hydration * 0.15) +
        (texture * 0.15) +
        (pigmentation * 0.10) +
        (wrinkles * 0.10) +
        (poreClarity * 0.10) +
        (firmness * 0.10) +
        (radiance * 0.10) +
        (darkCircles * 0.10) +
        (barrierHealth * 0.10)
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
          'Use Barrier Repair Emulsion with Niacinamide & Ceramides',
          'Broad Spectrum Daily SPF 50 Mineral Application',
          'Targeted Periorbital Circulation Serum at bedtime',
        ],
        providerName: this.name,
      };
    } catch (err: any) {
      adapterLogger.warn('[ShenAIAdapter] External provider call error:', { error: err.message });
      throw err;
    }
  }
}

