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
  const { createGoal, refetchGoal } = useGoals();

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
      await refetchGoal();

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">

      <label className="floating-label w-full">
        <span className="text-sm text-gray-600">Name</span>
        <input
          type="text"
          placeholder="Name"
          className="input w-full bg-gray-100 focus:outline-none rounded-lg"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </label>
      <div className="flex gap-4">
        <label className="floating-label w-full">
          <span className="text-sm text-gray-600">Target Amount</span>
          <input
            type="number"
            placeholder="Target Amount"
            className="select w-full bg-gray-100 focus:outline-none rounded-lg"
            {...register('targetAmount', {
              required: 'Amoun is required',
              valueAsNumber: true,
              min: { value: 0.01, message: 'Amount must be greater than 0' },
            })}
          />
        </label>
        {errors.targetAmount && (
          <p className="text-red-500 text-xs mt-1">
            {errors.targetAmount.message}
          </p>
        )}
        <label className="floating-label w-32">
          <span className="text-sm text-gray-600">Currency *</span>
          <select
            className="select w-full bg-gray-100 focus:outline-none rounded-lg"
            {...register('currency', { required: 'Currency is required' })}
          >
            <option value="">Select Currrency</option>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          {errors.currency && (
            <p className="text-red-500 text-xs mt-1">
              {errors.currency.message}
            </p>
          )}
        </label>
      </div>

      <label className="floating-label">
        <span className="text-sm text-gray-600">Data *</span>
        <input
          type="date"
          className="input w-full border-none bg-gray-100 focus:outline-none rounded-lg"
          min={new Date().toISOString().split('T')[0]}
          {...register('deadline')}
        />
        {errors.deadline && (
          <p className="text-red-500 text-xs mt-1">{errors.deadline.message}</p>
        )}
      </label>

      <Submit
        className="mx-auto"
        type="submit"
        name="Add Goal"
        disabled={!isValid}
      />
    </form>
  );
};
