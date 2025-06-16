import { useAuth } from '../../../hooks/useAuth';
import type { LoginCredentials } from '../../../types/auth.types';
import { Input } from '../../../components/Form/Input';
import { useForm } from 'react-hook-form';
import { Submit } from '../../../components/Form/Submit';

export const LoginForm = () => {
  const { login, isLoading, error } = useAuth();
  const { register, handleSubmit } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    login(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full max-w-md px-4 sm:px-6 mx-auto"
    >
      {error && <div className="error">{error.message}</div>}

      <Input
        inputName="email"
        label="Email"
        inputType="email"
        required
        {...register('email')}
      />
      <Input
        inputName="password"
        label="Password"
        inputType="password"
        required
        {...register('password')}
      />
     <Submit type="submit" name="Send" disabled={isLoading} />
    </form>
  );
};
