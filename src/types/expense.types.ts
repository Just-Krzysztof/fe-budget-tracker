export interface ExpenseFormData {
  value: number;
  currency: string;
  tag: string;
  description: string;
  type: string;
  date: Date;
}

export interface Expense extends ExpenseFormData {
  id: string;
  createdAt: string;
  userId?: string;
}

export interface ExpensesFilter {
  startDate?: Date;
  endDate?: Date;
  type?: string;
  tag?: string;
  currency?: string;
}

export interface ExpensesStatistics {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  byCurrency: {
    [currency: string]: {
      expenses: number;
      income: number;
      balance: number;
    }
  };
  byTag: {
    [tag: string]: {
      expenses: number;
      income: number;
    }
  };
} 