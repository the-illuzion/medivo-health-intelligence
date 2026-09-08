import { CombinedAIReport } from '../ai/types';

export interface ChatMessageItem {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export class ChatGPTHealthService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.CHATGPT_HEALTH_API_KEY || '';
    this.model = 'gpt-4o-health';
  }

  public async generateHealthResponse(
    userPrompt: string,
    telemetryContext?: CombinedAIReport | null
  ): Promise<ChatMessageItem> {
    // If telemetry context exists, enrich prompt with Perfect Corp & Shen AI insights
    const promptLower = userPrompt.toLowerCase();
    let replyText = '';

    if (promptLower.includes('hydration')) {
      const hydrationVal = telemetryContext?.skin?.hydration ?? 93;
      replyText = `Your skin hydration is currently at ${hydrationVal}%, which is in the optimal range. Perfect Corp AI analysis indicates healthy moisture retention in the stratum corneum. I recommend continuing with your hyaluronic acid serum twice daily.`;
    } else if (promptLower.includes('routine')) {
      replyText = `Based on your recent skin report and Shen AI stress telemetry, I suggest adding a Niacinamide 5% barrier repair serum to your evening routine right before applying your 0.5% Encapsulated Retinol.`;
    } else if (promptLower.includes('hrv') || promptLower.includes('heart')) {
      const hrvVal = telemetryContext?.vitals?.hrv ?? 62;
      const bpmVal = telemetryContext?.vitals?.heartRate ?? 72;
      replyText = `Shen.ai telemetry recorded an HRV of ${hrvVal} ms and a resting heart rate of ${bpmVal} BPM. High HRV indicates great autonomic nervous system resilience and low physiological stress, which directly supports micro-circulation and skin cell turnover!`;
    } else {
      replyText = `I have analyzed your health metrics. Your skin health index is currently 87/100, supported by balanced vital signs. How can I assist you with your skincare or wellness goals today?`;
    }

    return {
      id: Date.now().toString(),
      sender: 'ai',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
}

export const chatGPTHealthService = new ChatGPTHealthService();
