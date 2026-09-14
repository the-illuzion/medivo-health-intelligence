import type { HealthDataProvider } from '../../domain/health/HealthSampleEntity.js';
import type {
  HealthConnection,
  IHealthRepository,
} from '../../domain/repositories/IHealthRepository.js';

export class GetHealthConnectionUseCase {
  constructor(private readonly healthRepository: IHealthRepository) {}

  async execute(userId: string, provider: HealthDataProvider): Promise<HealthConnection | null> {
    return this.healthRepository.findConnection(userId, provider);
  }
}
