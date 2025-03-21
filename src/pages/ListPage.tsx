import { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { expenseService } from '../services/expenseService';
import { ExpensesList } from '../types/expense.types';
import FinancialDataTable from '../components/FinancialDataTable';

type TabType = 'expense' | 'income';

const ListPage = () => {
  const [expensesData, setExpensesData] = useState<ExpensesList>([]);
  const [incomeData, setIncomeData] = useState<ExpensesList>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedMonth, setSelectedMonth] = useState<number>(3);
  const [activeTab, setActiveTab] = useState<TabType>('expense');

  const fetchData = async (year: string | number = selectedYear, month: string | number = selectedMonth) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both expense and income data in parallel
      const [expenses, income] = await Promise.all([
        expenseService.loadListOfExpenses(year, month, 'expense'),
        expenseService.loadListOfExpenses(year, month, 'income')
      ]);
      
      setExpensesData(expenses);
      setIncomeData(income);
    } catch(err) {
      console.error(err);
      setError('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(e.target.value));
  };

  const switchTab = (tab: TabType) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  // Generate years for the dropdown (current year and 5 years back)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Months for the dropdown
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Financial Records</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="w-full sm:w-auto">
              <label htmlFor="month-select" className="block text-sm font-medium text-white mb-1">
                Month
              </label>
              <select
                id="month-select"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="block w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full sm:w-auto">
              <label htmlFor="year-select" className="block text-sm font-medium text-white mb-1">
                Year
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={handleYearChange}
                className="block w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-600">
            <button
              className={`py-2 px-4 font-medium text-md focus:outline-none transition-all duration-300 relative ${
                activeTab === 'expense'
                  ? 'border-b-2 border-red-500 text-red-500'
                  : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => switchTab('expense')}
            >
              Expenses
              {activeTab === 'expense' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 animate-pulse"></span>
              )}
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm focus:outline-none transition-all duration-300 relative ${
                activeTab === 'income'
                  ? 'border-b-2 border-green-500 text-green-500'
                  : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => switchTab('income')}
            >
              Income
              {activeTab === 'income' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 animate-pulse"></span>
              )}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900/20 text-red-400 p-4 rounded mb-4 animate-fadeIn">
            {error}
          </div>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-300">Loading data...</p>
          </div>
        )}
        
        {/* Tab Content */}
        {!loading && (
          <div className="w-full relative min-h-[300px]">
            {/* Expenses Tab */}
            <div 
              className={`transition-all duration-300 ${
                activeTab === 'expense' ? 'block' : 'hidden'
              }`}
            >
              <FinancialDataTable 
                data={expensesData}
                type="expense"
                onDataChange={fetchData}
              />
            </div>

            {/* Income Tab */}
            <div 
              className={`transition-all duration-300 ${
                activeTab === 'income' ? 'block' : 'hidden'
              }`}
            >
              <FinancialDataTable 
                data={incomeData}
                type="income"
                onDataChange={fetchData}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ListPage; 