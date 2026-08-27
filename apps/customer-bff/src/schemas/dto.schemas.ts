import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  skinType: z.string().optional().default('Combination'),
});

export const analyzeScanSchema = z.object({
  userId: z.string().optional(),
  imageBase64: z.string().min(10, 'imageBase64 skin payload is required'),
});

export const bookAppointmentSchema = z.object({
  doctorId: z.string().min(1, 'doctorId is required'),
  doctorName: z.string().min(1, 'doctorName is required'),
  date: z.string().min(1, 'date is required'),
  time: z.string().min(1, 'time is required'),
  condition: z.string().optional(),
});

export const checkoutSchema = z.object({
  items: z.array(z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })).min(1, 'At least one item required in cart'),
  totalAmount: z.number().positive(),
});

export const coachChatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

export const hipaaConsentSchema = z.object({
  consent: z.boolean(),
});
