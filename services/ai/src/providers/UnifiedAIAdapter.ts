import { IAIProviderAdapter, AIProviderResult } from './IAIProviderAdapter.js';
import { PerfectCorpAdapter } from './PerfectCorpAdapter.js';
import { ShenAIAdapter } from './ShenAIAdapter.js';
import { SubDermalEngineAdapter } from './SubDermalEngineAdapter.js';
import { createLogger } from '@medivo/utils';

const logger = createLogger('unified-ai-adapter');

export class UnifiedAIAdapter implements IAIProviderAdapter {
  public name = 'Medivo Multi-Modal Optical Telemetry Engine';
  private perfectCorp = new PerfectCorpAdapter();
  private shen = new ShenAIAdapter();
  private subDermal = new SubDermalEngineAdapter();

  public isConfigured(): boolean {
    return this.perfectCorp.isConfigured() || this.shen.isConfigured() || this.subDermal.isConfigured();
  }

  public async analyzeImage(imageBase64: string): Promise<AIProviderResult> {
    const perfectConfigured = this.perfectCorp.isConfigured();
    const shenConfigured = this.shen.isConfigured();

    // 1. Both SDKs/APIs configured: Parallel Multi-Modal Execution
    if (perfectConfigured && shenConfigured) {
      logger.info('[UnifiedAIAdapter] Executing dual skin analysis + rPPG vitals optical telemetry pipelines...');
      const [perfectRes, shenRes] = await Promise.allSettled([
        this.perfectCorp.analyzeImage(imageBase64),
        this.shen.analyzeImage(imageBase64),
      ]);

      const perfectData = perfectRes.status === 'fulfilled' ? perfectRes.value : null;
      const shenData = shenRes.status === 'fulfilled' ? shenRes.value : null;

      if (perfectData && shenData) {
        // Fuse skin metrics with rPPG vitals
        const fusedMetrics = {
          ...perfectData.metrics,
          heartRate: shenData.metrics.heartRate || perfectData.metrics.heartRate,
          stressIndex: shenData.metrics.stressIndex || perfectData.metrics.stressIndex,
        };

        const overallScore = Math.round((perfectData.overallScore * 0.7) + (shenData.overallScore * 0.3));
        const combinedRecs = Array.from(new Set([...(perfectData.recommendations || []), ...(shenData.recommendations || [])])).slice(0, 4);

        return {
          overallScore,
          grade: perfectData.grade || (overallScore >= 85 ? 'Optimal Grade' : overallScore >= 70 ? 'Good Condition' : 'Attention Advised'),
          metrics: fusedMetrics,
          recommendations: combinedRecs,
          riskLevel: perfectData.riskLevel || shenData.riskLevel || 'LOW',
          providerName: 'Medivo Multi-Modal Optical Telemetry Engine',
        };
      } else if (perfectData) {
        return perfectData;
      } else if (shenData) {
        return shenData;
      }
    }

    // 2. Only Perfect Corp configured
    if (perfectConfigured) {
      logger.info('[UnifiedAIAdapter] Delegating to PerfectCorp API...');
      return this.perfectCorp.analyzeImage(imageBase64);
    }

    // 3. Only Shen.ai configured
    if (shenConfigured) {
      logger.info('[UnifiedAIAdapter] Delegating to Shen.ai API...');
      return this.shen.analyzeImage(imageBase64);
    }

    // 4. Local High-Fidelity SubDermal Engine fallback
    logger.info('[UnifiedAIAdapter] Utilizing SubDermal Neural Telemetry Engine...');
    return this.subDermal.analyzeImage(imageBase64);
  }
}
