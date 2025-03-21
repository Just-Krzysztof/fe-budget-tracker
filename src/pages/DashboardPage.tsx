import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../components/layout/MainLayout';
import { SummaryBox } from '../components/SummaryBox';
import { GoGraph } from "react-icons/go";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { summaryService } from '../services/summaryService';
import { Currencies, Summary } from '../types/summary.types';
import { BsSafe } from "react-icons/bs";

const DashboardPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedMonth, setSelectedMonth] = useState<number>(3);
  const [summaryData,setSummaryData]= useState<Summary>()
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

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

  const fetchSummary = async (year: string | number = selectedYear, month: string | number = selectedMonth) => {
    setLoading(true)
    try {
      const data = await summaryService.getSummaryByMonth({ year, month })
      setSummaryData(data)
      console.log('Summary data:', data);
    } catch (err) {
      console.error('We have problem...',err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary();
},[selectedYear,selectedMonth])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(e.target.value));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      {loading ?'Loading':''}
      {/* Welcome section */}
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg mb-6 max-w-7xl mx-auto">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            User Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            This is your personal dashboard. Here you can view your financial summary and stats.
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-between gap-4 py-5 w-full max-w-7xl mx-auto md:w-auto">
        <h3 className='pl-3.5 first-letter:uppercase'>{summaryData?.period}</h3>
        <div className='flex flex-row gap-4'>

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

      {/* Stats cards */}
      {/* TODO features add currency */}
      <div className="">
        {/* Transactions card */}
        {summaryData?.currencies.map((item: Currencies) => {
          return (
            <div key={item.currency} className='max-w-7xl mx-auto'>
              <h4 className='text-lg py-5 font-medium text-gray-900 dark:text-white'>Summary by {item?.currency}</h4>
              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                <SummaryBox 
                  icon={GoGraph} 
                  currency={item?.currency}
                  title='Total Income' 
                  value={item?.income} 
                  blurValue={true}
                />
                <SummaryBox 
                  icon={HiOutlineCurrencyDollar} 
                  currency={item?.currency}
                  title='Total Expanses' 
                  value={item?.expenses} 
                  blurValue={true}
                />
                <SummaryBox 
                  icon={BsSafe} 
                  currency={item?.currency}
                  title='Total Saved' 
                  value={item?.saved} 
                  blurValue={true}
                />
              </div>
            </div>
          )
        })}
       
      </div>
    </MainLayout>
  );
};

export default DashboardPage; 