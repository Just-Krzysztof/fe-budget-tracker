import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from '../types/transaction';

export const useTransactionForm = () => {
  const form = useForm({
    resolver: zodResolver(transactionSchema),
    mode: 'onChange',
    defaultValues: {
      amount: '',
      type: 'INCOME' as const,
      date: new Date(),
      currency: 'PLN',
      description: '',
      tag: '',
      tagName: '',
      goal: '',
    },
  });

  const tagValue = useWatch({ control: form.control, name: 'tag' });
  const goalValue = useWatch({ control: form.control, name: 'goal' });

  return {
    ...form,
    tagValue,
    goalValue,
  };
};
