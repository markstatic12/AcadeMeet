import React from 'react';
import AuthLayout from '../components/AuthLayout';
import LoginHeader from '../components/auth/LoginHeader';
import AlertMessage from '../components/auth/AlertMessage';
import LoginForm from '../components/auth/LoginForm';
import FormDivider from '../components/auth/FormDivider';
import SignupLink from '../components/auth/SignupLink';
import { useLoginPage } from '../services/AuthLogic';
import '../styles/login/LoginPage.css';

const LoginPage = () => {
  const {
    email,
    password,
    showPassword,
    error,
    loading,
    setEmail,
    setPassword,
    togglePasswordVisibility,
    handleSubmit
  } = useLoginPage();

  return (
    <AuthLayout type="login">
      <div className="w-full max-w-md mx-auto animate-fadeIn">
        <LoginHeader />
        
        <AlertMessage message={error} />
        
        <LoginForm
          email={email}
          password={password}
          showPassword={showPassword}
          loading={loading}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onTogglePassword={togglePasswordVisibility}
          onSubmit={handleSubmit}
        />
        
        <FormDivider />
        
        <SignupLink />
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
