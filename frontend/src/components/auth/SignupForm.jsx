import React from 'react';
import FormInput from '../ui/FormInput';
import PasswordInput from '../ui/PasswordInput';
import FormSelect from '../ui/FormSelect';
import SubmitButton from './SubmitButton';

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

export default SignupForm;
