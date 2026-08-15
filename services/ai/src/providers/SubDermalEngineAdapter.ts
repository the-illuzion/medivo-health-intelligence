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

    const skinAge = 26;
    const rednessScore = Math.round(100 - pigmentation);
    const poreClarity = texture;
    const photoprotection = darkCircles > 50 ? 'SPF 50 Active' : 'SPF 30 Active';

    const overallScore = Math.round((hydration + texture + pigmentation + darkCircles) / 4);

    return {
      overallScore,
      metrics: {
        hydration,
        texture,
        pigmentation,
        darkCircles,
        skinAge,
        rednessScore,
        poreClarity,
        photoprotection,
      },
      recommendations: [
        'Incorporate Triple-Weight Hyaluronic Acid Serum twice daily',
        'Broad spectrum Mineral SPF 50 application',
        'Ceramide Moisture Cream for periorbital barrier recovery',
      ],
      providerName: this.name,
    };
  }
}
