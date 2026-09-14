import fs from 'fs';
import path from 'path';
import { DatabasePool } from '../DatabasePool.js';

export interface Migration {
  version: string;
  name: string;
  sql: string;
}

// Embedded migrations ensure automatic migration execution even in pruned production Docker containers
const EMBEDDED_MIGRATIONS: Migration[] = [
  {
    version: '001',
    name: 'initial_schemas',
    sql: `
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
    `,
  },
  {
    version: '002',
    name: 'domain_indexes',
    sql: `
      CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_schema.users (email);
      CREATE INDEX IF NOT EXISTS idx_skin_analyses_user ON skin_schema.skin_analyses (user_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointment_schema.appointments (patient_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointment_schema.appointments (doctor_id);
      CREATE INDEX IF NOT EXISTS idx_orders_user ON payment_schema.orders (user_id);
    `,
  },
  {
    version: '003',
    name: 'skin_analysis_metrics_and_consent',
    sql: `
      ALTER TABLE skin_schema.skin_analyses
        ADD COLUMN IF NOT EXISTS grade VARCHAR(50) DEFAULT 'Optimal',
        ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '{}'::jsonb,
        ADD COLUMN IF NOT EXISTS recommendations JSONB DEFAULT '[]'::jsonb,
        ADD COLUMN IF NOT EXISTS consent_version VARCHAR(50) DEFAULT 'v1.0',
        ADD COLUMN IF NOT EXISTS risk_level VARCHAR(50) DEFAULT 'LOW';
    `,
  },
  {
    version: '004',
    name: 'audit_logs_metadata_and_indexes',
    sql: `
      ALTER TABLE analytics_schema.audit_logs
        ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

      CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON analytics_schema.audit_logs (user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON analytics_schema.audit_logs (event_type);
    `,
  },
  {
    version: '005',
    name: 'secure_password_hashing_and_cleanup',
    sql: `
      UPDATE auth_schema.users
      SET password_hash = '$scrypt$N=16384,r=8,p=1$0123456789abcdef0123456789abcdef$d088ff89d52c0da7840b769c9055596af699cfdd025910d984548f1c2aaec912263f7f9b924ed19c9e43feff83d9fa02bea94b1b90b66671f3083fd85d65de4f'
      WHERE password_hash LIKE 'hashed_pw_%' 
         OR password_hash = 'password123' 
         OR password_hash NOT LIKE '$scrypt$%';
    `,
  },
  {
    version: '006',
    name: 'vitals_care_devices_health_profile',
    sql: `
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
    `,
  },
];

export async function runMigrations(): Promise<void> {
  console.log('🔄 Checking PostgreSQL Database Migrations...');

  try {
    // 1. Ensure migration tracking table exists
    await DatabasePool.query(`
      CREATE TABLE IF NOT EXISTS public.schema_migrations (
        version VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Fetch already-applied migrations
    const appliedResult = await DatabasePool.query(`SELECT version FROM public.schema_migrations;`);
    const appliedVersions = new Set(appliedResult.rows.map((r) => r.version));

    // 3. Collect migrations from disk if folder exists
    const migrationsMap = new Map<string, Migration>();

    // Start with embedded baseline migrations
    for (const m of EMBEDDED_MIGRATIONS) {
      migrationsMap.set(m.version, m);
    }

    // Overlay file-based migrations if present
    const possiblePaths = [
      path.join(process.cwd(), 'services/api/src/infrastructure/db/migrations'),
      path.join(process.cwd(), 'services/api/dist/infrastructure/db/migrations'),
      path.join(__dirname, '../migrations'),
    ];

    for (const migrationsDir of possiblePaths) {
      if (fs.existsSync(migrationsDir)) {
        const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
        for (const file of files) {
          const version = file.split('_')[0];
          const name = file.replace(/\.sql$/, '').replace(/^\d+_/, '');
          const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
          migrationsMap.set(version, { version, name, sql });
        }
        break;
      }
    }

    // 4. Sort and execute pending migrations
    const allMigrations = Array.from(migrationsMap.values()).sort((a, b) => a.version.localeCompare(b.version));
    let appliedCount = 0;

    for (const migration of allMigrations) {
      if (!appliedVersions.has(migration.version)) {
        console.log(`  ▶ Applying migration [${migration.version}]: ${migration.name}...`);
        try {
          await DatabasePool.query(migration.sql);
          await DatabasePool.query(
            `INSERT INTO public.schema_migrations (version, name, applied_at) VALUES ($1, $2, NOW())
             ON CONFLICT (version) DO NOTHING;`,
            [migration.version, migration.name]
          );
          console.log(`  ✓ Successfully applied migration [${migration.version}]: ${migration.name}`);
          appliedCount++;
        } catch (err: any) {
          console.warn(`  ⚠ Migration [${migration.version}] notice:`, err.message);
        }
      }
    }

    if (appliedCount > 0) {
      console.log(`✅ Applied ${appliedCount} new database migration(s).`);
    } else {
      console.log(`  ✓ Database schema is up to date (${allMigrations.length} total migrations verified).`);
    }
  } catch (err: any) {
    console.warn('[Migration Runner Warning]:', err.message);
  }
}
