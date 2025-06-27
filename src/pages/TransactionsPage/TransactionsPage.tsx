// src/pages/TransactionPage/TransactionPage.tsx
import { ChartBox } from '../../components/Box/ChartBox';
import { Modal } from '../../components/Modal/Modal';
import type { TableColumn } from '../../components/Table/Table';
import { SquarePlus, ArrowLeftToLine } from 'lucide-react';
import { useState } from 'react';
import { useTransactionForm } from './hooks/useTransactionForm';
import type { Transaction as TransactionFormData } from './types/transaction';
import { TransactionType } from './types/transaction';
import { TransactionForm } from '../../components/TransactionForm/TransactionForm';
import { TagForm } from '../../components/TagForm/TagForm';
import { useTags } from '../../hooks/useTags';
import { useTransactions } from '../../hooks/useTransaction';
import { useShortSummary } from '../../hooks/useShortSummary';
import type { ShortSummaryChart } from '../../api/shortSummary.api';
import type { Tag } from '../../api/tags.api';
import type { Goal } from '../../api/goals.api';

interface Transaction extends Record<string, unknown> {
  id: string;
  amount: number;
  type: TransactionType;
  currency: string;
  description: string;
  date: string;
  tag?: Tag;
  goal?: Goal;
}

const TypeCell = ({ type }: { type: TransactionType }) => {
  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INCOME:
        return 'bg-green-100 border-green-800 text-green-800';
      case TransactionType.EXPENSE:
        return 'bg-red-100 text-red-800 border-red-800';
      case TransactionType.SAVING:
        return 'bg-blue-100 text-blue-800 border-blue-800';
      default:
        return 'bg-gray-100 text-gray-800 text-gray-800';
    }
  };

  return <span className={`badge  ${getTypeColor(type)}`}>{type}</span>;
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

export const TransactionsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagFormData, setTagFormData] = useState({
    tagName: '',
    colorBg: '#3b82f6',
    colorText: '#ffffff',
  });

  const form = useTransactionForm();
  const { createTag, refetch } = useTags();
  const [filters, setFilters] = useState({
    month: 6,
    year: 2025,
    // optionally: startDate, endDate, etc.
  });
  const { transactions, isRefetchTransaction, createTransaction } =
    useTransactions(filters);
  const { shortSummary, shortSummaryRefetch } = useShortSummary();
  console.log('shortSummary', shortSummary);
  const onSubmit = async (data: TransactionFormData) => {
    console.log('data', data);
    try {
      await createTransaction({
        amount: data.amount,
        type: data.type,
        tagId: data.tag || null,
        goalId: data.goal || null,
        currency: data.currency,
        description: data.description,
        date: data.date,
      });
      await isRefetchTransaction();
      await shortSummaryRefetch();
      form.reset();
      setShowModal(false);
    } catch (err) {
      console.error('err', err);
    }
  };

  const handleTagSubmit = async (data: typeof tagFormData) => {
    try {
      await createTag({
        name: data.tagName,
        colorBg: data.colorBg,
        colorText: data.colorText,
      });
      await refetch();
      setShowTagModal(false);
      setTagFormData({
        tagName: '',
        colorBg: '#3b82f6',
        colorText: '#ffffff',
      });
    } catch (err) {
      console.error('Failed to create tag:', err);
    }
  };

  return (
    <div className="md:p-6 p-2">
      <h1 className="text-2xl flex items-center font-bold">
        Transactions
        <button
          className="hover:text-green-600 transition-colors cursor-pointer"
          onClick={() => setShowModal((action) => !action)}
        >
          <SquarePlus className="text-green-500 w-8 h-8" />
        </button>
      </h1>
      {/* <pre>{ JSON.stringify(shortSummary) }</pre> */}
      <div className="flex justify-center flex-col lg:flex-row gap-5">
        {shortSummary.map((chartData) => (
          <div key={chartData.title} className="flex flex-col items-center">

            <ChartBox data={chartData.data ?? []} title={chartData.title} />
          </div>
        ))}
      </div>
      <div className="mt-8 overflow-x-auto rounded-box bg-transparent">
        <table className="table table-pin-rows table-auto table-pin-cols rounded-2xl w-full">
          <thead className="bg-transparent">
            <tr className="border-b-1 border-indigo-300  bg-gray-200 text-black">
              <td/>
              <td className="text-center">Amount</td>
              <td className="text-center">Type</td>
              <td className="text-center">Description</td>
              <td className="text-center">Last Login</td>
              <td className="text-center">Tag</td>
              <td className="text-center">Goal</td>
            </tr>
          </thead>
          <tbody>
            {transactions.transactions.map((transaction, index: number) => (
              <tr
                key={transaction.id}
                className=" border-indigo-300 text-black hover:text-gray-500 not-last:border-b-1 hover:bg-gray-100"
              >
                <td>{index}</td>
                <td className="text-center">{`${transaction.amount} ${transaction.currency}`}</td>
                <td className="text-center">
                  <TypeCell type={transaction.type} />
                </td>
                <td>{transaction.description}</td>
                <td className="text-center">
                  {new Date(transaction.date).toLocaleDateString('pl-PL')}
                </td>
                <td className="text-center">
                  {transaction?.tag?.name ? (
                    <div
                      style={{
                        '--tag-bg-color': transaction?.tag?.colorBg,
                        '--tag-text-color': transaction?.tag?.colorText,
                      }}
                      className="badge border-(--tag-bg-color) bg-(--tag-bg-color) text-(--tag-text-color) text-nowrap"
                    >
                      {transaction?.tag?.name ?? '-'}
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="text-center">
                  {transaction?.goal?.name ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-black"></p>
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
