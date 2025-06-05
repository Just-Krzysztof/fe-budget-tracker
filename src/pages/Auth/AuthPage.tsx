import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';

export const AuthPage = () => {
  return (
    <>
      <div className="flex flex-col">
        <h1>Login</h1>
        <LoginForm></LoginForm>
        <RegisterForm></RegisterForm>
      </div>
    </>
  );
};
