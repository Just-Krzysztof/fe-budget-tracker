import { API_URL } from './auth.api';
import { authorizedFetch } from './authorizedFetch';


export interface MonthySummary {
  incomeSum: number;
  saveSum: number;
  expenseSum: number;
  currency: string;
  month: number;
  year: number;
}
export const monthySummaryApi = {
  loadMonthySummay: async (
    userId: string,
    month: number,
    year: number,
    onUnauthorized?: () => void
  ): Promise<MonthySummary> => {
    const response = await authorizedFetch(
      `${API_URL}/transaction/summary/${userId}/${month}/${year}`,
      {},
      onUnauthorized
    );
    if (!response.ok) throw new Error('Failed to fetch tags');
    return response.json();
  },
};
