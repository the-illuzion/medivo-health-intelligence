import { z } from 'zod';

export const issueTokenSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN']).optional().default('PATIENT'),
});

export const verifyTokenSchema = z.object({
  token: z.string().min(10, 'token is required'),
});

export type IssueTokenDTO = z.infer<typeof issueTokenSchema>;
export type VerifyTokenDTO = z.infer<typeof verifyTokenSchema>;
