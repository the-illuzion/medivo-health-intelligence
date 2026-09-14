-- ============================================================================
-- Migration 006: Vitals, Care Plans, Devices, and Extended Health Profile Schemas
-- ============================================================================

-- 1. health_schema: Vitals Readings & Longitudinal Tracking
CREATE TABLE IF NOT EXISTS health_schema.vitals_readings (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  value_numeric NUMERIC(10,2),
  value_string VARCHAR(100),
  unit VARCHAR(20),
  baseline_value NUMERIC(10,2),
  change_pct NUMERIC(6,2),
  change_label VARCHAR(50),
  tone VARCHAR(50) DEFAULT 'blue',
  source VARCHAR(100) DEFAULT 'Manual',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vitals_user_type ON health_schema.vitals_readings (user_id, metric_type);
CREATE INDEX IF NOT EXISTS idx_vitals_recorded_at ON health_schema.vitals_readings (recorded_at DESC);

-- 2. health_schema: Care Plans & Scheduled Tasks
CREATE TABLE IF NOT EXISTS health_schema.care_plans (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  plan_date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  adherence_pct INT DEFAULT 0,
  care_team_notes JSONB DEFAULT '[]'::jsonb,
  why_it_matters TEXT,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, plan_date)
);

CREATE TABLE IF NOT EXISTS health_schema.care_tasks (
  id VARCHAR(100) PRIMARY KEY,
  plan_id VARCHAR(100),
  user_id VARCHAR(100) NOT NULL,
  period VARCHAR(50) NOT NULL,
  scheduled_time VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'pill',
  tone VARCHAR(50) DEFAULT 'blue',
  status VARCHAR(50) DEFAULT 'Pending',
  completed_at TIMESTAMP WITH TIME ZONE,
  task_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_care_tasks_user_plan ON health_schema.care_tasks (user_id, plan_id);

-- 3. profile_schema: User Medications
CREATE TABLE IF NOT EXISTS profile_schema.user_medications (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  instructions TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_medications_user ON profile_schema.user_medications (user_id);

-- 4. profile_schema: Care Network & Family/Clinician Team
CREATE TABLE IF NOT EXISTS profile_schema.care_network (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  member_name VARCHAR(255) NOT NULL,
  relationship VARCHAR(100) NOT NULL,
  role VARCHAR(100) DEFAULT 'Caregiver',
  is_active BOOLEAN DEFAULT TRUE,
  is_male BOOLEAN DEFAULT FALSE,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_care_network_user ON profile_schema.care_network (user_id);

-- 5. profile_schema: Health Records, Lab Reports & Prescriptions
CREATE TABLE IF NOT EXISTS profile_schema.health_records (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  record_type VARCHAR(50) NOT NULL,
  doctor_name VARCHAR(255),
  record_date DATE NOT NULL,
  s3_key VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_health_records_user ON profile_schema.health_records (user_id);

-- 6. user_schema: Connected Wearables & Health Devices
CREATE TABLE IF NOT EXISTS user_schema.user_devices (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  kind VARCHAR(50) NOT NULL,
  battery_level INT DEFAULT 100,
  battery_status VARCHAR(50) DEFAULT '1 day left',
  sync_label VARCHAR(100) DEFAULT 'Just now',
  sharing_scopes JSONB DEFAULT '[]'::jsonb,
  is_enabled BOOLEAN DEFAULT TRUE,
  needs_attention BOOLEAN DEFAULT FALSE,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_devices_user ON user_schema.user_devices (user_id);

-- 7. ai_schema: Weekly Health Insights & AI Biomarker Alerts
CREATE TABLE IF NOT EXISTS ai_schema.health_insights (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  highlight VARCHAR(100) NOT NULL,
  end_text VARCHAR(100) DEFAULT '',
  text TEXT NOT NULL,
  why TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL,
  tone VARCHAR(50) DEFAULT 'blue',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_schema.health_alerts (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT NOT NULL,
  severity VARCHAR(50) DEFAULT 'warning',
  metric_name VARCHAR(50) NOT NULL,
  current_val VARCHAR(50) NOT NULL,
  baseline_val VARCHAR(50) NOT NULL,
  possible_reasons TEXT NOT NULL,
  action_items JSONB DEFAULT '[]'::jsonb,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_insights_user ON ai_schema.health_insights (user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON ai_schema.health_alerts (user_id);
