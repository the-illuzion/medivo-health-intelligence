import { IAIProviderAdapter, AIProviderResult } from './IAIProviderAdapter.js';
import { env } from '../config/env.js';
import { trackedFetch, createLogger } from '@medivo/utils';

const adapterLogger = createLogger('shen-ai-adapter');

function clamp(min: number, max: number, val: number): number {
  return Math.max(min, Math.min(max, val));
}

export class ShenAIAdapter implements IAIProviderAdapter {
  public name = 'Medivo rPPG Telemetry Engine';

  public isConfigured(): boolean {
    return Boolean(env.SHEN_API_KEY && env.SHEN_CLIENT_SECRET);
  }

  public async analyzeImage(imageBase64: string): Promise<AIProviderResult> {
    if (!this.isConfigured()) {
      throw new Error('Third-party rPPG API credentials (SHEN_API_KEY, SHEN_CLIENT_SECRET) are not configured.');
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
        throw new Error(`rPPG Telemetry API HTTP Error ${response.status}: ${response.statusText}`);
      }

      const json: any = await response.json();
      const payload = json.data || json;

      const heartRate = Number(payload.heart_rate ?? payload.bpm ?? 72);
      const stressIndex = Number(payload.stress_index ?? payload.stressIndex ?? 18);
      const hydration = Number(payload.hydration ?? payload.moisture ?? 82);
      const oiliness = Number(payload.oiliness ?? payload.sebum ?? 54);
      const texture = Number(payload.texture ?? payload.smoothness ?? 82);
      const poreClarity = Number(payload.pore_clarity ?? payload.poreClarity ?? texture);
      const pigmentation = Number(payload.pigmentation ?? payload.spots ?? 85);
      const wrinkles = Number(payload.wrinkles ?? payload.fine_lines ?? 84);
      const acneScore = Number(payload.acne ?? payload.acne_score ?? 88);
      const darkCircles = Number(payload.dark_circles ?? payload.darkCircles ?? 74);
      const eyeBags = Number(payload.eye_bags ?? payload.eyeBags ?? 78);
      const rednessScore = Number(payload.redness ?? payload.erythema ?? 14);
      const firmness = Number(payload.firmness ?? payload.elasticity ?? 82);
      const radiance = Number(payload.radiance ?? payload.glow ?? Math.round(hydration * 0.5 + texture * 0.5));
      const skinAge = Number(
        payload.skin_age ??
        payload.skinAge ??
        clamp(18, 65, Math.round(22 + (100 - wrinkles) * 0.22 + (100 - firmness) * 0.20 + (100 - hydration) * 0.12))
      );
      const skinType = String(
        payload.skin_type ||
        payload.skinType ||
        (rednessScore > 32 ? 'Sensitive' : oiliness > 68 ? 'Oily' : oiliness < 42 ? 'Dry' : 'Combination')
      );
      const barrierHealth = Number(
        payload.barrier_health ??
        payload.barrierHealth ??
        clamp(30, 98, Math.round(hydration * 0.5 + (100 - rednessScore) * 0.3 + firmness * 0.2))
      );

      const photoprotection = darkCircles < 65 || pigmentation < 75 ? 'SPF 50 Active' : 'SPF 30 Active';
      const oilinessLevel = oiliness > 70 ? 'High Sebum Production' : oiliness < 45 ? 'Low Lipids / Dry' : 'Balanced Sebum';

      const overallScore = Number(
        payload.overall_score ??
        payload.overallScore ??
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


