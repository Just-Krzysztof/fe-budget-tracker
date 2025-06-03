// src/pages/GoalsPage/GoalsPage.tsx
import { useState } from 'react';
import { Box } from '../../components/Box/Box';

export const GoalsPage = () => {
  const [data, setData] = useState([
    {
      currentAmount: 234,
      targetAmount: 2500,
      deadline: '2030-07-22T10:00:00.000Z',
      name: 'Mieszkanie',
      currency: 'PLN',
    },
    {
      currentAmount: 50,
      targetAmount: 3500,
      deadline: '2030-07-22T10:00:00.000Z',
      name: 'Auto',
      currency: 'PLN',
    },
    {
      currentAmount: 1760,
      targetAmount: 2500,
      deadline: '2030-07-22T10:00:00.000Z',
      name: 'Motor',
      currency: 'PLN',
    },
  ]);

  const handleAddNewGoalClick = () => {
    alert('Kliknięto na "Dodaj nowy cel"!');
  };

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold">Goals</h1>
      <p className="mt-4">Adjust your preferences here.</p>

      <div className="flex gap-2 flex-wrap">
        {data.map((el) => (
          <Box key={el.name} data={el}></Box>
        ))}

        <Box type="add" onClick={handleAddNewGoalClick}></Box>
      </div>
    </div>
  );
};
