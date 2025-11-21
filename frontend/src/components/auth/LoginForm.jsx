import React from 'react';
import EmailInput from '../ui/EmailInput';
import PasswordInput from '../ui/PasswordInput';
import FormOptions from './FormOptions';
import SubmitButton from './SubmitButton';

const LoginForm = ({ 
  email, 
  password, 
  showPassword, 
  loading, 
  onEmailChange, 
  onPasswordChange, 
  onTogglePassword, 
  onSubmit 
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 animate-slideUp">
      <EmailInput 
        value={email} 
        onChange={onEmailChange} 
      />
      
      <PasswordInput
        value={password}
        showPassword={showPassword}
        onChange={onPasswordChange}
        onToggleVisibility={onTogglePassword}
      />
      
      <FormOptions />
      
      <SubmitButton loading={loading} />
    </form>
  );
};

export default LoginForm;
