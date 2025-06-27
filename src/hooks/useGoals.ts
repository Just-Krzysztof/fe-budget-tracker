import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { goalsApi, type Goal } from '../api/goals.api';

export const useGoals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: goals = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: () => goalsApi.loadGoals(user?.id as string),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
  });

  const createGoal = useMutation({
    mutationFn: (goalData) => {
      if (!user?.id) throw new Error('User is not authenticated');
      return goalsApi.createGoal({ ...goalData, userId: user.id });
    },
    onSuccess: (newGoal) => {
      queryClient.setQueryData(
        ['goals', user?.id],
        (oldData?: { goals: Goal[] }) => ({
          ...(oldData ?? { goals: [] }),
          goals: [...(oldData?.goals ?? []), newGoal],
        })
      );
    },
  });

  return {
    goals,
    isLoading,
    error,
    refetchGoal:refetch,
    createGoal: createGoal.mutateAsync,
    isCreating: createGoal.isPending,
  };
};
