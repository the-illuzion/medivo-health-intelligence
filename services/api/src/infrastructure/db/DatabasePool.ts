import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Pool, Client } = pg;

const BASELINE_SCHEMAS_SQL = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

CREATE TABLE IF NOT EXISTS skin_schema.skin_analyses (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  image_s3_key VARCHAR(500) NOT NULL,
  overall_score INT NOT NULL,
  grade VARCHAR(100),
  metrics JSONB DEFAULT '{}'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  consent_version VARCHAR(50) DEFAULT 'v1.0',
  risk_level VARCHAR(50) DEFAULT 'LOW',
  status VARCHAR(50) DEFAULT 'COMPLETED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE skin_schema.skin_analyses ADD COLUMN IF NOT EXISTS grade VARCHAR(100);
ALTER TABLE skin_schema.skin_analyses ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '{}'::jsonb;
ALTER TABLE skin_schema.skin_analyses ADD COLUMN IF NOT EXISTS recommendations JSONB DEFAULT '[]'::jsonb;
ALTER TABLE skin_schema.skin_analyses ADD COLUMN IF NOT EXISTS consent_version VARCHAR(50) DEFAULT 'v1.0';
ALTER TABLE skin_schema.skin_analyses ADD COLUMN IF NOT EXISTS risk_level VARCHAR(50) DEFAULT 'LOW';

CREATE TABLE IF NOT EXISTS skin_schema.skin_conditions (
  id VARCHAR(100) PRIMARY KEY,
  analysis_id VARCHAR(100) NOT NULL,
  condition_type VARCHAR(100) NOT NULL,
  severity_score NUMERIC(5,2) NOT NULL,
  bounding_box JSONB
);

CREATE TABLE IF NOT EXISTS ai_schema.inference_jobs (
  id VARCHAR(100) PRIMARY KEY,
  analysis_id VARCHAR(100) NOT NULL,
  model_version VARCHAR(50) NOT NULL,
  confidence_score NUMERIC(5,4),
  latency_ms INT,
  status VARCHAR(50) DEFAULT 'COMPLETED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS report_schema.clinical_reports (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  analysis_id VARCHAR(100),
  doctor_id VARCHAR(100),
  summary TEXT NOT NULL,
  recommendations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS health_schema.daily_routines (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  time_of_day VARCHAR(50) NOT NULL,
  steps JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS doctor_schema.doctors (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  specialization VARCHAR(150) NOT NULL,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  bio TEXT,
  rating NUMERIC(3,2) DEFAULT 5.00
);

CREATE TABLE IF NOT EXISTS appointment_schema.appointments (
  id VARCHAR(100) PRIMARY KEY,
  patient_id VARCHAR(100) NOT NULL,
  doctor_id VARCHAR(100) NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'SCHEDULED',
  meeting_link VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS payment_schema.orders (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  total_amount_cents INT NOT NULL,
  stripe_pi_id VARCHAR(255),
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notification_schema.notifications (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_schema.users (email);
CREATE INDEX IF NOT EXISTS idx_skin_analyses_user ON skin_schema.skin_analyses (user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointment_schema.appointments (patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointment_schema.appointments (doctor_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON payment_schema.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON analytics_schema.audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON analytics_schema.audit_logs (event_type);
`;

export class DatabasePool {
  private static instance: pg.Pool | null = null;

  public static getPool(): pg.Pool {
    if (!DatabasePool.instance) {
      const connectionString =
        process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medivo';

      DatabasePool.instance = new Pool({
        connectionString,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      DatabasePool.instance.on('error', (err) => {
        console.warn('[PostgreSQL Pool Warning]:', err.message);
      });
    }

    return DatabasePool.instance;
  }

  public static async query(text: string, params?: any[]): Promise<pg.QueryResult> {
    const pool = DatabasePool.getPool();
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      if (duration > 1000) {
        console.warn(`[DatabasePool] ⚠️ Slow Query Alert (${duration}ms): ${text.replace(/\s+/g, ' ').substring(0, 100)}...`);
      }
      return res;
    } catch (err: any) {
      const duration = Date.now() - start;
      console.warn(`[DatabasePool Error (${duration}ms)]: ${err.message} | Query: ${text.replace(/\s+/g, ' ').substring(0, 100)}`);
      throw err;
    }
  }

  public static async ensureDatabaseExists(): Promise<void> {
    try {
      const defaultConnectionString =
        process.env.DATABASE_URL_DEFAULT || 'postgresql://postgres:postgres@localhost:5432/postgres';
      const client = new Client({ connectionString: defaultConnectionString });
      await client.connect();
      const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'medivo'");
      if (res.rowCount === 0) {
        await client.query('CREATE DATABASE medivo');
        console.log("  ✓ Created PostgreSQL database 'medivo'");
      }
      await client.end();
    } catch (e) {
      // Database exists or host unreachable
    }
  }

  public static async initializeSchemas(): Promise<boolean> {
    await DatabasePool.ensureDatabaseExists();
    try {
      // 1. Try file-based execution if available
      const sqlPath = path.join(process.cwd(), 'services/api/src/infrastructure/db/schema.sql');
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, 'utf-8');
        await DatabasePool.query(sql);
        console.log('  ✓ PostgreSQL 13 Domain Schemas Initialized from schema.sql.');
        return true;
      }

      // 2. Otherwise execute embedded baseline DDL
      await DatabasePool.query(BASELINE_SCHEMAS_SQL);
      console.log('  ✓ PostgreSQL 13 Domain Schemas Initialized from embedded DDL.');
      return true;
    } catch (err: any) {
      console.warn('[DatabasePool Schema Init Warning]:', err.message);
    }
    return false;
  }
}
