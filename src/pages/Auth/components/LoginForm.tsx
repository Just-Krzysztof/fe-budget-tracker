import { useAuth } from '../../../hooks/useAuth';
import type { LoginCredentials } from '../../../types/auth.types';
import { useForm } from 'react-hook-form';
import { Submit } from '../../../components/Form/Submit';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const LoginForm = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
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
      {/* TODO Check it */}
      {/* for better https://daisyui.com/components/hero/ */}
      <label className="floating-label">
        <span>Email</span>
        <input
          type="email"
          className={`input input-bordered w-full focus:outline-none`}
          placeholder="Email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </label>
      <label className="floating-label">
        <span>Password</span>
        <input
          type="password"
          className={`input input-bordered w-full focus:outline-none`}
          placeholder="Password"
          autoComplete="current-password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </label>
      <Submit
        type="submit"
        name={isLoading ? 'Logging in...' : 'Login'}
        disabled={isLoading}
      />
    </form>
  );
};
