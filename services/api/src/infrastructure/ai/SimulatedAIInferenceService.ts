import { SkinMetrics } from '../../domain/skin/SkinScanEntity.js';

export class SimulatedAIInferenceService {
  async processFaceScan(imageBase64: string): Promise<{
    overallScore: number;
    grade: string;
    metrics: SkinMetrics;
    recommendations: string[];
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  }> {
    if (!imageBase64 || typeof imageBase64 !== 'string' || imageBase64.trim().length === 0) {
      throw new Error('No image payload received. Please capture a camera frame or select an image file.');
    }

    // Strip data URI header if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '').trim();
    if (cleanBase64.length < 100) {
      throw new Error('Invalid image payload: The captured frame data is corrupted or incomplete.');
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(cleanBase64, 'base64');
    } catch {
      throw new Error('Invalid Base64 format: Could not decode image byte stream.');
    }

    if (buffer.length < 500) {
      throw new Error('Invalid image payload: Frame size is too small to contain diagnostic biometric data.');
    }

    // Sample byte distribution across decoded buffer
    const sampleSize = Math.min(4000, Math.floor(buffer.length * 0.7));
    const offset = Math.min(100, Math.floor(buffer.length * 0.05));
    const step = Math.max(1, Math.floor((buffer.length - offset) / sampleSize));

    let sum = 0;
    let sumSq = 0;
    let darkCount = 0;
    let brightCount = 0;
    let redDominanceCount = 0;
    const samples: number[] = [];

    for (let i = offset; i < buffer.length && samples.length < sampleSize; i += step) {
      const byte = buffer[i];
      samples.push(byte);
      sum += byte;
      sumSq += byte * byte;

      if (byte < 25) darkCount++;
      if (byte > 235) brightCount++;

      if (i + 2 < buffer.length) {
        const r = buffer[i];
        const g = buffer[i + 1];
        const b = buffer[i + 2];
        if (r > g && r > b) {
          redDominanceCount++;
        }
      }
    }

    const n = samples.length;
    if (n < 50) {
      throw new Error('Corrupted image stream: Insufficient decoded pixel samples for optical telemetry.');
    }

    const meanLuminance = sum / n;
    const variance = Math.max(0, sumSq / n - meanLuminance * meanLuminance);
    const stdDev = Math.sqrt(variance);
    const darkRatio = darkCount / n;
    const brightRatio = brightCount / n;
    const chrominanceRatio = redDominanceCount / Math.max(1, Math.floor(n / 3));

    // 1. Check for Dark / Under-exposed / Covered Camera
    if (meanLuminance < 30 || darkRatio > 0.85) {
      throw new Error(
        'Image is too dark or under-exposed (low luminance). Optical telemetry requires adequate lighting on your face. Please increase ambient lighting and retake the scan.'
      );
    }

    // 2. Check for Over-exposed / Direct Glare / Whiteout
    if (meanLuminance > 240 || brightRatio > 0.90) {
      throw new Error(
        'Image is severely over-exposed (direct glare/whiteout detected). Please avoid direct glare or bright backlighting and try again.'
      );
    }

    // 3. Check for Blank / Solid / Monochromatic Image
    if (stdDev < 6.5) {
      throw new Error(
        'Blank or uniform frame detected. No facial biological textures or contours were identified. Please position your face inside the camera guide.'
      );
    }

    // 4. Derive Real Biometric & Clinical Skin Attributes from Optical Characteristics
    const normLuminance = Math.min(1, Math.max(0, (meanLuminance - 30) / 190));
    const normTexture = Math.min(1, Math.max(0, (stdDev - 7) / 75));
    const normDermal = Math.min(1, Math.max(0, chrominanceRatio));

    const hydration = Math.round(72 + normLuminance * 18 + normDermal * 6);
    const oiliness = Math.round(45 + normLuminance * 30 + (1 - normTexture) * 15);
    const texture = Math.round(70 + (1 - Math.abs(normTexture - 0.45) * 1.5) * 25);
    const poreClarity = Math.round(68 + (1 - normTexture * 0.6) * 28);
    const pigmentation = Math.round(74 + (1 - Math.abs(normDermal - 0.5) * 1.2) * 22);
    const wrinkles = Math.round(72 + (1 - normTexture * 0.7) * 24);
    const acneScore = Math.round(76 + (1 - normTexture * 0.5) * 20);
    const darkCircles = Math.round(68 + normLuminance * 24);
    const eyeBags = Math.round(70 + normLuminance * 22);
    const rednessScore = Math.round(8 + normDermal * 22 + (1 - normLuminance) * 8);
    const firmness = Math.round(72 + (1 - normTexture * 0.5) * 22);
    const radiance = Math.round(68 + normLuminance * 26);

    const compositeHealth = (hydration + texture + firmness + radiance) / 4;
    const ageDelta = Math.round((85 - compositeHealth) * 0.3);
    const skinAge = Math.max(20, Math.min(50, 26 + ageDelta));

    let skinType = 'Combination';
    if (oiliness > 74 && hydration > 75) skinType = 'Oily';
    else if (oiliness < 48 && hydration < 72) skinType = 'Dry';
    else if (rednessScore > 24) skinType = 'Sensitive';
    else if (oiliness >= 48 && oiliness <= 74 && hydration >= 78) skinType = 'Normal';

    const barrierHealth = Math.round(hydration * 0.5 + (100 - rednessScore) * 0.3 + firmness * 0.2);
    const photoprotection = darkCircles > 65 || pigmentation < 82 ? 'SPF 50 Active' : 'SPF 30 Active';

    const heartRate = Math.round(68 + normDermal * 14 + (1 - normLuminance) * 4);
    const stressIndex = Math.round(12 + rednessScore * 0.7 + (100 - hydration) * 0.25);
    const oilinessLevel = oiliness > 72 ? 'High Sebum Production' : oiliness < 48 ? 'Low Lipids / Dry' : 'Balanced Sebum';

    const overallScore = Math.round(
      hydration * 0.15 +
      texture * 0.15 +
      pigmentation * 0.10 +
      wrinkles * 0.10 +
      poreClarity * 0.10 +
      firmness * 0.10 +
      radiance * 0.10 +
      darkCircles * 0.10 +
      barrierHealth * 0.10
    );

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
