import { z } from 'zod';

export const analyzeSkinSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  imageBase64: z.string().min(10, 'imageBase64 skin scan image payload is required'),
});

export type AnalyzeSkinDTO = z.infer<typeof analyzeSkinSchema>;
