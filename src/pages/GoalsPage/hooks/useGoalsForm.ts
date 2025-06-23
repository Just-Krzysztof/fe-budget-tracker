import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { goalSchema } from '../types/goal';

export const useGoalForm = () => {
  const form = useForm({
    resolver: zodResolver(goalSchema),
    mode: 'onChange',
    defaultValues: {
      targetAmount: 0,
      deadline: new Date(),
      currency: 'PLN',
      tag: '',
      name: '',
    },
  });

  return {
    ...form,
  };
};
