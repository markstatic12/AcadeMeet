import React from 'react';
import FormInput from '../ui/FormInput';

const EmailInput = ({ value, onChange }) => {
  return (
    <FormInput
      id="email"
      name="email"
      type="email"
      label="Email Address"
      placeholder="Enter your email"
      value={value}
      onChange={onChange}
      icon={
        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
      }
    />
  );
};

export default EmailInput;