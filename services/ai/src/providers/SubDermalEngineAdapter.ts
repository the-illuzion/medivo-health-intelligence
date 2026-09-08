import { IAIProviderAdapter, AIProviderResult } from './IAIProviderAdapter.js';
import { SubDermalTelemetryEngine } from '../domain/SubDermalTelemetryEngine.js';

export class SubDermalEngineAdapter implements IAIProviderAdapter {
  public name = 'SubDermalNeuralEngine';

  public isConfigured(): boolean {
    return true; // Always available as local fallback engine
  }

  public async analyzeImage(imageBase64: string): Promise<AIProviderResult> {
    const rawMetrics = SubDermalTelemetryEngine.analyzeImagePayload(imageBase64);

    const hydration = rawMetrics.hydration;
    const texture = rawMetrics.texture;
    const pigmentation = rawMetrics.pigmentation;
    const darkCircles = rawMetrics.darkCircles;

    const overallScore = Math.round((hydration + texture + pigmentation + darkCircles) / 4);

    // Calculated dermal age (base 25 years with variance according to texture and hydration)
    const ageOffset = Math.round((85 - ((hydration + texture) / 2)) * 0.25);
    const skinAge = Math.max(20, Math.min(48, 25 + ageOffset));

    const rednessScore = Math.min(45, Math.max(8, Math.round(100 - pigmentation + (rawMetrics.hydration % 5))));
    const poreClarity = Math.min(98, Math.max(65, Math.round((texture * 0.7) + (hydration * 0.3))));
    const photoprotection = darkCircles > 70 ? 'SPF 50 Active' : 'SPF 30 Active';
    const acneScore = Math.max(2, Math.min(35, Math.round((100 - texture) * 0.4)));
    const oilinessLevel = hydration > 85 ? 'Balanced Hydration' : hydration < 70 ? 'Dehydrated / Dry' : 'Normal / Combination';

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

    // Dynamic tailored recommendations
    const dynamicRecs: string[] = [];
    if (hydration < 80) {
      dynamicRecs.push('Apply Multi-Molecular Hyaluronic Acid Serum twice daily after cleansing.');
    } else {
      dynamicRecs.push('Maintain optimal dermal moisture with Ceramide Barrier Daily Moisturizer.');
    }

    if (pigmentation < 82) {
      dynamicRecs.push('Incorporate 10% Niacinamide + Vitamin C to even tone and reduce dark spots.');
      dynamicRecs.push('Apply Broad-Spectrum Mineral SPF 50 every morning 15 minutes prior to UV exposure.');
    } else {
      dynamicRecs.push('Daily Mineral Broad-Spectrum SPF 50 application for cellular UV defense.');
    }

    if (darkCircles < 75) {
      dynamicRecs.push('Target periorbital micro-circulation with Caffeine 5% + Peptide Eye Contour Gel.');
    }

    if (texture < 80) {
      dynamicRecs.push('Use Gentle 2% BHA Salicylic Acid Exfoliant 2-3 nights per week to refine pore texture.');
    }

    if (dynamicRecs.length < 3) {
      dynamicRecs.push('Evening Barrier Restoration Complex to support overnight cellular renewal.');
    }

    return {
      overallScore,
      grade,
      metrics: {
        hydration,
        texture,
        pigmentation,
        darkCircles,
        skinAge,
        rednessScore,
        poreClarity,
        photoprotection,
        acneScore,
        oilinessLevel,
      },
      recommendations: dynamicRecs.slice(0, 3),
      riskLevel,
      providerName: this.name,
    };
  }
}
