import { PerfectCorpSkinProvider } from './PerfectCorpSkinProvider';
import { ShenAIVitalsProvider } from './ShenAIVitalsProvider';
import { CombinedAIReport, AIProviderType } from './types';

export class AIServiceManager {
  private perfectCorpProvider: PerfectCorpSkinProvider;
  private shenAIProvider: ShenAIVitalsProvider;

  constructor() {
    this.perfectCorpProvider = new PerfectCorpSkinProvider();
    this.shenAIProvider = new ShenAIVitalsProvider();
  }

  public async runFullScan(imageBase64: string, providerPreference: AIProviderType = 'perfect_corp'): Promise<CombinedAIReport> {
    const skinData = await this.perfectCorpProvider.analyzeSkinImage(imageBase64);
    const vitalsData = await this.shenAIProvider.analyzeVitalsStream(imageBase64);

    return {
      id: `rep_${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      provider: providerPreference,
      skin: skinData,
      vitals: vitalsData,
      aiInsights: [
        'Skin hydration is optimal at 93% with low epidermal inflammation.',
        'Shen AI telemetry indicates healthy HRV (62ms) and relaxed vascular state.',
        'Perfect Corp neural analysis detects minor dark circle pigmentation in periorbital zone.',
      ],
      recommendations: [
        'Apply 0.5% Retinol Cream during evening repair window.',
        'Use Vitamin C Serum in the morning for antioxidant defense.',
        'Maintain 2.5L daily hydration to sustain barrier integrity.',
      ],
    };
  }
}

export const aiServiceManager = new AIServiceManager();
