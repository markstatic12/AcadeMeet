import React from 'react';
import { Link } from 'react-router-dom';

const SignupLink = () => {
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

export default SignupLink;
