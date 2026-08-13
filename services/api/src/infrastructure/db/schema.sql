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

-- Drop existing tables to refresh column types cleanly
DROP TABLE IF EXISTS appointment_schema.appointments CASCADE;
DROP TABLE IF EXISTS doctor_schema.doctors CASCADE;
DROP TABLE IF EXISTS skin_schema.skin_conditions CASCADE;
DROP TABLE IF EXISTS skin_schema.skin_analyses CASCADE;
DROP TABLE IF EXISTS user_schema.user_preferences CASCADE;
DROP TABLE IF EXISTS user_schema.user_profiles CASCADE;
DROP TABLE IF EXISTS auth_schema.sessions CASCADE;
DROP TABLE IF EXISTS auth_schema.user_roles CASCADE;
DROP TABLE IF EXISTS auth_schema.roles CASCADE;
DROP TABLE IF EXISTS auth_schema.users CASCADE;
DROP TABLE IF EXISTS payment_schema.orders CASCADE;
DROP TABLE IF EXISTS commerce_schema.products CASCADE;

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
-- 5. doctor_schema & appointment_schema (Owner: Appointments Service)
-- ============================================================================
CREATE TABLE IF NOT EXISTS doctor_schema.doctors (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  specialization VARCHAR(150) NOT NULL,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  bio TEXT
);

CREATE TABLE IF NOT EXISTS appointment_schema.appointments (
  id VARCHAR(100) PRIMARY KEY,
  patient_id VARCHAR(100) NOT NULL,
  doctor_id VARCHAR(100) NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'SCHEDULED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. commerce_schema & payment_schema (Owner: Commerce Service)
-- ============================================================================
CREATE TABLE IF NOT EXISTS commerce_schema.products (
  id VARCHAR(100) PRIMARY KEY,
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_cents INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS payment_schema.orders (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  total_amount_cents INT NOT NULL,
  stripe_pi_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
