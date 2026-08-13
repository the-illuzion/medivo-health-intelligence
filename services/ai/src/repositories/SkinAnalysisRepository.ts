import { TelemetryAnalysisResult } from '../models/TelemetryMetrics.js';

export class SkinAnalysisRepository {
  private scanStore: Map<string, TelemetryAnalysisResult> = new Map();

  public async save(result: TelemetryAnalysisResult): Promise<void> {
    this.scanStore.set(result.scanId, result);
  }

  public async findById(scanId: string): Promise<TelemetryAnalysisResult | null> {
    return this.scanStore.get(scanId) || null;
  }

  public async findByUserId(userId: string): Promise<TelemetryAnalysisResult[]> {
    return Array.from(this.scanStore.values()).filter((s) => s.userId === userId);
  }
}
