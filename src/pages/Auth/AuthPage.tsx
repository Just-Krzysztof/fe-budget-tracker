import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Tabs } from '../../components/Tabs/Tabs';
export const AuthPage = () => {
  const authTabs = [
    {
      id: 'login',
      label: 'Login',
      content: <LoginForm />,
    },
    {
      id: 'register',
      label: 'Register',
      content: <RegisterForm />,
    },
  ];
  return (
    <div className="flex flex-col max-w-xs mx-auto py-32">
      <Tabs tabs={authTabs} defaultTab="login" title transition="slide" />
    </div>
  );
};
