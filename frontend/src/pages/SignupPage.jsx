import React from 'react';
import AuthLayout from '../components/AuthLayout';
import SignupHeader from '../components/auth/SignupHeader';
import AlertMessage from '../components/auth/AlertMessage';
import SignupForm from '../components/auth/SignupForm';
import LoginLink from '../components/auth/LoginLink';
import { useSignupPage } from '../services/AuthLogic';
import '../styles/signup/SignupPage.css';

const SignupPage = () => {
  const {
    name,
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    program,
    yearLevel,
    error,
    success,
    loading,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setProgram,
    setYearLevel,
    handleSubmit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = useSignupPage();

  return (
    <AuthLayout type="signup">
      <div className="w-full max-w-md mx-auto animate-fadeIn">
        <SignupHeader />
        
        <AlertMessage type="error" message={error} />
        <AlertMessage type="success" message={success} />
        
        <SignupForm
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          program={program}
          setProgram={setProgram}
          yearLevel={yearLevel}
          setYearLevel={setYearLevel}
          loading={loading}
          onSubmit={handleSubmit}
          onTogglePassword={togglePasswordVisibility}
          onToggleConfirmPassword={toggleConfirmPasswordVisibility}
        />

        <LoginLink />
      </div>
    </AuthLayout>
  );
};

export default SignupPage;