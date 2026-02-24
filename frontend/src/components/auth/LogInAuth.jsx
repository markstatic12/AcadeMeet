import React from 'react';
import { Link } from 'react-router-dom';
import FormOptions from './FormOptions';
import SubmitButton from './SubmitButton';
import EmailInput from '../ui/EmailInput';
import PasswordInput from '../ui/PasswordInput';
import logo from '../../assets/academeet-white.svg';


// ===== LOGIN  FORM  =====

export const LoginForm = ({ 
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
      
      <SubmitButton 
        loading={loading} 
        text="Login" 
        loadingText="Logging in..." 
      />
    </form>
  );
};


// ===== LOGIN HEADER  =====

export const LoginHeader = () => {
  return (
    <div className="mb-8 animate-slideDown">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative group">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/40 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
            <img 
              src={logo} 
              alt="AcadeMeet Logo" 
              className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          </div>
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 group-hover:ring-white/30 transition-all duration-300"></div>
        </div>
        <div>
          <span className="text-xl font-bold text-white tracking-tight">
            Acade<span className="text-indigo-400">Meet</span>
          </span>
          <p className="text-xs text-gray-500">Study Together, Learn Forever</p>
        </div>
      </div>
      
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-sm">
          Sign in to continue your learning journey
        </p>
      </div>
    </div>
  );
};


// ===== LOGIN LINK  =====

export const LoginLink = () => {
  return (
    <>
      {/* Divider */}
      <div className="my-4 flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        <span className="text-xs text-gray-500 font-medium">OR</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-gray-400 text-xs mb-2">
          Already have an account?
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-semibold group"
        >
          <span>Sign in to your account</span>
          <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </>
  );
};

export default LoginForm;