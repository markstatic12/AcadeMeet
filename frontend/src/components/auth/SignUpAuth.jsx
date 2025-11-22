import React from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../ui/FormInput';
import PasswordInput from '../ui/PasswordInput';
import FormSelect from '../ui/FormSelect';
import SubmitButton from './SubmitButton';
import logo from '../../assets/academeet-white.svg';



// ===== SIGN UP FORM =====

const PROGRAM_OPTIONS = [
  { value: 'BSCS', label: 'BSCS' },
  { value: 'BSIT', label: 'BSIT' },
  { value: 'BSCE', label: 'BSCE' },
  { value: 'BSCPE', label: 'BSCpE' },
  { value: 'BSEE', label: 'BSEE' },
  { value: 'BSME', label: 'BSME' },
  { value: 'BSA', label: 'BSA' },
  { value: 'BSBA', label: 'BSBA' },
];

const YEAR_LEVEL_OPTIONS = [
  { value: '1', label: '1st Year' },
  { value: '2', label: '2nd Year' },
  { value: '3', label: '3rd Year' },
  { value: '4', label: '4th Year' },
];

const SignupForm = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  showConfirmPassword,
  program,
  setProgram,
  yearLevel,
  setYearLevel,
  loading,
  onSubmit,
  onTogglePassword,
  onToggleConfirmPassword,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-2.5 animate-slideUp">
      <FormInput
        id="name"
        name="name"
        type="text"
        label="Full Name"
        placeholder="John Doe"
        value={name}
        onChange={(e) => setName(e.target.value)}
        icon={
          <svg className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />

      <FormInput
        id="email"
        name="email"
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={
          <svg className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        }
      />

      {/* Program and Year Level - Side by Side */}
      <div className="grid grid-cols-2 gap-2">
        <FormSelect
          id="program"
          name="program"
          label="Program"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          options={PROGRAM_OPTIONS}
          icon={
            <svg className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />

        <FormSelect
          id="yearLevel"
          name="yearLevel"
          label="Year Level"
          value={yearLevel}
          onChange={(e) => setYearLevel(e.target.value)}
          options={YEAR_LEVEL_OPTIONS}
          icon={
            <svg className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
        />
      </div>

      <PasswordInput
        id="password"
        name="password"
        label="Password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        showPassword={showPassword}
        onToggleVisibility={onTogglePassword}
        icon={
          <svg className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
      />

      <PasswordInput
        id="confirm-password"
        name="confirm-password"
        label="Confirm Password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        showPassword={showConfirmPassword}
        onToggleVisibility={onToggleConfirmPassword}
        icon={
          <svg className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      <SubmitButton
        loading={loading}
        text="Create Account"
        loadingText="Creating your account..."
      />
    </form>
  );
};


// ===== SIGN UP HEADER  =====

export const SignupHeader = () => {
  return (
    <div className="mb-4 animate-slideDown">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="relative group">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/40 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
            <img src={logo} alt="AcadeMeet Logo" className="w-7 h-7 object-contain transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20 group-hover:ring-white/30 transition-all duration-300"></div>
        </div>
        <div>
          <span className="text-lg font-bold text-white tracking-tight">Acade<span className="text-indigo-400">Meet</span></span>
          <p className="text-xs text-gray-500">Study Together, Learn Forever</p>
        </div>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold text-white mb-1.5 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
          Join Us Today
        </h1>
        <p className="text-gray-400 text-xs">
          Create your account and start collaborating
        </p>
      </div>
    </div>
  );
};


// ===== SIGN UP LINK  =====

export const SignupLink = () => {
  return (
    <div className="text-center">
      <p className="text-gray-400 text-sm mb-3">
        Don't have an account yet?
      </p>
      <Link
        to="/signup"
        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-semibold group"
      >
        <span>Create a free account</span>
        <svg 
          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17 8l4 4m0 0l-4 4m4-4H3" 
          />
        </svg>
      </Link>
    </div>
  );
};

export default SignupForm;