import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import LoginForm, { LoginHeader, LoginLink } from '../components/auth/LogInAuth';
import AlertMessage from '../components/auth/AlertMessage';
import FormDivider from '../components/auth/FormDivider';
import { SignupLink } from '../components/auth/SignUpAuth';
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
