import { Submit } from '../Form/Submit';
import { SquarePlus } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { Transaction as TransactionFormData } from '../../pages/TransactionsPage/types/transaction';
import { useTags } from '../../hooks/useTags';
import { useGoals } from '../../hooks/useGoals';
import { useCurrencies } from '../../contexts/CurrencyContext';

interface TransactionFormProps {
  form: UseFormReturn<TransactionFormData>;
  onSubmit: (data: TransactionFormData) => void;
  onAddTag: () => void;
  tagValue?: string;
  goalValue?: string;
  isSubmitting?: boolean;
}

export const TransactionForm = ({
  form,
  onSubmit,
  onAddTag,
  tagValue,
  goalValue,
  isSubmitting = false,
}: TransactionFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = form;
  const { tags, isLoading: isLoadingTags } = useTags();
  const { goals, isLoading: isLoadingGoals } = useGoals();
  const currencies = useCurrencies();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
      <div className="flex gap-4">
        <label className="floating-label w-full">
          <span className="text-sm text-gray-600">Amount *</span>
          <input
            type="number"
            step="0.01"
            className="input w-full bg-gray-100 focus:outline-none rounded-lg cursor-pointer"
            placeholder="0.00"
            {...register('amount', { 
              required: 'Amoun is required',
              valueAsNumber: true,
              min: { value: 0.01, message: 'Amount must be greater than 0' }
            })}
          />
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
          )}
        </label>

        <label className="floating-label w-32">
          <span className="text-sm text-gray-600">Currency *</span>
          <select
            className="select w-full bg-gray-100 focus:outline-none rounded-lg cursor-pointer" 
            {...register('currency', { required: 'Waluta jest wymagana' })}
          >
            <option value="">Select currency</option>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          {errors.currency && (
            <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>
          )}
        </label>
      </div>

      <label className="floating-label">
        <span className="text-sm text-gray-600">Rodzaj transakcji *</span>
        <select
          className="select bg-gray-100 w-full focus:outline-none rounded-lg cursor-pointer"
          {...register('type', { required: 'Rodzaj transakcji jest wymagany' })}
        >
          <option value="">Select Type</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
          <option value="SAVING">Save</option>
          {/* <option value="INCOME">Przychód</option>
          <option value="EXPENSE">Wydatek</option>
          <option value="SAVING">Oszczędność</option> */}
        </select>
        {errors.type && (
          <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
        )}
      </label>

      <label className="floating-label">
        <span className="text-sm text-gray-600">Description</span>
        <textarea
          className="textarea resize-none w-full bg-gray-100 focus:outline-none rounded-lg h-24 cursor-pointer"
          placeholder="Dodaj opis transakcji..."
          {...register('description', { 
            minLength: { value: 3, message: 'The description must be at least 3 characters long' }
          })}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
        )}
      </label>

      <div className="flex items-end gap-4">
        <label className="floating-label w-full">
          <span className="text-sm text-gray-600">Tag</span>
          <select
            className="select bg-gray-100 w-full disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500 focus:outline-none rounded-lg cursor-pointer"
            {...register('tag')}
            disabled={!!(goalValue && goalValue.trim() !== '') || isLoadingTags}
            >
            {/* onChange={handleTagChange} */}
            <option value="">
              {isLoadingTags ? 'Ładowanie tagów...' : 'Wybierz tag'}
            </option>
            {!isLoadingTags && tags.length > 0 &&
              tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
          </select>
          {errors.tag && (
            <p className="text-red-500 text-xs mt-1">{errors.tag.message}</p>
          )}
        </label>
        <button
          type="button"
          className="p-1 hover:bg-green-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onAddTag}
          disabled={!!(goalValue && goalValue.trim() !== '')}
        >
          <SquarePlus className="text-green-500 w-8 h-8" />
        </button>
      </div>

      <label className="floating-label">
        <span className="text-sm text-gray-600">Cel</span>
        <select
          className="select bg-gray-100 w-full focus:outline-none disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500 rounded-lg cursor-pointer"
          {...register('goal')}
          disabled={!!(tagValue && tagValue.trim() !== '') || isLoadingGoals}
          >
          {/* onChange={handleGoalChange} */}
          <option value="">
            {isLoadingGoals ? 'Ładowanie celów...' : 'Wybierz cel'}
          </option>
          {!isLoadingGoals && goals.length > 0 &&
            goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.name}
              </option>
            ))}
        </select>
        {errors.goal && (
          <p className="text-red-500 text-xs mt-1">{errors.goal.message}</p>
        )}
      </label>
      <label className="floating-label">
        <span className="text-sm text-gray-600">Data *</span>
        <input
          type="date"
          className="input w-full border-none bg-gray-100 focus:outline-none rounded-lg date-input cursor-pointer"
          max={new Date().toISOString().split('T')[0]}
          style={{
            colorScheme: 'light',
          }}
          {...register('date', {
            required: 'Data jest wymagana',

          })}
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
        )}
      </label>

      <Submit
        className="w-full"
        type="submit"
        name={isSubmitting ? 'Dodawanie...' : 'Dodaj Transakcję'}
        disabled={!isValid || isSubmitting}
        isLoading={isSubmitting}
      />
    </form>
  );
};
