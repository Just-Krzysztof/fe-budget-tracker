import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { GoalsPage } from './pages/GoalsPage/GoalsPage.tsx';
import { TransactionsPage } from './pages/TransactionsPage/TransactionsPage.tsx';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthPage } from './pages/Auth/AuthPage';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minut
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Publiczne routy */}
          <Route path="/auth/*" element={<AuthPage />} />

          {/* Chronione routy */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
