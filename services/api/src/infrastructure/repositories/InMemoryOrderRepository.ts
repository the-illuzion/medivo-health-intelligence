import { Order } from '../../domain/ecommerce/OrderEntity.js';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository.js';

export class InMemoryOrderRepository implements IOrderRepository {
  private orders: Map<string, Order> = new Map();

  constructor() {
    const seedOrder = new Order({
      id: 'MED-84920',
      userId: 'usr-101',
      status: 'IN_TRANSIT',
      trackingNumber: '9400 1000 0000 8492 00',
      carrier: 'FedEx Express Priority',
      estimatedDelivery: 'Tomorrow 12:00 PM',
      items: [
        { id: '1', name: 'Hydra Renew Serum', price: 62, qty: 1 },
        { id: '2', name: 'Vitamin C Brightening Drops', price: 58, qty: 1 },
      ],
      subtotal: 120.00,
      shipping: 5.00,
      total: 125.00,
      timeline: [
        { label: 'Order Confirmed', time: 'Jul 30, 04:15 PM', done: true },
        { label: 'Formulation Prepared', time: 'Jul 30, 06:30 PM', done: true },
        { label: 'Quality Inspection', time: 'Jul 30, 08:00 PM', done: true },
        { label: 'In Transit (FedEx Express)', time: 'Jul 31, 09:00 AM', done: true, active: true },
        { label: 'Out for Delivery', time: 'Est. Tomorrow 12:00 PM', done: false },
      ],
      createdAt: new Date('2026-07-30T16:15:00Z'),
    });
    this.orders.set(seedOrder.id, seedOrder);
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) || null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter((o) => o.toDTO().userId === userId);
  }

  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }
}
