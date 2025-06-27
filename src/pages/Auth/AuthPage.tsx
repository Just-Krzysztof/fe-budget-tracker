import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
export const AuthPage = () => {

  return (
    <div className='flex flex-col max-w-xs mx-auto py-32'>

    <div className="tabs tabs-border justify-center">
      <input type="radio" name="auth" className="tab" aria-label="Login" />
      <div className="tab-content pt-10">
      <LoginForm />
      </div>

      <input
        type="radio"
        name="auth"
        className="tab"
        aria-label="Register"
        defaultChecked
      />
      <div className="tab-content pt-10">
        <RegisterForm/>
      </div>
    </div>
    </div>
  );
};
