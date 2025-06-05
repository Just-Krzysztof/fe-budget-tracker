import { useAuth } from '../../../hooks/useAuth';
import type { LoginCredentials } from '../../../types/auth.types';

export const LoginPage = () => {
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const credentials: LoginCredentials = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };
    login(credentials);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error.message}</div>}
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
