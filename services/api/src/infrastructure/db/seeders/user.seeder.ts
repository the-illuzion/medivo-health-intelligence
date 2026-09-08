import { DatabasePool } from '../DatabasePool.js';
import { PasswordService } from '../../security/PasswordService.js';

export async function seedUsers(): Promise<void> {
  const defaultPasswordHash = PasswordService.hashSync('password123');

  const users = [
    { id: 'usr-101', email: 'sarah.j@example.com', name: 'Sarah Jenkins', password_hash: defaultPasswordHash, skin_type: 'Combination' },
    { id: 'usr-102', email: 'alex.m@example.com', name: 'Alex Morgan', password_hash: defaultPasswordHash, skin_type: 'Sensitive' },
    { id: 'usr-doc-1', email: 'dr.thorne@medivo.com', name: 'Dr. Aris Thorne, MD', password_hash: defaultPasswordHash, skin_type: 'Normal' },
    { id: 'usr-doc-2', email: 'dr.rostova@medivo.com', name: 'Dr. Elena Rostova, MD', password_hash: defaultPasswordHash, skin_type: 'Normal' },
  ];

  for (const user of users) {
    try {
      await DatabasePool.query(
        `INSERT INTO auth_schema.users (id, email, password_hash, status)
         VALUES ($1, $2, $3, 'ACTIVE')
         ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email`,
        [user.id, user.email, user.password_hash]
      );

      const [firstName, ...rest] = user.name.split(' ');
      const lastName = rest.join(' ') || 'User';

      await DatabasePool.query(
        `INSERT INTO user_schema.user_profiles (user_id, first_name, last_name, timezone)
         VALUES ($1, $2, $3, 'America/New_York')
         ON CONFLICT (user_id) DO UPDATE SET first_name = EXCLUDED.first_name`,
        [user.id, firstName, lastName]
      );
    } catch (err: any) {
      console.warn('[UserSeeder Warning]:', err.message);
    }
  }
}
