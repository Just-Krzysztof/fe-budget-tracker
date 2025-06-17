// src/pages/TransactionPage/TransactionPage.tsx
import { ChartBox } from '../../components/Box/ChartBox';
import { Modal } from '../../components/Modal/Modal';
import Table from '../../components/Table/Table';
import type { TableColumn } from '../../components/Table/Table';
import { SquarePlus } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../../components/Form/Input';
import { Submit } from '../../components/Form/Submit';
import { useTransactionForm } from './hooks/useTransactionForm';
import type { Transaction as TransactionFormData } from './types/transaction';
import { Textarea } from '../../components/Form/Textarea';

enum TransactionType {
  INCOME = 'INCOME',
  EXPANSES = 'EXPANSES',
  SAVING = 'SAVING',
}

interface MonthlyData {
  name: TransactionType | string;
  value: number;
  month: number;
  year: number;
  currency: string;
}

interface ChartData {
  title: string;
  data: MonthlyData[];
}

interface Transaction extends Record<string, unknown> {
  id: string;
  amount: number;
  type: TransactionType;
  currency: string;
  description: string;
  date: string;
  tag?: string;
  goal?: string;
}

const response: ChartData[] = [
  {
    title: 'Last Month May',
    data: [
      {
        name: TransactionType.INCOME,
        value: 4000,
        month: 5,
        year: 2025,
        currency: 'PLN',
      },
      {
        name: TransactionType.EXPANSES,
        value: 2500,
        month: 5,
        year: 2025,
        currency: 'PLN',
      },
      {
        name: TransactionType.SAVING,
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
        name: TransactionType.INCOME,
        value: 1700,
        month: 5,
        year: 2025,
        currency: 'PLN',
      },
      {
        name: TransactionType.EXPANSES,
        value: 2500,
        month: 5,
        year: 2025,
        currency: 'PLN',
      },
      {
        name: TransactionType.SAVING,
        value: 4000,
        month: 5,
        year: 2025,
        currency: 'PLN',
      },
    ],
  },
];

const transactionResponse: Transaction[] = [
  {
    id: '1',
    amount: 234,
    type: TransactionType.SAVING,
    currency: 'PLN',
    description: 'Ble ble ble odkładam na auuto',
    date: '',
    tag: '',
    goal: 'Na samochód',
  },
  {
    id: '2',
    amount: 5000,
    type: TransactionType.INCOME,
    currency: 'PLN',
    description: 'Ble ble ble za prace',
    date: '',
    tag: 'Salary',
    goal: '',
  },
  {
    id: '3',
    amount: 234,
    type: TransactionType.EXPANSES,
    currency: 'PLN',
    description: 'Ble ble ble jedzenie',
    date: '',
    tag: 'Shop',
    goal: '',
  },
  {
    id: '4',
    amount: 234,
    type: TransactionType.EXPANSES,
    currency: 'PLN',
    description: 'Ble ble ble jedzenie',
    date: '',
    tag: 'Shop',
    goal: '',
  },
  {
    id: '5',
    amount: 234,
    type: TransactionType.EXPANSES,
    currency: 'PLN',
    description: 'Ble ble ble jedzenie',
    date: '',
    tag: 'Shop',
    goal: '',
  },
  {
    id: '6',
    amount: 234,
    type: TransactionType.EXPANSES,
    currency: 'PLN',
    description: 'Ble ble ble jedzenie',
    date: '',
    tag: 'Shop',
    goal: '',
  },
];

// const AmountCell = ({
//   amount,
//   currency,
// }: {
//   amount: number;
//   currency: string;
// }) => (
//   <div className="flex items-center gap-2">
//     <span
//       className={`font-medium ${amount > 0 ? 'text-green-600' : 'text-red-600'}`}
//     >
//       {amount.toLocaleString()} {currency}
//     </span>
//   </div>
// );

