import { Expense } from '../types/expense.types';
import { useEffect, useState } from 'react';
import { expenseService } from '../services/expenseService';

interface FinancialDataTableProps {
  data: Expense[];
  type: 'expense' | 'income';
  onDataChange?: () => void; // Callback to refresh parent component when data changes
}

const FinancialDataTable = ({ data, type, onDataChange }: FinancialDataTableProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [animatedData, setAnimatedData] = useState<Expense[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Simulate loading and then animate data appearing
  useEffect(() => {
    setIsLoading(true);
    setAnimatedData([]);
    
    // Simulate a short loading delay
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      
      // After loading is done, animate rows appearing
      if (data.length > 0) {
        data.forEach((item, index) => {
          setTimeout(() => {
            setAnimatedData(prev => [...prev, item]);
          }, index * 80); // 80ms delay between each item
        });
      }
    }, 600); // 600ms loading simulation
    
    return () => clearTimeout(loadingTimer);
  }, [data]);

  // Loading dots animation
  const LoadingDots = () => {
    const [dots, setDots] = useState('');
    
    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 300);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-yellow-500 font-medium animate-pulse">
          Loading<span className="inline-block w-8">{dots}</span>
        </div>
      </div>
    );
  };

  // Handle delete expense
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        setIsDeleting(id);
        await expenseService.deleteExpense(id);
        // Remove from local state to avoid having to refetch
        setAnimatedData(prev => prev.filter(item => item.id !== id));
        // Notify parent component of the change
        if (onDataChange) {
          onDataChange();
        }
      } catch (error) {
        console.error('Failed to delete record:', error);
        alert('Failed to delete record. Please try again.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  // Helper to format value safely
  const formatValue = (value: any): string => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return String(value || 0);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="py-2 px-4 border-b w-[35%] text-left">Description</th>
            <th className="py-2 px-4 border-b w-[15%] text-left">Amount</th>
            <th className="py-2 px-4 border-b w-[15%] text-left">Category</th>
            <th className="py-2 px-4 border-b w-[15%] text-left">Date</th>
            <th className="py-2 px-4 border-b w-[20%] text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="py-4 px-4 text-center">
                <LoadingDots />
              </td>
            </tr>
          ) : animatedData.length > 0 ? (
            animatedData.map((item, index) => (
              <tr 
                key={item.id} 
                className={`staggered-item hover:bg-gray-600 ${
                  type === 'expense' ? 'text-red-200' : 'text-green-200'
                }`}
                style={{
                  animation: `fadeIn 0.3s ease-out forwards`,
                  animationDelay: `${index * 0.08}s`,
                  opacity: 0
                }}
              >
                <td className="py-2 px-4 border-b">{item.description || '-'}</td>
                <td className="py-2 px-4 border-b">
                  {formatValue(item.value)} {item.currency}
                </td>
                <td className="py-2 px-4 border-b">{item.tag}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting === item.id}
                      className={`text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs transition-colors ${
                        isDeleting === item.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      aria-label="Delete record"
                    >
                      {isDeleting === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-4 px-4 text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <style>
        {`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        `}
      </style>
    </div>
  );
};

export default FinancialDataTable; 