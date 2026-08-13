import { DatabasePool } from '../DatabasePool.js';

export async function seedProducts(): Promise<void> {
  const products = [
    { id: 'prod-1', sku: 'MED-CLEANSER-01', name: 'Balancing Clay Cleanser', desc: 'pH-balanced gentle facial clay cleanser.', price_cents: 3400 },
    { id: 'prod-2', sku: 'MED-SERUM-01', name: 'Vitamin C Brightening Drops', desc: '15% L-Ascorbic Acid antioxidant serum.', price_cents: 5800 },
    { id: 'prod-3', sku: 'MED-SERUM-02', name: 'Hydra Renew Serum', desc: 'Triple-weight hyaluronic acid hydration serum.', price_cents: 6200 },
    { id: 'prod-4', sku: 'MED-SPF-01', name: 'Mineral SPF 50 Shield', desc: 'Broad-spectrum mineral sunscreen zinc oxide 20%.', price_cents: 4200 },
    { id: 'prod-5', sku: 'MED-CREAM-01', name: 'Ceramide Barrier Cream', desc: 'Restorative barrier cream with multi-peptides.', price_cents: 4600 },
  ];

  for (const prod of products) {
    try {
      await DatabasePool.query(
        `INSERT INTO commerce_schema.products (id, sku, name, description, price_cents)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET price_cents = EXCLUDED.price_cents`,
        [prod.id, prod.sku, prod.name, prod.desc, prod.price_cents]
      );
    } catch (err: any) {
      console.warn('[ProductSeeder Warning]:', err.message);
    }
  }
}
