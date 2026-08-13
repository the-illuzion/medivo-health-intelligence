import { Request, Response, NextFunction } from 'express';
import { InMemoryOrderRepository, GetOrderDetailsUseCase, Order } from '@medivo/service-api';
import { auditService } from '../services/audit.service.js';
import { notificationService } from '../services/notification.service.js';

const orderRepo = new InMemoryOrderRepository();
const getOrderDetailsUseCase = new GetOrderDetailsUseCase(orderRepo);

export const checkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, totalAmount } = req.body;
    const orderId = `MED-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = new Order({
      id: orderId,
      userId: 'usr-101',
      status: 'ORDER_CONFIRMED',
      trackingNumber: `FX-${Math.floor(1000000 + Math.random() * 9000000)}`,
      carrier: 'FedEx Clinical Express',
      estimatedDelivery: '3 Business Days',
      items: items.map((i: any) => ({
        id: `item-${i.id}`,
        name: i.name,
        price: i.price,
        qty: i.quantity,
      })),
      subtotal: totalAmount,
      shipping: 0,
      total: totalAmount,
      timeline: [
        { label: 'Order Received & Verified', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true, active: true },
        { label: 'Custom compounding in progress', time: 'Pending', done: false },
        { label: 'Quality inspection & dispatch', time: 'Pending', done: false },
        { label: 'In Transit via FedEx', time: 'Pending', done: false },
      ],
      createdAt: new Date(),
    });

    await orderRepo.save(newOrder);

    auditService.logEvent('PRESCRIPTION_ORDER_CREATED', 'sarah.j@example.com', `ORDER_${orderId}`);
    notificationService.push(
      'Order Confirmed',
      `Your prescription formulation order #${orderId} for $${totalAmount.toFixed(2)} has been placed.`
    );

    res.status(201).json({ success: true, data: newOrder.toDTO() });
  } catch (err) {
    next(err);
  }
};

export const getOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.id || 'MED-84920';
    const order = await getOrderDetailsUseCase.execute(orderId);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};