const TypeCell = ({ type }: { type: TransactionType }) => {
  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INCOME:
        return 'bg-green-100 text-green-800';
      case TransactionType.EXPANSES:
        return 'bg-red-100 text-red-800';
      case TransactionType.SAVING:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${getTypeColor(type)}`}>
      {type}
    </span>
  );
};

const DescriptionCell = ({
  description,
  tag,
}: {
  description: string;
  tag?: string;
}) => (
  <div className="flex flex-col">
    <span className="text-sm">{description}</span>
    {tag && <span className="text-xs text-gray-500">#{tag}</span>}
  </div>
);

// Definicja kolumn dla tabeli
const columns: TableColumn<Transaction>[] = [
  {
    key: 'amount',
    header: 'Kwota',
    className: 'w-32',
    renderCell: (item) => `${item.amount} ${item.currency}`,
  },
  {
    key: 'type',
    header: 'Typ',
    className: 'w-24',
    renderCell: (item) => <TypeCell type={item.type} />,
  },
  {
    key: 'description',
    header: 'Opis',
    className: 'w-64',
    renderCell: (item) => (
      <DescriptionCell description={item.description} tag={item.tag} />
    ),
  },
  {
    key: 'date',
    header: 'Data',
    className: 'w-32',
    renderCell: (item) =>
      item.date ? new Date(item.date).toLocaleDateString('pl-PL') : '-',
  },
  {
    key: 'tag',
    header: 'Tag',
    className: 'w-32',
    renderCell: (item) => item.tag || '-',
  },
  {
    key: 'goal',
    header: 'Cel',
    className: 'w-32',
    renderCell: (item) => item.goal || '-',
  },
];

export const TransactionsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useTransactionForm();

  const onSubmit = (data: TransactionFormData) => {
    console.log('Transaction data:', data);
    // here to api
    reset();
    setShowModal(false);
  };

  const handleCloseModal = () => {
    reset();
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl flex items-center font-bold">
        Transactions{' '}
        <button
          className="hover:text-green-600 transition-colors cursor-pointer"
          onClick={() => setShowModal((action) => !action)}
        >
          <SquarePlus className="text-green-500 w-8 h-8" />
        </button>
      </h1>
      <p className="mt-4">Welcome to your TransactionsPage</p>
      <div className="flex justify-center flex-col lg:flex-row gap-5">
        {response.map((chartData) => (
          <div key={chartData.title} className="flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-2">{chartData.title} </h2>
            <ChartBox data={chartData.data} title={chartData.title} />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Table data={transactionResponse} columns={columns} idKey="id" />
      </div>
      <Modal
        show={showModal}
        setShow={handleCloseModal}
        alignment="center"
        width="w-[24rem]"
        isIntercepting={true}
        showCancelBtnINSmallDevice={true}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          <h2 className="text-xl font-bold mb-4">Add New Transaction</h2>

          <Input
            inputName="amount"
            inputType="number"
            label="Amount"
            placeholder="Enter amount..."
            required
            error={errors.amount?.message}
            {...register('amount')}
          />

          <Textarea
            textareaName="description"
            label="Opis transakcji"
            placeholder="Enter description..."
            rows={3}
            maxLength={500}
            required
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="w-full max-w-xs bg-white rounded-lg font-mono">
            <label className="block text-gray-600 text-sm font-bold mb-2">
              Type
            </label>
            <select
              className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-gray-50"
              {...register('type')}
            >
              <option value="INCOME">Income</option>
              <option value="EXPANSE">Expense</option>
              <option value="SAVING">Saving</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="w-full max-w-xs bg-white rounded-lg font-mono">
            <label className="block text-gray-600 text-sm font-bold mb-2">
              Currency
            </label>
            <select
              className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-gray-50"
              {...register('currency')}
            >
              <option value="PLN">PLN</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-500">
                {errors.currency?.message}
              </p>
            )}
          </div>

          <div className="w-full max-w-xs bg-white rounded-lg font-mono">
            <label className="block text-gray-600 text-sm font-bold mb-2">
              Date
            </label>
            <input
              type="date"
              className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-gray-50"
              {...register('date', { valueAsDate: true })}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          <Submit type="submit" name="Add Transaction" disabled={!isValid} />
        </form>
      </Modal>
    </div>
  );
};
