import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .transform((val) => parseFloat(val)),
  type: z.enum(['INCOME', 'EXPANSE', 'SAVING']),
  currency: z.string().min(1, 'Currency is required'),
  date: z.date(),
  description: z
    .string()
    .max(250, "Descriptio can't be longer than 250 characters"),
});

export type Transaction = z.infer<typeof transactionSchema>;
