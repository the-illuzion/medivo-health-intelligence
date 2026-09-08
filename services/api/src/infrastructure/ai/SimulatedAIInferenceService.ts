import { SkinMetrics } from '../../domain/skin/SkinScanEntity.js';

export class SimulatedAIInferenceService {
  async processFaceScan(imageBase64: string): Promise<{
    overallScore: number;
    grade: string;
    metrics: SkinMetrics;
    recommendations: string[];
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  }> {
    // Generate intelligent, dynamic metrics based on payload checksum and realistic dermatological distributions
    const seed = (imageBase64 || '').length > 0
      ? (imageBase64.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100)
      : Math.floor(Math.random() * 100);

    const hydration = Math.min(98, Math.max(62, 74 + (seed % 19)));
    const oiliness = Math.min(95, Math.max(35, 55 + ((seed * 3) % 35)));
    const texture = Math.min(96, Math.max(68, 78 + ((seed * 3) % 17)));
    const poreClarity = Math.min(98, Math.max(60, Math.round((texture * 0.7) + (hydration * 0.3))));
    const pigmentation = Math.min(96, Math.max(65, 75 + ((seed * 7) % 20)));
    const wrinkles = Math.min(96, Math.max(60, 82 + ((seed * 5) % 15)));
    const acneScore = Math.max(50, Math.min(98, Math.round(100 - ((100 - texture) * 0.8) - ((seed * 11) % 15))));
    const darkCircles = Math.min(95, Math.max(58, 68 + ((seed * 11) % 22)));
    const eyeBags = Math.min(95, Math.max(58, 72 + ((seed * 13) % 20)));
    const rednessScore = Math.min(45, Math.max(8, Math.round(100 - pigmentation + (seed % 6))));
    const firmness = Math.min(96, Math.max(62, 80 + ((seed * 17) % 16)));
    const radiance = Math.min(98, Math.max(65, Math.round((hydration * 0.5) + (texture * 0.5))));

    // Calculated dermal age (base 25 years with variance according to texture and hydration)
    const ageOffset = Math.round((85 - ((hydration + texture + firmness) / 3)) * 0.25);
    const skinAge = Math.max(20, Math.min(48, 25 + ageOffset));

    // Skin Type detection
    let skinType = 'Combination';
    if (oiliness > 75 && hydration > 70) skinType = 'Oily';
    else if (oiliness < 45 && hydration < 70) skinType = 'Dry';
    else if (rednessScore > 30) skinType = 'Sensitive';
    else if (oiliness >= 45 && oiliness <= 70 && hydration >= 75) skinType = 'Normal';

    // Vital signs, barrier & photoprotection
    const barrierHealth = Math.min(98, Math.max(60, Math.round((hydration * 0.5) + ((100 - rednessScore) * 0.3) + (firmness * 0.2))));
    const photoprotection = darkCircles > 65 || pigmentation < 80 ? 'SPF 50 Active' : 'SPF 30 Active';
    const heartRate = Math.min(84, Math.max(64, 72 + ((hydration + texture) % 9) - 4));
    const stressIndex = Math.min(50, Math.max(12, Math.round(rednessScore * 0.8 + (100 - hydration) * 0.3)));
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

    // Clinical Grade
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
      dynamicRecs.push('Incorporate 10% Niacinamide + Vitamin C to even tone and reduce melanin clustering.');
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
      recommendations: dynamicRecs.slice(0, 3),
      riskLevel,
    };
  }
}
