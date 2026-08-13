import { Request, Response, NextFunction } from 'express';
import { CommerceService } from '../services/CommerceService.js';

const commerceService = new CommerceService();

export const listProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await commerceService.getProducts();
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

export const processCheckout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, totalAmount } = req.body;
    const result = await commerceService.checkout(userId, totalAmount);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
