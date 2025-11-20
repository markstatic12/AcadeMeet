import React from 'react';

const PageHeader = ({ onBack, onSubmit, isSubmitting }) => {
  return (
    <div className="flex items-center justify-between mb-12">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-3 text-white hover:text-indigo-400 transition-colors group"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4" 
          />
        </svg>
        {isSubmitting ? 'Creating...' : 'Create'}
      </button>
    </div>
  );
};

export default PageHeader;
