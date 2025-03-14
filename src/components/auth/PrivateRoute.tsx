import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Jeśli trwa ładowanie, możemy pokazać loader
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  // Jeśli użytkownik nie jest uwierzytelniony, przekieruj do logowania
  if (!isAuthenticated) {
    // Zapisujemy ścieżkę, z której użytkownik został przekierowany
    // Aby po zalogowaniu wrócić do tej ścieżki
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jeśli użytkownik jest uwierzytelniony, renderuj chronioną zawartość
  return <>{children}</>;
}; 