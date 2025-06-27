import { useAuth } from '../../../hooks/useAuth';
import type { RegisterCredentials } from '../../../types/auth.types';
import { useForm } from 'react-hook-form';
import { Submit } from '../../../components/Form/Submit';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const RegisterForm = () => {
  const {
    register: registerUser,
    isLoading,
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
        <span>Name</span>
        <input
          type="name"
          className={`input input-bordered w-full focus:outline-none`}
          placeholder="Name"
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </label>
      <label className="floating-label">
        <span>Password</span>
        <input
          type="password"
          className={`input input-bordered w-full focus:outline-none`}
          placeholder="Password"
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
      <label className="floating-label">
        <span>Currency</span>
        <input
          type="text"
          className={`input input-bordered w-full focus:outline-none`}
          placeholder="Currency"
          {...register('currency', {
            required: 'Currency is required',
            pattern: {
              value: /^[A-Z]{3}$/,
              message: 'Currency must be a 3-letter code (e.g., USD, EUR)',
            },
          })}
        />
        {errors.currency && (
          <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>
        )}  
      </label>
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
