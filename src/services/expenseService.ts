import { httpClient } from './httpClient';
import { Expense, ExpenseFormData, ExpensesList } from '../types/expense.types';

export const expenseService = {

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
   * Get list of expenses by tag, month and year
   */
  async loadListOfExpenses(year: string | number, month: string | number, type: string): Promise<ExpensesList> {
    try {
      return await httpClient.post<ExpensesList>(`/financialRecords/filter?year=${year}&month=${month}&type=${type}`);
    } catch (error) {
      console.error('Error fetching list:', error);
      throw error;
    }
  },

  /**
   * Delete an expense by ID
   */
  async deleteExpense(id: string): Promise<void> {
    try {
      await httpClient.delete<void>(`/financialRecords/${id}`);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },

  /**
   * Update an existing expense
   */
  async updateExpense(id: string, expenseData: Partial<ExpenseFormData>): Promise<Expense> {
    try {
      return await httpClient.put<Expense>(`/financialRecords/${id}`, expenseData);
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }
}; 