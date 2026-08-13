import { z } from 'zod';

export const checkoutSchema = z.object({
  userId: z.string().optional().default('usr-101'),
  items: z.array(z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })).min(1, 'Cart items required'),
  totalAmount: z.number().positive(),
});

export type CheckoutDTO = z.infer<typeof checkoutSchema>;
