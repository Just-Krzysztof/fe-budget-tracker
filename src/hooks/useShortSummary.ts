import { useQuery } from '@tanstack/react-query'
import { shortSummaryApi } from '../api/shortSummary.api.ts'
import { useAuth } from './useAuth.ts';

export const useShortSummary = () => {
    const { user } = useAuth();
    const {
        data: shortSummary = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['shortSummary', user?.id],
        queryFn: () => shortSummaryApi.getSummary(user?.id as string),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 30,
        retry: 2,
    });

    return {
        shortSummary,
        isLoading,
        error,
        shortSummaryRefetch:refetch,
    };
}