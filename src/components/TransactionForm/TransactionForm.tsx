import { Input } from '../Form/Input';
import { Submit } from '../Form/Submit';
import { Textarea } from '../Form/Textarea';
import { SquarePlus } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { Transaction as TransactionFormData } from '../../pages/TransactionsPage/types/transaction';

interface TransactionFormProps {
  form: UseFormReturn<TransactionFormData>;
  onSubmit: (data: TransactionFormData) => void;
  onAddTag: () => void;
  tagValue?: string;
  goalValue?: string;
}

export const TransactionForm = ({
  form,
  onSubmit,
  onAddTag,
  tagValue,
  goalValue,
}: TransactionFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = form;

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTagValue = e.target.value;
    setValue('tag', newTagValue);

    if (newTagValue && newTagValue.trim() !== '') {
      setValue('goal', '');
    }
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGoalValue = e.target.value;
    setValue('goal', newGoalValue);

    if (newGoalValue && newGoalValue.trim() !== '') {
      setValue('tag', '');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
      <Input
        inputName="amount"
        inputType="text"
        label="Amount"
        placeholder="Enter amount..."
        required
        className="mx-auto"
        error={errors.amount?.message}
        {...register('amount', { valueAsNumber: true })}
      />

      <div className="w-full max-w-xs bg-white rounded-lg font-mono mx-auto">
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
        {errors.currency && (
          <p className="mt-1 text-sm text-red-500">
            {errors.currency?.message}
          </p>
        )}
      </div>

      <Textarea
        textareaName="description"
        label="Description"
        placeholder="Enter description..."
        rows={3}
        maxLength={500}
        required
        className="mx-auto"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="w-full max-w-xs bg-white rounded-lg font-mono mx-auto">
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

      <div className="w-full max-w-xs bg-white rounded-lg font-mono mx-auto">
        <label className="block text-gray-600 text-sm font-bold mb-2">
          Tag
        </label>
        <div className="flex gap-2">
          <select
            className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-gray-50 disabled:shadow-none
          disabled:hover:shadow-none
          disabled:transform-none
          disabled:border-gray-200
          disabled:bg-gray-100
          disabled:focus:outline-none
          disabled:focus:ring-0
          disabled:cursor-not-allowed"
            {...register('tag')}
            onChange={handleTagChange}
            disabled={!!(goalValue && goalValue.trim() !== '')}
          >
            <option value="">None</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
          <button
            type="button"
            className="hover:text-green-600 transition-colors cursor-pointer disabled:hover:shadow-none
          disabled:transform-none
          disabled:text-gray-100
          disabled:focus:outline-none
          disabled:focus:ring-0
          disabled:cursor-not-allowed"
            onClick={onAddTag}
            disabled={!!(goalValue && goalValue.trim() !== '')}
          >
            <SquarePlus className="text-green-500 w-8 h-8" />
          </button>
        </div>

        {errors.tag && (
          <p className="mt-1 text-sm text-red-500">{errors.tag?.message}</p>
        )}
      </div>

      <div className="w-full max-w-xs bg-white rounded-lg font-mono mx-auto">
        <label className="block text-gray-600 text-sm font-bold mb-2">
          Goal
        </label>
        <select
          className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-gray-50  disabled:shadow-none
        disabled:hover:shadow-none
        disabled:transform-none
        disabled:border-gray-200
        disabled:bg-gray-100
        disabled:focus:outline-none
        disabled:focus:ring-0
        disabled:cursor-not-allowed"
          {...register('goal')}
          onChange={handleGoalChange}
          disabled={!!(tagValue && tagValue.trim() !== '')}
        >
          <option value="">None</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>
        {errors.goal && (
          <p className="mt-1 text-sm text-red-500">{errors.goal?.message}</p>
        )}
      </div>

      <div className="w-full max-w-xs bg-white rounded-lg font-mono mx-auto">
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

      <Submit
        className="mx-auto"
        type="submit"
        name="Add Transaction"
        disabled={!isValid}
      />
    </form>
  );
};
