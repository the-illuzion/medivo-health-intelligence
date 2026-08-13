import pg from 'pg';
import { getDatabaseConfig } from './config/database.config.js';

const { Client } = pg;

async function verifyDatabase() {
  const config = getDatabaseConfig();
  console.log(`🔍 Checking PostgreSQL Database Connection at ${config.host}:${config.port}/${config.database}...`);

  const client = new Client({ connectionString: config.connectionString });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL Server!');

    const tables = [
      'auth_schema.users',
      'doctor_schema.doctors',
      'commerce_schema.products',
      'skin_schema.skin_analyses',
      'appointment_schema.appointments',
      'payment_schema.orders',
    ];

    console.log('\n📊 Table Row Counts:');
    for (const table of tables) {
      try {
        const res = await client.query(`SELECT COUNT(*) FROM ${table}`);
        const count = res.rows[0].count;
        console.log(`  • ${table}: ${count} rows`);
      } catch (err: any) {
        console.log(`  • ${table}: Error reading (${err.message})`);
      }
    }
    await client.end();
  } catch (err: any) {
    console.error('❌ Could not connect to PostgreSQL server:', err.message);
    console.log('\n💡 Tip: Make sure your PostgreSQL server container is running:');
    console.log('   docker-compose up -d postgres');
  }
}

verifyDatabase();
