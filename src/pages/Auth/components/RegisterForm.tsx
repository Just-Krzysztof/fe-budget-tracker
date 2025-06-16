import { useAuth } from '../../../hooks/useAuth';
import type { RegisterCredentials } from '../../../types/auth.types';
import { useForm } from 'react-hook-form';
import { Input } from '../../../components/Form/Input';
import { Submit } from '../../../components/Form/Submit';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const RegisterForm = () => {
  const {
    register: registerUser,
    isLoading,
    error,
    isAuthenticated,
  } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCredentials>({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      currency: 'PLN', //default currency
    },
  });

  // const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterCredentials) => {
    try {
      await registerUser(data);
    } catch (err) {
      console.error('Register failed:', err);
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
        inputName="name"
        label="Name"
        inputType="text"
        required
        error={errors.name?.message}
        {...register('name', {
          required: 'Name is required',
          minLength: {
            value: 2,
            message: 'Name must be at least 2 characters',
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
      <Input
        inputName="currency"
        label="Currency"
        inputType="text"
        required
        error={errors.currency?.message}
        {...register('currency', {
          required: 'Currency is required',
          pattern: {
            value: /^[A-Z]{3}$/,
            message: 'Currency must be a 3-letter code (e.g., USD, EUR)',
          },
        })}
      />
      <Submit
        type="submit"
        name={isLoading ? 'Creating account...' : 'Register'}
        disabled={isLoading}
      />
      {/* <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button> */}
    </form>
  );
};
