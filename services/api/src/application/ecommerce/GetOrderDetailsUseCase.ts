import { IOrderRepository } from '../../domain/repositories/IOrderRepository.js';

export class GetOrderDetailsUseCase {
  constructor(private orderRepo: IOrderRepository) {}

  async execute(orderId: string) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    return order.toDTO();
  }
}
