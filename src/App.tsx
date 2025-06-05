import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MainLayout } from './layouts/MainLayout.tsx';
import { AuthLayout } from './layouts/AuthLayout.tsx';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { GoalsPage } from './pages/GoalsPage/GoalsPage.tsx';
import { TransactionsPage } from './pages/TransactionsPage/TransactionsPage.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { AuthPage } from './pages/Auth/AuthPage.tsx';

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
          <Route element={<AuthLayout />} path="/auth/*">
            <Route path="authorization" element={<AuthPage />} />
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
