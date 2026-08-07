-- ============================================================================
-- Medivo Health Intelligence Platform — PostgreSQL Multi-Schema Initialization
-- Clean Architecture & Modular Monolith Domain Schemas
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth_schema.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  permissions JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS auth_schema.user_roles (
  user_id UUID NOT NULL,
  role_id UUID NOT NULL,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS auth_schema.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  device_ip VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. user_schema (Owner: Core API)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_schema.user_profiles (
  user_id UUID PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500),
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_schema.user_preferences (
  user_id UUID PRIMARY KEY,
  marketing_opt_in BOOLEAN DEFAULT FALSE,
  theme VARCHAR(20) DEFAULT 'system'
);

-- ============================================================================
-- 3. profile_schema (Owner: Health Service — PHI)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profile_schema.health_profiles (
  user_id UUID PRIMARY KEY,
  date_of_birth DATE,
  biological_sex VARCHAR(20),
  blood_type VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profile_schema.medical_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  condition VARCHAR(255) NOT NULL,
  diagnosed_date DATE,
  notes TEXT
);

-- ============================================================================
-- 4. skin_schema (Owner: AI Service)
-- ============================================================================
CREATE TABLE IF NOT EXISTS skin_schema.skin_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  image_s3_key VARCHAR(500) NOT NULL,
  overall_score INT NOT NULL,
  status VARCHAR(50) DEFAULT 'COMPLETED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skin_schema.skin_conditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID NOT NULL,
  condition_type VARCHAR(100) NOT NULL,
  severity_score NUMERIC(5,2) NOT NULL,
  bounding_box JSONB
);

-- ============================================================================
-- 5. doctor_schema & appointment_schema (Owner: Appointments Service)
-- ============================================================================
CREATE TABLE IF NOT EXISTS doctor_schema.doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  specialization VARCHAR(150) NOT NULL,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  bio TEXT
);

CREATE TABLE IF NOT EXISTS appointment_schema.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'SCHEDULED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. commerce_schema & payment_schema (Owner: Commerce Service)
-- ============================================================================
CREATE TABLE IF NOT EXISTS commerce_schema.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_cents INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS payment_schema.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  total_amount_cents INT NOT NULL,
  stripe_pi_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
