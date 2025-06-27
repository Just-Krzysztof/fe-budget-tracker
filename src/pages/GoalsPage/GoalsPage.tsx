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
            goals.slice(0, 3).map((el) => <Box key={el.id} data={el}></Box>)}

          <Box type="add" onClick={() => setShowModal(true)}></Box>
        </div>

        <div className="mt-8 overflow-x-auto rounded-box bg-gray-100">
          <table className="table table-pin-rows table-auto table-pin-cols rounded-2xl w-full">
            <thead className="">
              <tr className="border-b-1 border-indigo-300 bg-gray-100 text-black">
                <td />
                <td className="text-center">Name</td>
                <td className="text-center w-[75px] md:w-sm">Type</td>
                <td className="text-center">Description</td>
              </tr>
            </thead>
            <tbody>
              {goals.length > 0 &&
                goals.map((goal, index: number) => (
                  <tr
                    key={goal.id}
                    className=" border-indigo-300 text-black hover:text-gray-500 not-last:border-b-1 hover:bg-gray-100"
                  >
                    <td>{index}</td>
                    <td>{goal.name}</td>
                    {/* <td className="text-center">{`${JSON.stringify(goal)} ${goal.currency}`}</td> */}
                    <td className="flex w-full items-center gap-2">
                      {goal.currentAmount}{' '}
                      <progress
                        className="progress progress-primary w-[75px] md:w-full"
                        value={goal.currentAmount}
                        max={goal.targetAmount}
                      ></progress>{' '}
                      {goal.targetAmount}
                    </td>
                    <td className="text-center">
                      {new Date(goal.deadline).toLocaleDateString('pl-PL')}
                    </td>
                    {/* <td className="text-center">
                  <TypeCell type={transaction.type} />
                </td>
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
                </td> */}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
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
