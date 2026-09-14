import type { HealthDataProvider } from '../../domain/health/HealthSampleEntity.js';
import type { IHealthRepository } from '../../domain/repositories/IHealthRepository.js';

export class DisconnectHealthConnectionUseCase {
  constructor(private readonly healthRepository: IHealthRepository) {}

  async execute(userId: string, provider: HealthDataProvider): Promise<void> {
    await this.healthRepository.disconnect(userId, provider);
  }
}
