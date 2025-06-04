// src/pages/GoalsPage/GoalsPage.tsx
import { useState } from 'react';
import { Box } from '../../components/Box/Box';
import Table from '../../components/Table/Table';
import type { TableColumn } from '../../components/Table/Table';

interface Goal extends Record<string, unknown> {
  id: string | number;
  currentAmount: number;
  targetAmount: number;
  deadline: string;
  name: string;
  currency: string;
}

export const GoalsPage = () => {
  // Przykładowe dane
  const [goals] = useState<Goal[]>([
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
    alert('Kliknięto na "Dodaj nowy cel"!');
  };

  // Definicja kolumn dla tabeli
  const columns: TableColumn<Goal>[] = [
    {
      key: 'name',
      header: 'Nazwa celu',
      className: 'font-medium',
    },
    {
      key: 'currentAmount',
      header: 'Aktualna kwota',
      renderCell: (item) => `${item.currentAmount} ${item.currency}`,
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
    <div className="px-2 py-6 mx-auto">
      <h1 className="text-2xl font-bold">Cele finansowe</h1>
      <p className="mt-4">Zarządzaj swoimi celami finansowymi.</p>

      <div className="flex gap-2 flex-wrap mb-8">
        {goals.map((el) => (
          <Box key={el.id} data={el}></Box>
        ))}
        <Box type="add" onClick={handleAddNewGoalClick}></Box>
      </div>

      <Table columns={columns} data={goals} idKey="id" />
    </div>
  );
};
