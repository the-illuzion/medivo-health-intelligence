import fs from 'fs';
import path from 'path';
import { DatabasePool } from '../DatabasePool.js';

export async function runMigrations(): Promise<void> {
  console.log('🔄 Executing PostgreSQL Database Migrations...');
  const migrationsDir = path.join(process.cwd(), 'services/api/src/infrastructure/db/migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('No migrations directory found.');
    return;
  }

  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    try {
      await DatabasePool.query(sql);
      console.log(`  ✓ Migration applied: ${file}`);
    } catch (err: any) {
      console.warn(`  ⚠ Migration warning for ${file}:`, err.message);
    }
  }
  console.log('✅ PostgreSQL Migrations Execution Complete.');
}
