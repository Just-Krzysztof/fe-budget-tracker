import { Expense } from '../types/expense.types';

interface FinancialTableProps {
  data: Expense[];
  title: string;
  isOpen: boolean;
  toggleOpen: () => void;
  type: 'expense' | 'income';
}

const FinancialTable = ({ data, title, isOpen, toggleOpen, type }: FinancialTableProps) => {
  return (
    <div className="rounded-lg overflow-hidden w-full h-full">
      <button 
        onClick={toggleOpen}
        className="w-full flex justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        <svg 
          className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={type === 'expense' ? 'bg-red-900/10' : 'bg-green-900/10'}>
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
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-gray-600 ${
                        type === 'expense' ? 'text-red-200' : 'text-green-200'
                      }`}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialTable; 