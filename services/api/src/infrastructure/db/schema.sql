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
CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON analytics_schema.audit_logs (event_type);
