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
  const { tags } = useTags();
  const { goals } = useGoals();
  const currencies = useCurrencies();

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
      <div className="flex gap-5  ">
        <label className="floating-label w-full">
          <span className="">Amount</span>
          <input
            type="number"
            className={`input w-full bg-gray-100 focus:outline-none`}
            placeholder="Amount"
            {...register('amount', { valueAsNumber: true })}
          />
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
          )}
        </label>

        <label className="floating-label w-3xs">
          <span>Currency</span>
          <select
            defaultValue=""
            className="select w-full bg-gray-100 focus:outline-none"
            {...register('currency')}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="floating-label">
        <span>Typ</span>
        <select
          defaultValue=""
          className="select bg-gray-100 w-full 
          focus:outline-none disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500"
          {...register('type')}
        >
          <option value="INCOME">INCOME</option>
          <option value="EXPENSE">EXPENSE</option>
          <option value="SAVING">SAVING</option>
        </select>
        {errors.type && (
          <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
        )}
      </label>

      <label className="floating-label">
        <span>Description</span>
        <textarea
          className="textarea resize-none w-full bg-gray-100 focus:outline-none"
          placeholder="Description"
          {...register('description', { required: true, min: 3 })}
        ></textarea>
      </label>

      <div className="flex items-center gap-4">
        <label className="floating-label w-full">
          <span>Tag</span>
          <select
            defaultValue=""
            className="select bg-gray-100 w-full disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500 focus:outline-none"
            {...register('tag')}
            onChange={handleTagChange}
            disabled={!!(goalValue && goalValue.trim() !== '')}
          >
            <option value="">None</option>
            {tags.length > 0 &&
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
          className="hover:text-green-600 transition-colors cursor-pointer disabled:hover:shadow-none
          focus:outline-none
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

      <label className="floating-label">
        <span>Goal</span>
        <select
          defaultValue=""
          className="select bg-gray-100 w-full 
          focus:outline-none disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500"
          {...register('goal')}
          onChange={handleGoalChange}
          disabled={!!(tagValue && tagValue.trim() !== '')}
        >
          <option value="">None</option>
          {goals.length > 0 &&
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
        <span className="pointer-events-none">Date</span>
        <input
          type="date"
          className="input w-full border-none bg-gray-100 focus:outline-none"
          {...register('date', {
            valueAsDate: true,
            required: true
          })}
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
        )}
      </label>

      <Submit
        className="mx-auto"
        type="submit"
        name="Add Transaction"
        disabled={false}
      />
    </form>
  );
};
