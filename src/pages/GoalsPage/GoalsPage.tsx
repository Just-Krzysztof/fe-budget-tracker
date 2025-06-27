// src/pages/GoalsPage/GoalsPage.tsx
import { useState } from 'react';
import { Box } from '../../components/Box/Box';
import Table from '../../components/Table/Table';
import type { TableColumn } from '../../components/Table/Table';
import { useGoals } from '../../hooks/useGoals';
import type { Goal as ApiGoal } from '../../api/goals.api';
import { GoalModal } from './Components/GoalModal';
import { Modal } from '../../components/Modal/Modal';

type Goal = ApiGoal & Record<string, unknown>;

export const GoalsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { goals } = useGoals();

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
        {/* <p className="mt-4">Zarządzaj swoimi celami finansowymi.</p> */}

        <div className="flex gap-2 flex-wrap my-8">
          {goals.length > 0 &&
            goals.slice(0,3).map((el) => (
              <Box key={el.id} data={el}></Box>
            ))}

          <Box type="add" onClick={() => setShowModal(true)}></Box>
        </div>

        {/* <Table
          columns={columns}
          data={(goals ?? []) as (Goal & Record<string, unknown>)[]}
          idKey="id"
        /> */}
      </div>
      {showModal && (
        <Modal
          show={showModal}
          setShow={() => setShowModal(false)}
          alignment="center"
          isIntercepting={true}
          showCancelBtnINSmallDevice={true}
          isTitle={'Set your goal !'}
        >
          <GoalModal onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </>
  );
};
