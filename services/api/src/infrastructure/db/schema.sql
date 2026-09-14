-- ============================================================================
-- Medivo Health Intelligence Platform — PostgreSQL Multi-Schema Initialization
-- Clean Architecture & Modular Monolith Domain Schemas (13 Isolated Schemas)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create 13 Isolated Domain Schemas
CREATE SCHEMA IF NOT EXISTS auth_schema;
CREATE SCHEMA IF NOT EXISTS user_schema;
CREATE SCHEMA IF NOT EXISTS profile_schema;
CREATE SCHEMA IF NOT EXISTS skin_schema;
CREATE SCHEMA IF NOT EXISTS ai_schema;
CREATE SCHEMA IF NOT EXISTS report_schema;
CREATE SCHEMA IF NOT EXISTS health_schema;
CREATE SCHEMA IF NOT EXISTS doctor_schema;
CREATE SCHEMA IF NOT EXISTS appointment_schema;
CREATE SCHEMA IF NOT EXISTS commerce_schema;
CREATE SCHEMA IF NOT EXISTS payment_schema;
CREATE SCHEMA IF NOT EXISTS notification_schema;
CREATE SCHEMA IF NOT EXISTS analytics_schema;

-- ============================================================================
-- 1. auth_schema (Owner: Auth Service)
-- ============================================================================
CREATE TABLE IF NOT EXISTS auth_schema.users (
  id VARCHAR(100) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth_schema.roles (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  permissions JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS auth_schema.user_roles (
  user_id VARCHAR(100) NOT NULL,
  role_id VARCHAR(100) NOT NULL,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS auth_schema.sessions (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  device_ip VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. user_schema (Owner: Core API)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_schema.user_profiles (
  user_id VARCHAR(100) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500),
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_schema.user_preferences (
  user_id VARCHAR(100) PRIMARY KEY,
  marketing_opt_in BOOLEAN DEFAULT FALSE,
  theme VARCHAR(20) DEFAULT 'system'
);

-- ============================================================================
-- 3. profile_schema (Owner: Health Service — PHI)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profile_schema.health_profiles (
  user_id VARCHAR(100) PRIMARY KEY,
  date_of_birth DATE,
  biological_sex VARCHAR(20),
  blood_type VARCHAR(10),
  allergies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profile_schema.medical_history (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  condition VARCHAR(255) NOT NULL,
  diagnosed_date DATE,
  notes TEXT
);

-- ============================================================================
-- 4. skin_schema (Owner: AI Service)
-- ============================================================================
CREATE TABLE IF NOT EXISTS skin_schema.skin_analyses (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  image_s3_key VARCHAR(500) NOT NULL,
  overall_score INT NOT NULL,
  grade VARCHAR(50) DEFAULT 'Optimal',
  metrics JSONB DEFAULT '{}'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  consent_version VARCHAR(50) DEFAULT 'v1.0',
  risk_level VARCHAR(50) DEFAULT 'LOW',
  status VARCHAR(50) DEFAULT 'COMPLETED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skin_schema.skin_conditions (
  id VARCHAR(100) PRIMARY KEY,
  analysis_id VARCHAR(100) NOT NULL,
  condition_type VARCHAR(100) NOT NULL,
  severity_score NUMERIC(5,2) NOT NULL,
  bounding_box JSONB
);

-- ============================================================================
-- 5. ai_schema (Owner: AI Vision Inference Engine)
-- ============================================================================
CREATE TABLE IF NOT EXISTS ai_schema.inference_jobs (
  id VARCHAR(100) PRIMARY KEY,
  analysis_id VARCHAR(100) NOT NULL,
  model_version VARCHAR(50) NOT NULL,
  confidence_score NUMERIC(5,4),
  latency_ms INT,
  status VARCHAR(50) DEFAULT 'COMPLETED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_schema.model_registry (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  version VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. report_schema (Owner: Diagnostic Reporting)
-- ============================================================================
CREATE TABLE IF NOT EXISTS report_schema.clinical_reports (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  analysis_id VARCHAR(100),
  doctor_id VARCHAR(100),
  summary TEXT NOT NULL,
  recommendations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 7. health_schema (Owner: Daily Routines & Habit Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS health_schema.daily_routines (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  time_of_day VARCHAR(50) NOT NULL,
  steps JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS health_schema.routine_logs (
  id VARCHAR(100) PRIMARY KEY,
  routine_id VARCHAR(100) NOT NULL,
  user_id VARCHAR(100) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 8. doctor_schema (Owner: Clinician Provider Network)
-- ============================================================================
CREATE TABLE IF NOT EXISTS doctor_schema.doctors (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  specialization VARCHAR(150) NOT NULL,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  bio TEXT,
  rating NUMERIC(3,2) DEFAULT 5.00
);

-- ============================================================================
-- 9. appointment_schema (Owner: Telehealth Scheduling)
-- ============================================================================
CREATE TABLE IF NOT EXISTS appointment_schema.appointments (
  id VARCHAR(100) PRIMARY KEY,
  patient_id VARCHAR(100) NOT NULL,
  doctor_id VARCHAR(100) NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'SCHEDULED',
  meeting_link VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 10. commerce_schema (Owner: Skincare Formulation & Catalog)
-- ============================================================================
CREATE TABLE IF NOT EXISTS commerce_schema.products (
  id VARCHAR(100) PRIMARY KEY,
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_cents INT NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================================================
-- 11. payment_schema (Owner: Commerce Checkout & Invoicing)
-- ============================================================================
CREATE TABLE IF NOT EXISTS payment_schema.orders (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  total_amount_cents INT NOT NULL,
  stripe_pi_id VARCHAR(255),
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 12. notification_schema (Owner: Dispatcher & Push Alerts)
-- ============================================================================
CREATE TABLE IF NOT EXISTS notification_schema.notifications (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 13. analytics_schema (Owner: HIPAA Audit Logs & Platform Telemetry)
-- ============================================================================
CREATE TABLE IF NOT EXISTS analytics_schema.audit_logs (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100),
  event_type VARCHAR(100) NOT NULL,
  resource VARCHAR(200) NOT NULL,
  ip_hash VARCHAR(100),
  verification_status VARCHAR(100) DEFAULT 'CRYPTOGRAPHICALLY_VERIFIED',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE analytics_schema.audit_logs ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- ============================================================================
-- Extended Health & Wellness Tables (Migration 006)
-- ============================================================================

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

-- ============================================================================
-- Performance Indexes Across All Domains
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_schema.users (email);
CREATE INDEX IF NOT EXISTS idx_skin_analyses_user ON skin_schema.skin_analyses (user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointment_schema.appointments (patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointment_schema.appointments (doctor_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON payment_schema.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notification_schema.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON analytics_schema.audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON analytics_schema.audit_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_vitals_user_type ON health_schema.vitals_readings (user_id, metric_type);
CREATE INDEX IF NOT EXISTS idx_care_tasks_user_plan ON health_schema.care_tasks (user_id, plan_id);
CREATE INDEX IF NOT EXISTS idx_medications_user ON profile_schema.user_medications (user_id);
CREATE INDEX IF NOT EXISTS idx_care_network_user ON profile_schema.care_network (user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_user ON profile_schema.health_records (user_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_user ON user_schema.user_devices (user_id);
CREATE INDEX IF NOT EXISTS idx_insights_user ON ai_schema.health_insights (user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON ai_schema.health_alerts (user_id);
