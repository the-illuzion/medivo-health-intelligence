import { DatabasePool } from '../DatabasePool.js';

export async function seedScans(): Promise<void> {
  const scans = [
    { id: 'scn-901', userId: 'usr-101', s3Key: 's3://medivo/scans/scn-901.jpg', overallScore: 87, status: 'COMPLETED', date: '2026-07-28 09:15:00' },
    { id: 'scn-900', userId: 'usr-101', s3Key: 's3://medivo/scans/scn-900.jpg', overallScore: 83, status: 'COMPLETED', date: '2026-07-21 08:30:00' },
    { id: 'scn-899', userId: 'usr-102', s3Key: 's3://medivo/scans/scn-899.jpg', overallScore: 78, status: 'COMPLETED', date: '2026-07-14 11:20:00' },
  ];

  for (const scan of scans) {
    try {
      await DatabasePool.query(
        `INSERT INTO skin_schema.skin_analyses (id, user_id, image_s3_key, overall_score, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET overall_score = EXCLUDED.overall_score`,
        [scan.id, scan.userId, scan.s3Key, scan.overallScore, scan.status, scan.date]
      );
    } catch (err: any) {
      console.warn('[ScanSeeder Warning]:', err.message);
    }
  }
}
