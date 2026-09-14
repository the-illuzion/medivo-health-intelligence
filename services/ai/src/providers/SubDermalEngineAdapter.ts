import { IAIProviderAdapter, AIProviderResult } from './IAIProviderAdapter.js';
import { SubDermalTelemetryEngine } from '../domain/SubDermalTelemetryEngine.js';

export class SubDermalEngineAdapter implements IAIProviderAdapter {
  public name = 'SubDermalNeuralEngine';

  public isConfigured(): boolean {
    return true; // Always available as local fallback engine
  }

  public async analyzeImage(imageBase64: string): Promise<AIProviderResult> {
    const rawMetrics = SubDermalTelemetryEngine.analyzeImagePayload(imageBase64);
    const overallScore = rawMetrics.overallScore || 85;

    // Grade and Risk
    let grade = 'Optimal Grade';
    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
    if (overallScore < 60) {
      grade = 'Clinical Review Recommended';
      riskLevel = 'HIGH';
    } else if (overallScore < 72) {
      grade = 'Attention Advised';
      riskLevel = 'MODERATE';
    } else if (overallScore < 84) {
      grade = 'Good Condition';
      riskLevel = 'LOW';
    }

    // Dynamic tailored recommendations ranked by priority
    const candidates: Array<{ priority: number; rec: string }> = [];

    if (rawMetrics.rednessScore > 28) {
      candidates.push({
        priority: 100 - rawMetrics.rednessScore,
        rec: 'Apply Centella Asiatica (Cica) + Ceramide Calming Barrier Serum to soothe vascular reactivity.',
      });
    }

    if (rawMetrics.hydration < 75) {
      candidates.push({
        priority: rawMetrics.hydration,
        rec: 'Apply Multi-Molecular Hyaluronic Acid + Polyglutamic Serum twice daily after cleansing.',
      });
    } else {
      candidates.push({
        priority: rawMetrics.hydration + 25,
        rec: 'Maintain optimal dermal moisture with Ceramide Barrier Daily Moisturizer.',
      });
    }

    if (rawMetrics.pigmentation < 78) {
      candidates.push({
        priority: rawMetrics.pigmentation,
        rec: 'Incorporate 10% Niacinamide + Tranexamic Acid serum to correct localized melanin hyperpigmentation.',
      });
    }

    if (rawMetrics.darkCircles < 72) {
      candidates.push({
        priority: rawMetrics.darkCircles,
        rec: 'Target periorbital micro-circulation with Caffeine 5% + Peptide Eye Contour Gel.',
      });
    }

    if (rawMetrics.texture < 75 || rawMetrics.poreClarity < 75) {
      candidates.push({
        priority: Math.min(rawMetrics.texture, rawMetrics.poreClarity),
        rec: 'Use Gentle 2% BHA Salicylic Acid liquid exfoliant 2–3 nights weekly to refine pore texture.',
      });
    }

    if (rawMetrics.wrinkles < 75 || rawMetrics.firmness < 75) {
      candidates.push({
        priority: Math.min(rawMetrics.wrinkles, rawMetrics.firmness),
        rec: 'Encapsulated 0.3% Retinol + Copper Peptides complex for overnight collagen synthesis.',
      });
    }

    if (rawMetrics.acneScore < 75) {
      candidates.push({
        priority: rawMetrics.acneScore,
        rec: 'Clarifying Zinc PCA + Azelaic Acid 10% topical suspension for blemish control.',
      });
    }

    candidates.push({
      priority: rawMetrics.photoprotection.includes('50') ? 50 : 80,
      rec: 'Daily Mineral Broad-Spectrum SPF 50 application every morning for cellular UV defense.',
    });

    candidates.sort((a, b) => a.priority - b.priority);
    const dynamicRecs = Array.from(new Set(candidates.map((c) => c.rec))).slice(0, 3);

    return {
      overallScore,
      grade,
      metrics: rawMetrics,
      recommendations: dynamicRecs,
      riskLevel,
      providerName: this.name,
    };
  }
}

