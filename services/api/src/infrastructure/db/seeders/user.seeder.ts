import { DatabasePool } from '../DatabasePool.js';

export async function seedUsers(): Promise<void> {
  const users = [
    { id: 'usr-101', email: 'sarah.j@example.com', name: 'Sarah Jenkins', password_hash: 'hashed_pw_123' },
    { id: 'usr-102', email: 'alex.m@example.com', name: 'Alex Morgan', password_hash: 'hashed_pw_456' },
  ];

  for (const user of users) {
    try {
      await DatabasePool.query(
        `INSERT INTO auth_schema.users (id, email, password_hash, status)
         VALUES ($1, $2, $3, 'ACTIVE')
         ON CONFLICT (email) DO NOTHING`,
        [user.id, user.email, user.password_hash]
      );
    } catch (err) {}
  }
}
