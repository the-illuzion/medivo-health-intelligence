import { Request, Response, NextFunction } from 'express';

const productsList = [
  { id: 1, name: 'Balancing Clay Cleanser', category: 'Cleansers', price: 34, rating: 4.9, tag: 'AI Recommended' },
  { id: 2, name: 'Vitamin C Brightening Drops', category: 'Serums', price: 58, rating: 4.8, tag: 'Top Rated' },
  { id: 3, name: 'Hydra Renew Serum', category: 'Serums', price: 62, rating: 4.9, tag: 'Best for Hydration' },
  { id: 4, name: 'Mineral SPF 50 Shield', category: 'Sunscreen', price: 42, rating: 4.7, tag: 'Essential' },
  { id: 5, name: 'Ceramide Barrier Cream', category: 'Moisturizers', price: 46, rating: 4.9, tag: 'Restorative' },
];

export const listProducts = (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, data: productsList });
  } catch (err) {
    next(err);
  }
};
