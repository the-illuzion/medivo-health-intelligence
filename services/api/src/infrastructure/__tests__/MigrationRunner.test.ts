import { describe, it, expect, vi } from 'vitest';
import { runMigrations } from '../db/migrations/runner.js';
import { DatabasePool } from '../db/DatabasePool.js';

describe('Automatic Database Migration Runner', () => {
  it('should ensure schema_migrations table and execute pending migrations', async () => {
    const executedQueries: string[] = [];
    vi.spyOn(DatabasePool, 'query').mockImplementation(async (sql: string, params?: any[]) => {
      executedQueries.push(sql);
      if (sql.includes('SELECT version FROM public.schema_migrations')) {
        return { rows: [{ version: '001' }] } as any;
      }
      return { rows: [] } as any;
    });

    await runMigrations();

    expect(executedQueries.some((q) => q.includes('public.schema_migrations'))).toBe(true);
    // Should have checked version and attempted pending migrations (002, 003, 004)
    expect(executedQueries.some((q) => q.includes('INSERT INTO public.schema_migrations'))).toBe(true);

    vi.restoreAllMocks();
  });
});
