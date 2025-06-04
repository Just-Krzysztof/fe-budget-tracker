import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { MainLayout } from './layouts/MainLayout.tsx';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { GoalsPage } from './pages/GoalsPage/GoalsPage.tsx';
import { TransactionsPage } from './pages/TransactionsPage/TransactionsPage.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
