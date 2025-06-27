// src/pages/GoalsPage/GoalsPage.tsx
import { useState } from 'react';
import { Box } from '../../components/Box/Box';
import { useGoals } from '../../hooks/useGoals';
import { GoalModal } from './Components/GoalModal';
import { Modal } from '../../components/Modal/Modal';


export const GoalsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { goals } = useGoals();

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
