import { ShenAIVitalsAnalysis, VitalsAnalysisProvider } from './types';

export interface ShenAIConfig {
  apiKey?: string;
  baseUrl?: string;
}

export class ShenAIVitalsProvider implements VitalsAnalysisProvider {
  public name = 'Shen AI Vitals API';
  private apiKey: string;
  private baseUrl: string;

  constructor(config?: ShenAIConfig) {
    this.apiKey = config?.apiKey || process.env.SHEN_AI_API_KEY || '';
    this.baseUrl = config?.baseUrl || 'https://api.shen.ai/v1';
  }

  public async analyzeVitalsStream(frameData: string): Promise<ShenAIVitalsAnalysis> {
    if (!this.apiKey) {
      console.warn('[ShenAIVitalsProvider] API key missing. Falling back to mock vitals telemetry.');
      return this.getMockVitals();
    }

    try {
      const response = await fetch(`${this.baseUrl}/vitals/rppg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ frame: frameData }),
      });

      if (!response.ok) {
        throw new Error(`Shen AI API Error: ${response.status}`);
      }

      const json = await response.json();
      return {
        heartRate: json.bpm ?? 72,
        respirationRate: json.rpm ?? 16,
        hrv: json.hrv_ms ?? 58,
        stressIndex: json.stress_index ?? 24,
        bloodPressure: {
          systolic: json.bp_sys ?? 118,
          diastolic: json.bp_dia ?? 76,
        },
        vascularAge: json.vascular_age ?? 25,
        signalQuality: json.signal_quality ?? 98,
      };
    } catch (err) {
      console.warn('[ShenAIVitalsProvider] Exception during request:', err);
      return this.getMockVitals();
    }
  }

  private getMockVitals(): ShenAIVitalsAnalysis {
    return {
      heartRate: 72,
      respirationRate: 16,
      hrv: 62,
      stressIndex: 22,
      bloodPressure: {
        systolic: 118,
        diastolic: 76,
      },
      vascularAge: 25,
      signalQuality: 98,
    };
  }
}
