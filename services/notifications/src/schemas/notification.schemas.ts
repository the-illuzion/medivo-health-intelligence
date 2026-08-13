import { z } from 'zod';

export const sendNotificationSchema = z.object({
  userId: z.string().optional().default('usr-101'),
  title: z.string().min(1, 'title is required'),
  message: z.string().min(1, 'message is required'),
  channel: z.enum(['PUSH', 'EMAIL', 'SMS']).optional().default('PUSH'),
});

export type SendNotificationDTO = z.infer<typeof sendNotificationSchema>;
