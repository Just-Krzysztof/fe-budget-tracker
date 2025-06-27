import type { TransactionType } from "../pages/TransactionsPage/types/transaction"
import { API_URL } from "./auth.api"
import { authorizedFetch } from "./authorizedFetch"



export interface ShortSummaryChart{
    title: string,
    data:SummaryChart
}

interface SummaryChart{
    id: string,
    type:TransactionType,
    amount: string,
    currency:string,
}

export const shortSummaryApi = {
    getSummary: async(
        userId: string,
        onUnauthorized?: () => void
    ): Promise<ShortSummaryChart[]> => {
        const response = await authorizedFetch(
            `${API_URL}/transaction/summary/short`,
            {
                method: 'POST',
                body: JSON.stringify({userId:userId})
            },
            onUnauthorized
        );
        if (!response.ok) throw new Error('Failed to fetch short summary')
        return response.json()
    }
}