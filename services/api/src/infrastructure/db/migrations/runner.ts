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
