import { IAIProviderAdapter } from './IAIProviderAdapter.js';
import { PerfectCorpAdapter } from './PerfectCorpAdapter.js';
import { ShenAIAdapter } from './ShenAIAdapter.js';
import { SubDermalEngineAdapter } from './SubDermalEngineAdapter.js';
import { env } from '../config/env.js';

export class AIProviderFactory {
  public static getProvider(): IAIProviderAdapter {
    const perfectCorp = new PerfectCorpAdapter();
    const shen = new ShenAIAdapter();
    const subDermal = new SubDermalEngineAdapter();

    if (env.AI_PROVIDER_DEFAULT === 'PERFECT_CORP' && perfectCorp.isConfigured()) {
      return perfectCorp;
    }

    if (env.AI_PROVIDER_DEFAULT === 'SHEN' && shen.isConfigured()) {
      return shen;
    }

    // Auto resolution: Perfect Corp -> Shen -> SubDermal
    if (perfectCorp.isConfigured()) {
      console.log('[AIProviderFactory] Selected Provider: Perfect Corp API');
      return perfectCorp;
    }

    if (shen.isConfigured()) {
      console.log('[AIProviderFactory] Selected Provider: Shen AI');
      return shen;
    }

    console.log('[AIProviderFactory] Selected Provider: SubDermal Neural Telemetry Engine');
    return subDermal;
  }
}
