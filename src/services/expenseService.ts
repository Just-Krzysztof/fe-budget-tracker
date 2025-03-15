import { httpClient } from './httpClient';
import { Expense, ExpenseFormData, ExpensesFilter, ExpensesStatistics } from '../types/expense.types';

export const expenseService = {
  /**
   * Get all expenses for the authenticated user
   */
  async getExpenses(filter?: ExpensesFilter): Promise<Expense[]> {
    try {
      // Construct query params if filter is provided
      let queryParams = '';
      if (filter) {
        const params = new URLSearchParams();
        if (filter.startDate) params.append('startDate', filter.startDate.toISOString());
        if (filter.endDate) params.append('endDate', filter.endDate.toISOString());
        if (filter.type) params.append('type', filter.type);
        if (filter.tag) params.append('tag', filter.tag);
        if (filter.currency) params.append('currency', filter.currency);
        queryParams = `?${params.toString()}`;
      }

      return await httpClient.get<Expense[]>(`/expenses${queryParams}`);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },

  /**
   * Get a single expense by ID
   */
  async getExpenseById(id: string): Promise<Expense> {
    try {
      return await httpClient.get<Expense>(`/expenses/${id}`);
    } catch (error) {
      console.error(`Error fetching expense with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new expense
   */
  async createExpense(expenseData: ExpenseFormData): Promise<Expense> {
    try {
      return await httpClient.post<Expense>('/financialRecords/create', expenseData);
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },

  /**
   * Update an existing expense
   */
  async updateExpense(id: string, expenseData: Partial<ExpenseFormData>): Promise<Expense> {
    try {
      return await httpClient.put<Expense>(`/expenses/${id}`, expenseData);
    } catch (error) {
      console.error(`Error updating expense with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an expense
   */
  async deleteExpense(id: string): Promise<void> {
    try {
      await httpClient.delete(`/expenses/${id}`);
    } catch (error) {
      console.error(`Error deleting expense with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get expense statistics
   */
  async getStatistics(filter?: ExpensesFilter): Promise<ExpensesStatistics> {
    try {
      // Construct query params if filter is provided
      let queryParams = '';
      if (filter) {
        const params = new URLSearchParams();
        if (filter.startDate) params.append('startDate', filter.startDate.toISOString());
        if (filter.endDate) params.append('endDate', filter.endDate.toISOString());
        if (filter.type) params.append('type', filter.type);
        if (filter.tag) params.append('tag', filter.tag);
        if (filter.currency) params.append('currency', filter.currency);
        queryParams = `?${params.toString()}`;
      }

      return await httpClient.get<ExpensesStatistics>(`/expenses/statistics${queryParams}`);
    } catch (error) {
      console.error('Error fetching expense statistics:', error);
      throw error;
    }
  }
}; 