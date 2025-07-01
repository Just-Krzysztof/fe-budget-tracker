import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import {
  transactionsApi,
  type Transaction,
  type FilterTransaction,
  type CreateTransaction,
} from '../api/transactions.api';

export const useTransactions = (filters?: Partial<FilterTransaction>) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: transactions = { transactions: [], total: 0, hasMore: false },
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['transactions', user?.id, filters],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');

      return transactionsApi.getTransactions(
        { ...filters, userId: user.id },
        () => navigate('/auth/login')
      );
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
  });
  // console.log('filters', filters);

  const createTransaction = useMutation({
    mutationFn: (transactionData: Omit<CreateTransaction, 'userId'>) => {
      if (!user?.id) throw Error('User is not authenticated');
      return transactionsApi.createTransaction({
        ...transactionData,
        userId: user.id,
      });
    },
    onSuccess: (newTransaction) => {
      queryClient.setQueryData(
        ['transactions', user?.id],
        (oldData?: { transactions: Transaction[] }) => ({
          ...(oldData ?? { transactions: [], filters }),
          transactions: [...(oldData?.transactions ?? []), newTransaction],
        })
      );
    },
  });
  return {
    transactions,
    isLoadingTransaction: isLoading,
    error,
    isRefetchTransaction: refetch,
    createTransaction: createTransaction.mutateAsync,
    isCreatingTransaction: createTransaction.isPending,
  };
};
