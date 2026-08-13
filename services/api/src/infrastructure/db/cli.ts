import { runMigrations } from './migrations/runner.js';
import { runSeeders } from './seeders/index.js';
import { DatabasePool } from './DatabasePool.js';

async function main() {
  console.log('🚀 Starting Medivo PostgreSQL Database Setup...');
  try {
    const initialized = await DatabasePool.initializeSchemas();
    if (initialized) {
      console.log('  ✓ DatabasePool initialized baseline schemas.');
    }
    await runMigrations();
    await runSeeders();
    console.log('✨ All migrations and seeders executed successfully!');
  } catch (err: any) {
    console.warn('⚠ Database notice during execution:', err.message);
  } finally {
    try {
      const pool = DatabasePool.getPool();
      await pool.end();
    } catch (e) {}
  }
}

main();
