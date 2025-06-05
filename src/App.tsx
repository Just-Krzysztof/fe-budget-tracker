import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MainLayout } from './layouts/MainLayout.tsx';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { GoalsPage } from './pages/GoalsPage/GoalsPage.tsx';
import { TransactionsPage } from './pages/TransactionsPage/TransactionsPage.tsx';
import { LoginPage } from './pages/Auth/components/LoginForm.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Czas 5 min
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/*">
            <Route path="authorization" element={<LoginPage />}></Route>
          </Route>
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
