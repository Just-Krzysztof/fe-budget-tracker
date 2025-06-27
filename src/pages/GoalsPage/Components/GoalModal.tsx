import { Input } from '../../../components/Form/Input';
import { Submit } from '../../../components/Form/Submit';
import { useGoalForm } from '../hooks/useGoalsForm';
import { useGoals } from '../../../hooks/useGoals';
import { useCurrencies } from '../../../contexts/CurrencyContext';

interface GoalModalProps {
  onClose: () => void;
}

export const GoalModal = ({ onClose }: GoalModalProps) => {
  const form = useGoalForm();
  const currencies = useCurrencies();
  const { createGoal, refetch } = useGoals();

  type GoalFormData = {
    name: string;
    targetAmount: number;
    deadline: string;
    currency: string;
  };

  const onSubmit = async (data: GoalFormData) => {
    try {
      await createGoal({
        name: data.name,
        targetAmount: data.targetAmount,
        deadline: data.deadline,
        currency: data.currency,
      });
      await refetch();

      form.reset();
      onClose();
    } catch (err) {
      console.error('err', err);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = form;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
      <label className='floating-label'>
        <span>Name</span>
        <input type="text" placeholder='Name' className='input w-full bg-gray-100 focus:outline-none' {...register('name')}/>
        
      </label>
      <p>{errors.name?.message}</p>
      <label className="floating-label">
        <span>Target Amount</span>
        <input
          type="number"
          placeholder="Target Amount"
          className="input w-full bg-gray-100 focus:outline-none"
          {...register('targetAmount', { valueAsNumber: true })}
        />
      </label>
      <p>{errors.targetAmount?.message}</p>

      <div className="w-full max-w-xs bg-white rounded-lg font-mono mx-auto">
        <label className="block text-gray-600 text-sm font-bold mb-2">
          Deadline
        </label>
        <input
          type="date"
          className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-gray-50"
          {...register('deadline')}
        />
        {errors.deadline && (
          <p className="mt-1 text-sm text-red-500">{errors.deadline.message}</p>
        )}
      </div>

      <div className="w-full max-w-xs bg-white rounded-lg font-mono mx-auto">
        <label className="block text-gray-600 text-sm font-bold mb-2">
          Currency
        </label>
        <select
          className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-gray-50"
          {...register('currency')}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        {errors.currency && (
          <p className="mt-1 text-sm text-red-500">{errors.currency.message}</p>
        )}
      </div>

      <Submit
        className="mx-auto"
        type="submit"
        name="Add Goal"
        disabled={!isValid}
      />
    </form>
  );
};
