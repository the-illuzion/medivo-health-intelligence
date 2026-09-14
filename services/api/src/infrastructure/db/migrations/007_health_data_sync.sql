CREATE TABLE IF NOT EXISTS health_schema.health_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(100) NOT NULL,
  provider VARCHAR(50) NOT NULL CHECK (provider IN ('apple_health', 'health_connect')),
  status VARCHAR(20) NOT NULL DEFAULT 'CONNECTED' CHECK (status IN ('CONNECTED', 'DISCONNECTED')),
  requested_metrics TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT uq_health_connections_user_provider UNIQUE (user_id, provider)
);

CREATE TABLE IF NOT EXISTS health_schema.health_samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(100) NOT NULL,
  provider VARCHAR(50) NOT NULL CHECK (provider IN ('apple_health', 'health_connect')),
  external_id VARCHAR(255) NOT NULL,
  metric_type VARCHAR(80) NOT NULL CHECK (
    metric_type IN (
      'step_count',
      'heart_rate',
      'resting_heart_rate',
      'active_energy_burned',
      'sleep_analysis',
      'heart_rate_variability_sdnn'
    )
  ),
  numeric_value DOUBLE PRECISION NOT NULL,
  unit VARCHAR(50) NOT NULL,
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE NOT NULL,
  source_name VARCHAR(255),
  source_bundle_id VARCHAR(255),
  device_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT uq_health_samples_user_provider_external UNIQUE (user_id, provider, external_id)
);

CREATE INDEX IF NOT EXISTS idx_health_connections_user
  ON health_schema.health_connections (user_id, provider)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_health_samples_user_metric_start
  ON health_schema.health_samples (user_id, metric_type, start_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_health_samples_user_provider_external
  ON health_schema.health_samples (user_id, provider, external_id);
