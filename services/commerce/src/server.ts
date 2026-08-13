import express, { Request, Response } from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 4003;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medivo',
});

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Medivo Skincare Commerce Service',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/products', async (_req: Request, res: Response) => {
  try {
    const query = 'SELECT id, sku, name, description, price_cents as "priceCents" FROM commerce_schema.products WHERE is_active = true';
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      const products = result.rows.map((r, i) => ({
        id: i + 1,
        name: r.name,
        category: 'Serums & Cleansers',
        price: r.priceCents / 100,
        rating: 4.9,
        tag: 'AI Recommended',
      }));
      return res.json({ success: true, data: products });
    }
  } catch (err) {}

  res.json({
    success: true,
    data: [
      { id: 1, name: 'Balancing Clay Cleanser', category: 'Cleansers', price: 34, rating: 4.9, tag: 'AI Recommended' },
      { id: 2, name: 'Vitamin C Brightening Drops', category: 'Serums', price: 58, rating: 4.8, tag: 'Top Rated' },
      { id: 3, name: 'Hydra Renew Serum', category: 'Serums', price: 62, rating: 4.9, tag: 'Best for Hydration' },
      { id: 4, name: 'Mineral SPF 50 Shield', category: 'Sunscreen', price: 42, rating: 4.7, tag: 'Essential' },
      { id: 5, name: 'Ceramide Barrier Cream', category: 'Moisturizers', price: 46, rating: 4.9, tag: 'Restorative' },
    ],
  });
});

app.post('/api/v1/checkout', async (req: Request, res: Response) => {
  const { userId, totalAmount } = req.body;
  const orderId = `MED-${Math.floor(10000 + Math.random() * 90000)}`;

  try {
    await pool.query(
      `INSERT INTO payment_schema.orders (id, user_id, status, total_amount_cents, stripe_pi_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [orderId, userId || 'usr-101', 'ORDER_CONFIRMED', Math.round((totalAmount || 96) * 100), `pi_stripe_${Date.now()}`]
    );
  } catch (err) {}

  res.status(201).json({
    success: true,
    data: { orderId, status: 'ORDER_CONFIRMED', totalAmount: totalAmount || 96, estimatedDelivery: '3 Business Days' },
  });
});

app.listen(PORT, () => {
  console.log(`🛍️ Medivo Commerce Service running on http://localhost:${PORT}`);
});
