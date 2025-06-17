import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from '../types/transaction';

export const useTransactionForm = () => {
  return useForm({
    resolver: zodResolver(transactionSchema),
    mode: 'onChange',
    defaultValues: {
      amount: '',
      type: 'INCOME' as const,
      date: new Date(),
      currency: 'PLN',
      description: '',
    },
  });
};
