import { IAIProviderAdapter } from './IAIProviderAdapter.js';
import { PerfectCorpAdapter } from './PerfectCorpAdapter.js';
import { ShenAIAdapter } from './ShenAIAdapter.js';
import { UnifiedAIAdapter } from './UnifiedAIAdapter.js';
import { SubDermalEngineAdapter } from './SubDermalEngineAdapter.js';
import { env } from '../config/env.js';

export class AIProviderFactory {
  public static getProvider(): IAIProviderAdapter {
    const perfectCorp = new PerfectCorpAdapter();
    const shen = new ShenAIAdapter();
    const unified = new UnifiedAIAdapter();
    const subDermal = new SubDermalEngineAdapter();

    if (env.AI_PROVIDER_DEFAULT === 'PERFECT_CORP' && perfectCorp.isConfigured()) {
      return perfectCorp;
    }

    if (env.AI_PROVIDER_DEFAULT === 'SHEN' && shen.isConfigured()) {
      return shen;
    }

    if (env.AI_PROVIDER_DEFAULT === 'SIMULATED') {
      return subDermal;
    }

    // Default: Multi-Modal Unified Adapter (orchestrates PerfectCorp + Shen.ai)
    return unified;
  }
}
