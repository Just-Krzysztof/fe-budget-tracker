import { useAuth } from '../../../hooks/useAuth';
import type { RegisterCredentials } from '../../../types/auth.types';
import { useForm } from 'react-hook-form';
import { Input } from '../../../components/Form/Input';
import { Submit } from '../../../components/Form/Submit';

export const RegisterForm = () => {
  const { register: registerUser, isLoading, error } = useAuth();
  const { register, handleSubmit } = useForm<RegisterCredentials>();

  const onSubmit = async (data: RegisterCredentials) => {
    await registerUser(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mx-auto w-xs"
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
        inputName="name"
        label="Name"
        inputType="text"
        required
        {...register('name')}
      />
      <Input
        inputName="password"
        label="Password"
        inputType="password"
        required
        {...register('password')}
      />
      <Input
        inputName="currency"
        label="Currency"
        inputType="text"
        required
        {...register('currency')}
      />
      <Submit type="submit" name="Send" disabled={isLoading} />
      {/* <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button> */}
    </form>
  );
};
