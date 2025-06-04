// src/pages/TransactionPage/TransactionPage.tsx
import { ChartBox } from '../../components/Box/ChartBox';

interface MonthlyData {
  name: 'Income' | 'Expanses' | 'Saved' | string;
  value: number;
  month: number;
  year: number;
  currency: string;
}

interface ChartData {
  title: string;
  data: MonthlyData[];
}

const response: ChartData[] = [
  {
    title: 'Last Month May',
    data: [
      {
        name: 'Income',
        value: 4000,
        month: 5,
        year: 2025,
        currency: 'PLN',
      },
      {
        name: 'Expanses',
        value: 2500,
        month: 5,
        year: 2025,
        currency: 'PLN',
      },
      {
        name: 'Saved',
        value: 1700,
        month: 5,
        year: 2025,
        currency: 'PLN',
      },
    ],
  },
  {
    title: 'Current Month June',
    data: [
      {
        name: 'Income',
        value: 1700,
        month: 5,
        year: 2025,
        currency: 'PLN',
      },
      {
        name: 'Expanses',
        value: 2500,
        month: 5,
        year: 2025,
        currency: 'PLN',
      },
      {
        name: 'Saved',
        value: 4000,
        month: 5,
        year: 2025,
        currency: 'PLN',
      },
    ],
  },
];

export const TransactionsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Transactions</h1>
      <p className="mt-4">Welcome to your TransactionsPage</p>
      <div className="flex justify-center flex-col lg:flex-row gap-5">
        {response.map((chartData) => (
          <div key={chartData.title} className="flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-2">{chartData.title}</h2>
            <ChartBox data={chartData.data} title={chartData.title} />
          </div>
        ))}
      </div>
    </div>
  );
};
