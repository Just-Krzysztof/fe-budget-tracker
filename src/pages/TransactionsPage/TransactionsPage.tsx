// src/pages/TransactionPage/TransactionPage.tsx
import { ChartBox } from '../../components/Box/ChartBox';
import { Modal } from '../../components/Modal/Modal';
import { SquarePlus, ArrowLeftToLine } from 'lucide-react';
import { useState } from 'react';
import { useTransactionForm } from './hooks/useTransactionForm';
import type { Transaction as TransactionAPI } from '../../api/transactions.api';
import type { Transaction as TransactionFormData } from './types/transaction';
import { TransactionType } from './types/transaction';
import { TransactionForm } from '../../components/TransactionForm/TransactionForm';
import { TagForm } from '../../components/TagForm/TagForm';
import { useTags } from '../../hooks/useTags';
import { useTransactions } from '../../hooks/useTransaction';
import { useShortSummary } from '../../hooks/useShortSummary';
import { FormProvider } from 'react-hook-form';
import { useGoals } from '../../hooks/useGoals';
import { Pagination } from '../../components/Table/Pagination';

const TypeCell = ({ type }: { type: TransactionType }) => {
  const getTypeInfo = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INCOME:
        return {
          label: 'PRZYCHÓD',
          className:
            'bg-emerald-100 text-emerald-800 border border-emerald-200',
        };
      case TransactionType.EXPENSE:
        return {
          label: 'WYDATEK',
          className: 'bg-rose-100 text-rose-800 border border-rose-200',
        };
      case TransactionType.SAVING:
        return {
          label: 'OSZCZĘDNOŚCI',
          className: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
        };
      default:
        return {
          label: type,
          className: 'bg-slate-100 text-slate-800 border border-slate-200',
        };
    }
  };

  const typeInfo = getTypeInfo(type);
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${typeInfo.className}`}
    >
      {typeInfo.label}
    </span>
  );
};

export const TransactionsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const [tagFormData, setTagFormData] = useState({
    tagName: '',
    colorBg: '#3b82f6',
    colorText: '#ffffff',
  });

  const form = useTransactionForm();
  const { createTag, refetch, isCreating: isCreatingTag } = useTags();
  const { refetchGoal } = useGoals();

  const [filters, setFilters] = useState({
    month: 6,
    year: 2025,
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const {
    transactions,
    isLoadingTransaction,
    isRefetchTransaction,
    createTransaction,
    isCreatingTransaction,
  } = useTransactions(filters);
  const {
    shortSummary,
    isLoading: isLoadingShortSummary,
    shortSummaryRefetch,
  } = useShortSummary();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilters((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
    }));
  };

  const onSubmit = async (data: TransactionFormData) => {
    console.log('typeof data.date:', typeof data.date, data.date);

    try {
      await createTransaction({
        amount: data.amount,
        type: data.goal ? 'SAVING' : data.type,
        tagId: data.tag || undefined,
        goalId: data.goal || undefined,
        currency: data.currency,
        description: data.description,
        date: new Date(data.date).toISOString(),
      });
      await isRefetchTransaction();
      await shortSummaryRefetch();
      await refetchGoal();
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
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Transakcje</h1>
          <p className="text-slate-600">Zarządzaj swoimi transakcjami</p>
        </div>
        <button
          className="flex items-center justify-center w-12 h-12 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          onClick={() => setShowModal(!showModal)}
        >
          <SquarePlus className="w-6 h-6" />
        </button>
      </div>

      {/* Summary Charts */}
      <div className="flex md:justify-center gap-6 overflow-x-auto flex-row mb-8 ">
        {isLoadingShortSummary
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-4xl min-w-[200px] animate-pulse"
              >
                <div className="h-6 bg-slate-200 rounded mb-4 w-24"></div>
                <div className="h-32 bg-slate-200 rounded"></div>
              </div>
            ))
          : shortSummary.map((chartData, index) => (
              <div key={index} className="bg-white p-6 rounded-4xl">
                <h3 className="text-lg font-semibold text-slate-800 ">
                  {chartData.title}
                </h3>
                <div className="">
                  <ChartBox data={chartData.data ?? []} title="" />
                </div>
              </div>
            ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">
            Lista transakcji
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  LP.
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  KWOTA
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  TYP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  OPIS
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  DATA
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  TAG
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  CEL
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {isLoadingTransaction ? (
                // Loading skeleton rows
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-slate-200 rounded w-8"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-slate-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-slate-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-slate-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-slate-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-slate-200 rounded w-12"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-slate-200 rounded w-16"></div>
                    </td>
                  </tr>
                ))
              ) : Array.isArray(transactions) ? (
                transactions.map(
                  (transaction: TransactionAPI, index: number) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-slate-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-900 font-medium">
                        {`${transaction.amount} ${transaction.currency}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <TypeCell type={transaction.type} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-900">
                        {new Date(transaction.date).toLocaleDateString('pl-PL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {transaction?.tag?.name ? (
                          <span
                            style={{
                              backgroundColor: transaction?.tag?.colorBg,
                              color: transaction?.tag?.colorText,
                            }}
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          >
                            {transaction?.tag?.name}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-900">
                        {transaction?.goal?.name ?? '-'}
                      </td>
                    </tr>
                  )
                )
              ) : transactions.transactions ? (
                transactions.transactions.map(
                  (transaction: any, index: number) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-slate-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-900 font-medium">
                        {`${transaction.amount} ${transaction.currency}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <TypeCell type={transaction.type} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-900">
                        {new Date(transaction.date).toLocaleDateString('pl-PL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {transaction?.tag?.name ? (
                          <span
                            style={{
                              backgroundColor: transaction?.tag?.colorBg,
                              color: transaction?.tag?.colorText,
                            }}
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          >
                            {transaction?.tag?.name}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-900">
                        {transaction?.goal?.name ?? '-'}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Brak transakcji do wyświetlenia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
          <Pagination
            currentPage={currentPage}
            totalPages={
              Array.isArray(transactions)
                ? Math.ceil(transactions.length / pageSize)
                : transactions.totalPages || 1
            }
            onPageChange={handlePageChange}
            itemsPerPage={pageSize}
            totalItems={
              Array.isArray(transactions)
                ? transactions.length
                : transactions.totalElements || 0
            }
            showInfo={true}
          />
        </div>
      </div>

      <Modal
        className="text-black"
        show={showModal}
        setShow={() => setShowModal(false)}
        alignment="center"
        isIntercepting={true}
        showCancelBtnINSmallDevice={true}
        isTitle={!showTagModal ? 'Add New Transaction' : 'Add New Tag'}
      >
        {!showTagModal ? (
          <FormProvider {...form}>
            <TransactionForm
              form={form}
              onSubmit={onSubmit}
              onAddTag={() => setShowTagModal(true)}
              tagValue={form.tagValue}
              goalValue={form.goalValue}
              isSubmitting={isCreatingTransaction}
            />
          </FormProvider>
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
              isCreating={isCreatingTag}
            />
          </>
        )}
      </Modal>
    </div>
  );
};
