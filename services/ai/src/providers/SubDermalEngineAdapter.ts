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

    // Dynamic tailored recommendations
    const dynamicRecs: string[] = [];
    if (rawMetrics.hydration < 80) {
      dynamicRecs.push('Apply Multi-Molecular Hyaluronic Acid Serum twice daily after cleansing.');
    } else {
      dynamicRecs.push('Maintain optimal dermal moisture with Ceramide Barrier Daily Moisturizer.');
    }

    if (rawMetrics.pigmentation < 82) {
      dynamicRecs.push('Incorporate 10% Niacinamide + Vitamin C to even tone and reduce dark spots.');
      dynamicRecs.push('Apply Broad-Spectrum Mineral SPF 50 every morning 15 minutes prior to UV exposure.');
    } else {
      dynamicRecs.push('Daily Mineral Broad-Spectrum SPF 50 application for cellular UV defense.');
    }

    if (rawMetrics.darkCircles < 75) {
      dynamicRecs.push('Target periorbital micro-circulation with Caffeine 5% + Peptide Eye Contour Gel.');
    }

    if (rawMetrics.texture < 80) {
      dynamicRecs.push('Use Gentle 2% BHA Salicylic Acid Exfoliant 2-3 nights per week to refine pore texture.');
    }

    if (dynamicRecs.length < 3) {
      dynamicRecs.push('Evening Barrier Restoration Complex to support overnight cellular renewal.');
    }

    return {
      overallScore,
      grade,
      metrics: rawMetrics,
      recommendations: dynamicRecs.slice(0, 3),
      riskLevel,
      providerName: this.name,
    };
  }
}
