export interface ProductItem {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  tag: string;
}

export interface CheckoutResult {
  orderId: string;
  status: string;
  totalAmount: number;
  estimatedDelivery: string;
  createdAt: string;
}
