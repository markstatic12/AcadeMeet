import React from 'react';

const PageHeader = ({ 
  onBack, 
  onSubmit, 
  onSave,
  isSubmitting = false,
  submitText = 'Submit',
  saveText = 'Save',
  showSubmit = false,
  showSave = false,
  children
}) => {
  return (
    <div className="flex items-center justify-between mb-10">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-3 text-white hover:text-indigo-400 transition-colors group"
      >
        <div className="w-10 h-10 bg-indigo-600/20 group-hover:bg-indigo-600/30 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <span className="text-lg font-semibold">Back</span>
      </button>

      <div className="flex items-center gap-3">
        {children}
        
        {showSave && (
          <button
            type="button"
            onClick={onSave}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {saveText}
          </button>
        )}
        
        {showSubmit && (
          <button
            type="submit"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-8 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
          >
            {isSubmitting ? 'Submitting...' : submitText}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;