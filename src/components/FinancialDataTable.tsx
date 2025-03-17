import { Expense } from '../types/expense.types';
import { useEffect, useState } from 'react';

interface FinancialDataTableProps {
  data: Expense[];
  type: 'expense' | 'income';
}

const FinancialDataTable = ({ data, type }: FinancialDataTableProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [animatedData, setAnimatedData] = useState<Expense[]>([]);
  
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-gray-700 table-fixed">
        <thead className="bg-gray-800">
          <tr>
            <th className="py-2 px-4 border-b w-[40%] text-left">Description</th>
            <th className="py-2 px-4 border-b w-[20%] text-left">Amount</th>
            <th className="py-2 px-4 border-b w-[20%] text-left">Category</th>
            <th className="py-2 px-4 border-b w-[20%] text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={4} className="py-4 px-4 text-center">
                <LoadingDots />
              </td>
            </tr>
          ) : animatedData.length > 0 ? (
            animatedData.map((item, index) => (
              <tr 
                key={item.id} 
                className={`hover:bg-gray-600 ${
                  type === 'expense' ? 'text-red-200' : 'text-green-200'
                }`}
                style={{ 
                  animation: `fadeInRow 0.5s ease-out forwards ${index * 0.08}s`,
                  opacity: 0,
                  transform: 'translateY(10px)'
                }}
              >
                <td className="py-2 px-4 border-b">
                  <div 
                    className="text-ellipsis" 
                    title={item.description}
                  >
                    {item.description}
                  </div>
                </td>
                <td className="py-2 px-4 border-b">
                  <span className={type === 'expense' ? 'text-red-400' : 'text-green-400'}>
                    {type === 'expense' ? '-' : '+'}{item.value} {item.currency}
                  </span>
                </td>
                <td className="py-2 px-4 border-b truncate" title={item.tag}>
                  {item.tag}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(item.date).toLocaleDateString('pl')}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-4 px-4 text-center text-gray-400">
                No {type === 'expense' ? 'expenses' : 'income'} found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      <style jsx>{`
        @keyframes fadeInRow {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default FinancialDataTable; 