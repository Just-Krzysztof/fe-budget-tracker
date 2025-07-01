import { z } from 'zod';

export const transactionSchema = z
  .object({
    amount: z.number().min(1, 'Amount is required'),
    type: z.enum(['INCOME', 'EXPENSE', 'SAVING']),
    currency: z.string().min(1, 'Currency is required'),
    date: z.string().min(1, 'Date is required'),
    description: z
      .string()
      .max(250, "Descriptio can't be longer than 250 characters"),
    tag: z.string().optional(),
    goal: z.string().optional(),
    tagName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const tagSet = !!data.tag && data.tag.trim() !== '';
    const goalSet = !!data.goal && data.goal.trim() !== '';
    if (tagSet && goalSet) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "You can't set both tag and goal. Choose one or leave both empty.",
        path: ['tag'],
      });
    }
    if (!tagSet && !goalSet) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'You must set either tag or goal.',
        path: ['tag'],
      });
    }
    const today = new Date();
    const selectedDate = new Date(data.date + 'T00:00:00'); 
  
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date can't be in future",
        path: ['date'],
      });
    }
  });

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  SAVING = 'SAVING',
}
export type Transaction = z.infer<typeof transactionSchema>;
