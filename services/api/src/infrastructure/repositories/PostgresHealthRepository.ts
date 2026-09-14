import type {
  HealthDataProvider,
  HealthMetricType,
  HealthSample,
} from '../../domain/health/HealthSampleEntity.js';
import type {
  HealthConnection,
  HealthSyncResult,
  IHealthRepository,
} from '../../domain/repositories/IHealthRepository.js';
import { DatabasePool } from '../db/DatabasePool.js';

interface HealthConnectionRow {
  provider: HealthDataProvider;
  requested_metrics: HealthMetricType[];
  connected_at: Date;
  last_synced_at: Date | null;
}

export class PostgresHealthRepository implements IHealthRepository {
  async sync(
    userId: string,
    provider: HealthDataProvider,
    samples: readonly HealthSample[],
    deletedExternalIds: readonly string[],
    requestedMetrics: readonly HealthMetricType[],
  ): Promise<HealthSyncResult> {
    const client = await DatabasePool.getPool().connect();
    const lastSyncedAt = new Date();

    try {
      await client.query('BEGIN');

      if (samples.length > 0) {
        const params: Array<string | number | Date | null> = [];
        const columnsPerSample = 11;
        const valuesSql = samples
          .map((sample, index) => {
            const offset = index * columnsPerSample;
            params.push(
              userId,
              provider,
              sample.externalId,
              sample.metricType,
              sample.value,
              sample.unit,
              sample.startAt,
              sample.endAt,
              sample.sourceName ?? null,
              sample.sourceBundleId ?? null,
              sample.deviceName ?? null,
            );
            const placeholders = Array.from(
              { length: columnsPerSample },
              (_value, columnIndex) => `$${offset + columnIndex + 1}`,
            );
            return `(${placeholders.join(', ')})`;
          })
          .join(', ');

        await client.query(
          `INSERT INTO health_schema.health_samples (
             user_id,
             provider,
             external_id,
             metric_type,
             numeric_value,
             unit,
             start_at,
             end_at,
             source_name,
             source_bundle_id,
             device_name
           ) VALUES ${valuesSql}
           ON CONFLICT (user_id, provider, external_id)
           DO UPDATE SET
             metric_type = EXCLUDED.metric_type,
             numeric_value = EXCLUDED.numeric_value,
             unit = EXCLUDED.unit,
             start_at = EXCLUDED.start_at,
             end_at = EXCLUDED.end_at,
             source_name = EXCLUDED.source_name,
             source_bundle_id = EXCLUDED.source_bundle_id,
             device_name = EXCLUDED.device_name,
             updated_at = CURRENT_TIMESTAMP,
             deleted_at = NULL`,
          params,
        );
      }

      let deletedSamples = 0;
      if (deletedExternalIds.length > 0) {
        const deletionResult = await client.query(
          `UPDATE health_schema.health_samples
           SET deleted_at = CURRENT_TIMESTAMP,
               updated_at = CURRENT_TIMESTAMP
           WHERE user_id = $1
             AND provider = $2
             AND external_id = ANY($3::varchar[])
             AND deleted_at IS NULL
           RETURNING external_id`,
          [userId, provider, deletedExternalIds],
        );
        deletedSamples = deletionResult.rowCount ?? 0;
      }

      await client.query(
        `INSERT INTO health_schema.health_connections (
           user_id,
           provider,
           status,
           requested_metrics,
           connected_at,
           last_synced_at
         ) VALUES ($1, $2, 'CONNECTED', $3::text[], CURRENT_TIMESTAMP, $4)
         ON CONFLICT (user_id, provider)
         DO UPDATE SET
           status = 'CONNECTED',
           requested_metrics = EXCLUDED.requested_metrics,
           last_synced_at = EXCLUDED.last_synced_at,
           updated_at = CURRENT_TIMESTAMP,
           deleted_at = NULL`,
        [userId, provider, requestedMetrics, lastSyncedAt],
      );

      await client.query('COMMIT');

      return {
        processedSamples: samples.length,
        deletedSamples,
        lastSyncedAt,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async disconnect(userId: string, provider: HealthDataProvider): Promise<void> {
    await DatabasePool.query(
      `UPDATE health_schema.health_connections
       SET status = 'DISCONNECTED',
           requested_metrics = ARRAY[]::text[],
           last_synced_at = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1
         AND provider = $2
         AND deleted_at IS NULL`,
      [userId, provider],
    );
  }

  async findConnection(
    userId: string,
    provider: HealthDataProvider,
  ): Promise<HealthConnection | null> {
    const result = await DatabasePool.query(
      `SELECT provider, requested_metrics, connected_at, last_synced_at
       FROM health_schema.health_connections
       WHERE user_id = $1
         AND provider = $2
         AND status = 'CONNECTED'
         AND deleted_at IS NULL
       LIMIT 1`,
      [userId, provider],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0] as HealthConnectionRow;
    return {
      provider: row.provider,
      status: 'connected',
      requestedMetrics: row.requested_metrics ?? [],
      connectedAt: new Date(row.connected_at),
      lastSyncedAt: row.last_synced_at ? new Date(row.last_synced_at) : null,
    };
  }
}
