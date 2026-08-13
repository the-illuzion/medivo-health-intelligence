import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Pool, Client } = pg;

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
    return pool.query(text, params);
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
      const sqlPath = path.join(process.cwd(), 'services/api/src/infrastructure/db/schema.sql');
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, 'utf-8');
        await DatabasePool.query(sql);
        console.log('  ✓ PostgreSQL 13 Domain Schemas Initialized Successfully.');
        return true;
      }
    } catch (err: any) {
      console.warn('[DatabasePool Schema Init Warning]:', err.message);
    }
    return false;
  }
}
