import { z } from 'zod';

export const goalSchema = z.object({
  targetAmount: z.number().min(1, 'Amount is required'),
  currency: z.string().min(1, 'Currency is required'),
  deadline: z.string(),
  name: z.string(),
});

export type Goal = z.infer<typeof goalSchema>;
