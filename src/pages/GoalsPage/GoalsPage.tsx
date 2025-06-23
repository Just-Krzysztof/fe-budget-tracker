// src/pages/GoalsPage/GoalsPage.tsx
import { useState } from 'react';
import { Box } from '../../components/Box/Box';
import Table from '../../components/Table/Table';
import type { TableColumn } from '../../components/Table/Table';
import { Modal } from '../../components/Modal/Modal';
import { useCurrencies } from '../../contexts/CurrencyContext';
import { Input } from '../../components/Form/Input';
import { Submit } from '../../components/Form/Submit';
import { useTags } from '../../hooks/useTags';
import { useGoalForm } from './hooks/useGoalsForm';
import { useGoals } from '../../hooks/useGoals';

interface Goal extends Record<string, unknown> {
  id: string | number;
  currentAmount: number;
  targetAmount: number;
  deadline: string;
  name: string;
  currency: string;
}

type GoalFormData = {
  name: string;
  targetAmount: number;
  deadline: string;
  currency: string;
  tag: string;
};

export const GoalsPage = () => {
  const form = useGoalForm();

  const currencies = useCurrencies();
  const [showModal, setShowModal] = useState(false);
  const { tags } = useTags();
  const { goals, createGoal } = useGoals();

  const onSubmit = async (data: GoalFormData) => {
    try {
      console.log('data.tag', data.tag);

      await createGoal({
        name: data.name,
        targetAmount: data.targetAmount,
        deadline: data.deadline,
        currency: data.currency,
      });
      await refetch();

      form.reset();
      setShowModal(false);
    } catch (err) {
      console.log('err', err);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = form;
  const [goalsList] = useState<Goal[]>([
    {
      id: 1,
      currentAmount: 234,
      targetAmount: 2500,
      deadline: '2030-07-22T10:00:00.000Z',
      name: 'Mieszkanie',
      currency: 'PLN',
    },
    {
      id: 2,
      currentAmount: 50,
      targetAmount: 3500,
      deadline: '2030-07-22T10:00:00.000Z',
      name: 'Auto',
      currency: 'PLN',
    },
    {
      id: 3,
      currentAmount: 1760,
      targetAmount: 2500,
      deadline: '2030-07-22T10:00:00.000Z',
      name: 'Motor',
      currency: 'PLN',
    },
  ]);

  const handleAddNewGoalClick = () => {
    setShowModal(!showModal);
  };

  const columns: TableColumn<Goal>[] = [
    {
      key: 'name',
      header: 'Nazwa celu',
      className: 'font-medium',
    },
    {
      key: 'targetAmount',
      header: 'Docelowa kwota',
      renderCell: (item) => `${item.targetAmount} ${item.currency}`,
    },
    {
      key: 'deadline',
      header: 'Termin',
      renderCell: (item) => new Date(item.deadline).toLocaleDateString('pl-PL'),
    },
    {
      key: 'currentAmount',
      header: 'Postęp',
      renderCell: (item) => {
        const progress = (item.currentAmount / item.targetAmount) * 100;
        return (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="px-2 py-6 mx-auto">
        <h1 className="text-2xl font-bold">Cele finansowe</h1>
        <p className="mt-4">Zarządzaj swoimi celami finansowymi.</p>

        <div className="flex gap-2 flex-wrap mb-8">
          {goalsList.map((el) => (
            <Box key={el.id} data={el}></Box>
          ))}
          <Box type="add" onClick={handleAddNewGoalClick}></Box>
        </div>

        <Table columns={columns} data={goalsList} idKey="id" />
      </div>
      <Modal
        show={showModal}
        setShow={() => setShowModal(false)}
        alignment="center"
        isIntercepting={true}
        showCancelBtnINSmallDevice={true}
        isTitle={'Set your goal !'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
          <Input
            inputName="name"
            inputType="text"
            label="Name of Goal"
            placeholder="Enter name..."
            required
            className="mx-auto"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            inputName="targetAmount"
            inputType="number"
            label="targetAmount"
            placeholder="Enter target amount..."
            required
            className="mx-auto"
            error={errors.targetAmount?.message}
            {...register('targetAmount', { valueAsNumber: true })}
          />

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
              <p className="mt-1 text-sm text-red-500">
                {errors.deadline.message}
              </p>
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
              <p className="mt-1 text-sm text-red-500">
                {errors.currency.message}
              </p>
            )}
          </div>

          <Submit
            className="mx-auto"
            type="submit"
            name="Add Goal"
            disabled={!isValid}
          />
        </form>
      </Modal>
    </>
  );
};
