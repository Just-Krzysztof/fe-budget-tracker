import { API_URL } from './auth.api';
import { authorizedFetch } from './authorizedFetch';
import type { TransactionType } from '../pages/TransactionsPage/types/transaction';

export interface FilterTransaction {
  month?: number;
  year?: number;
  userId: string;
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

export interface CreateTransaction {
  userId: string;
  amount: number;
  type: TransactionType;
  tagId?: string;
  goalId?: string;
  currency: string;
  description?: string;
  date: string;
}

export interface Transactions {
  transaction: Transaction;
}
interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  tagId?: string;
  goalId?: string;
  currency: string;
  description?: string;
  date: string;
}

export const transactionsApi = {
  getTransactions: async (
    filter: FilterTransaction,
    onUnauthorized?: () => void
  ): Promise<Transactions[]> => {
    const response = await authorizedFetch(
      `${API_URL}/transaction/filter`,
      { method: 'POST', body: JSON.stringify(filter) },
      onUnauthorized
    );
    if (!response.ok) throw new Error('Failed to fetch tags');
    return response.json();
  },
  //   Omit<Tag, 'id'>
  createTransaction: async (
    transactionData: CreateTransaction,
    onUnauthorized?: () => void
  ): Promise<Transactions> => {
    const response = await authorizedFetch(
      `${API_URL}/transaction`,
      {
        method: 'POST',
        body: JSON.stringify(transactionData),
      },
      onUnauthorized
    );
    if (!response.ok) throw new Error('Failed to create tag');
    return response.json();
  },
};
