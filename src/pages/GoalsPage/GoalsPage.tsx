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
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Cele finansowe</h1>
        <p className="text-slate-600">Zarządzaj swoimi celami finansowymi</p>
      </div>

      {/* Goal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {goals.length > 0 &&
          goals.slice(0, 3).map((el) => (
            <div key={el.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-300">
              <Box data={el} />
            </div>
          ))}

        <div 
          className="bg-white rounded-2xl shadow-sm border border-slate-200 border-dashed p-6 hover:shadow-md hover:border-indigo-300 transition-all duration-300 cursor-pointer flex items-center justify-center min-h-[200px]"
          onClick={() => setShowModal(true)}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-indigo-600 text-2xl font-bold">+</span>
            </div>
            <p className="text-slate-600 font-medium">Dodaj nowy cel</p>
          </div>
        </div>
      </div>

      {/* Goals Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Lista celów</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">LP.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">NAZWA</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">POSTĘP</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">TERMIN</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {goals.length > 0 &&
                goals.map((goal, index: number) => (
                  <tr
                    key={goal.id}
                    className="hover:bg-slate-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                      {goal.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-slate-600">
                          {goal.currentAmount}
                        </span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[150px]">
                          <div 
                            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-600">
                          {goal.targetAmount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-900">
                      {new Date(goal.deadline).toLocaleDateString('pl-PL')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          show={showModal}
          setShow={() => setShowModal(false)}
          alignment="center"
          isIntercepting={true}
          showCancelBtnINSmallDevice={true}
          isTitle={'Ustaw swój cel!'}
        >
          <GoalModal onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  );
};
