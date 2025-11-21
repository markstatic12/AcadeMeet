import React from 'react';
import { Link } from 'react-router-dom';

const LoginLink = () => {
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

export default LoginLink;
