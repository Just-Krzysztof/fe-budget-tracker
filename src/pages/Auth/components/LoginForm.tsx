import { useAuth } from '../../../hooks/useAuth';
import type { LoginCredentials } from '../../../types/auth.types';
import { Input } from '../../../components/Form/Input';
import { useForm } from 'react-hook-form';
import { Submit } from '../../../components/Form/Submit';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const LoginForm = () => {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated);

    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginCredentials) => {
    try {
      const result = await login(data);
      if (result) {
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full max-w-md px-4 sm:px-6 mx-auto"
    >
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error.message}</span>
        </div>
      )}

      <Input
        inputName="email"
        label="Email"
        inputType="email"
        required
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
      />
      <Input
        inputName="password"
        label="Password"
        inputType="password"
        required
        error={errors.password?.message}
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        })}
      />
      <Submit
        type="submit"
        name={isLoading ? 'Logging in...' : 'Login'}
        disabled={isLoading}
      />
    </form>
  );
};
