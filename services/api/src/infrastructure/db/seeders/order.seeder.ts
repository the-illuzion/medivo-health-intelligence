import { DatabasePool } from '../DatabasePool.js';

export async function seedOrders(): Promise<void> {
  const orders = [
    { id: 'MED-84920', userId: 'usr-101', status: 'IN_TRANSIT', totalCents: 9600, stripePi: 'pi_3M88...91a' },
    { id: 'MED-84921', userId: 'usr-102', status: 'FORMULATED', totalCents: 5800, stripePi: 'pi_3M88...91b' },
  ];

  for (const ord of orders) {
    try {
      await DatabasePool.query(
        `INSERT INTO payment_schema.orders (id, user_id, status, total_amount_cents, stripe_pi_id)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status`,
        [ord.id, ord.userId, ord.status, ord.totalCents, ord.stripePi]
      );
    } catch (err: any) {
      console.warn('[OrderSeeder Warning]:', err.message);
    }
  }
}
