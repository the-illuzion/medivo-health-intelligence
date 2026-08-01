export type OrderStatus = 'ORDER_CONFIRMED' | 'FORMULATED' | 'QUALITY_INSPECTION' | 'IN_TRANSIT' | 'DELIVERED';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface OrderTimelineStep {
  label: string;
  time: string;
  done: boolean;
  active?: boolean;
}

export interface OrderProps {
  id: string; // e.g. "MED-84920"
  userId: string;
  status: OrderStatus;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  timeline: OrderTimelineStep[];
  createdAt: Date;
}

export class Order {
  constructor(private props: OrderProps) {}

  get id(): string { return this.props.id; }

  toDTO() {
    return {
      ...this.props,
      createdAt: this.props.createdAt.toISOString(),
    };
  }
}
