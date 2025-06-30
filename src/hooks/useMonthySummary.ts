import { useQuery } from "@tanstack/react-query"
import { useAuth } from "./useAuth"
import { monthySummaryApi } from "../api/monthySummary.api"

export const useMonthySummary = (month:number, year:number) => {
    const { user } = useAuth()
    // const queryClient = useQueryClient()
 
    const {
        data: monthySummary = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['monthySummary', user?.id, month, year],
        queryFn: () => monthySummaryApi.loadMonthySummay(user?.id as string, month, year),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 30,
        retry: 2,
    })
    return {
        monthySummary,
        isLoading,
        error,
        refetchMonthySummary:refetch
    }
}