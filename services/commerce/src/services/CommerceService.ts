import { ProductItem, CheckoutResult } from '../models/Product.js';
import { PostgresCommerceRepository } from '../repositories/PostgresCommerceRepository.js';

export class CommerceService {
  constructor(private repo: PostgresCommerceRepository = new PostgresCommerceRepository()) {}

  public async getProducts(): Promise<ProductItem[]> {
    return this.repo.findProducts();
  }

  public async checkout(userId: string, totalAmount: number): Promise<CheckoutResult> {
    return this.repo.createOrder(userId, totalAmount);
  }
}
