import React from 'react';
import AuthLayout from '../components/AuthLayout';
import LoginHeader from '../components/login/LoginHeader';
import AlertMessage from '../components/login/AlertMessage';
import LoginForm from '../components/login/LoginForm';
import FormDivider from '../components/login/FormDivider';
import SignupLink from '../components/login/SignupLink';
import { useLoginPage } from '../logic/login/LoginPage.logic';
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
