// src/pages/TransactionPage/TransactionPage.tsx
import { ChartBox } from '../../components/Box/ChartBox';
import { Modal } from '../../components/Modal/Modal';
import Table from '../../components/Table/Table';
import type { TableColumn } from '../../components/Table/Table';
import { SquarePlus, ArrowLeftToLine } from 'lucide-react';
import { useState } from 'react';
import { useTransactionForm } from './hooks/useTransactionForm';
import type { Transaction as TransactionFormData } from './types/transaction';
import { TransactionForm } from '../../components/TransactionForm/TransactionForm';
import { TagForm } from '../../components/TagForm/TagForm';
import { useTags } from '../../hooks/useTags';
import { authStorage } from '../../utils/auth';

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

const userId = authStorage?.getUser()?.id;

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
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagFormData, setTagFormData] = useState({
    tagName: '',
    colorBg: '#3b82f6',
    colorText: '#ffffff',
    userId: '',
  });

  const form = useTransactionForm();
  const { tags, createTag, refetch } = useTags();

  const onSubmit = (data: TransactionFormData) => {
    console.log('Transaction data:', data);
    form.reset();
    setShowModal(false);
  };

  const handleTagSubmit = async (data: typeof tagFormData) => {
    try {
      await createTag({
        name: data.tagName,
        userId,
        colorBg: data.colorBg,
        colorText: data.colorText,
      });
      await refetch();
      setShowTagModal(false);
      setTagFormData({
        tagName: '',
        colorBg: '#3b82f6',
        colorText: '#ffffff',
        userId: '',
      });
    } catch (err) {
      console.error('Failed to create tag:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl flex items-center font-bold">
        Transactions
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
        setShow={() => setShowModal(false)}
        alignment="center"
        isIntercepting={true}
        showCancelBtnINSmallDevice={true}
        isTitle={!showTagModal ? 'Add New Transaction' : 'Add New Tag'}
      >
        {!showTagModal ? (
          <TransactionForm
            form={form}
            onSubmit={onSubmit}
            onAddTag={() => setShowTagModal(true)}
            tagValue={form.tagValue}
            goalValue={form.goalValue}
          />
        ) : (
          <>
            <button
              className="flex gap-2 justify-center border-1 py-1 px-2 rounded-2xl border-gray-400 cursor-pointer text-xs"
              onClick={() => setShowTagModal(false)}
            >
              <ArrowLeftToLine size={18} /> back
            </button>
            <TagForm
              formData={tagFormData}
              onFormDataChange={setTagFormData}
              onSubmit={handleTagSubmit}
            />
          </>
        )}
      </Modal>
    </div>
  );
};
