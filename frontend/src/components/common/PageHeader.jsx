import React from 'react';
import Button from '../ui/Button';

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
        onClick={() => onBack?.()}
        aria-label="Go back"
        className="flex items-center gap-3 text-white hover:text-indigo-300 transition-colors group font-sans"
      >
        {/* Minimalist left arrow icon */}
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>

        <span className="text-lg font-medium">Back</span>
      </button>

      <div className="flex items-center gap-3">
        {children}
        
        {showSave && (
          <Button
            type="button"
            onClick={() => onSave?.()}
            className="w-auto px-6 py-2"
          >
            {saveText}
          </Button>
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