import { z } from 'zod';

export const transactionSchema = z
  .object({
    amount: z.number().min(1, 'Amount is required'),
    type: z.enum(['INCOME', 'EXPENSE', 'SAVING']),
    currency: z.string().min(1, 'Currency is required'),
    date: z.date(),
    description: z
      .string()
      .max(250, "Descriptio can't be longer than 250 characters"),
    tag: z.string(),
    goal: z.string(),
    tagName: z.string(),
  })
  .refine(
    (data) => {
      const hasTag = data.tag && data.tag.trim() !== '';
      const hasGoal = data.goal && data.goal.trim() !== '';

      return !(hasTag && hasGoal);
    },
    {
      message:
        "You can't set both tag and goal. Choose one or leave both empty.",
      path: ['tag'],
    }
  );

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  SAVING = 'SAVING',
}
export type Transaction = z.infer<typeof transactionSchema>;
