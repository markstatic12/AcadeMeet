import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

/**
 * Toast Notification Component
 * A reusable notification system for displaying messages
 * 
 * Types: success, error, warning, info
 * Usage: <Toast type="success" message="Session created!" isVisible={true} onClose={handleClose} />
 */

const Toast = ({ type = 'info', message, isVisible, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-gradient-to-br from-green-900/40 to-emerald-900/40';
      case 'error':
        return 'border-red-500/30 bg-gradient-to-br from-red-900/40 to-red-800/40';
      case 'warning':
        return 'border-yellow-500/30 bg-gradient-to-br from-yellow-900/40 to-amber-900/40';
      case 'info':
      default:
        return 'border-indigo-500/30 bg-gradient-to-br from-indigo-900/40 to-indigo-800/40';
    }
  };

  const toastContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none animate-fadeIn">
      <div 
        className={`
          pointer-events-auto
          min-w-[400px] max-w-[500px]
          ${getColorClasses()}
          backdrop-blur-xl
          border-2
          rounded-2xl
          shadow-2xl
          p-5
          animate-slideUp
          relative
          overflow-hidden
        `}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-sweepOnce pointer-events-none"></div>
        
        {/* Top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          type === 'success' ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-500' :
          type === 'error' ? 'bg-gradient-to-r from-red-500 via-red-400 to-red-500' :
          type === 'warning' ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500' :
          'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500'
        }`}></div>

        <div className="relative z-10 flex items-start gap-4">
          {getIcon()}
          
          <div className="flex-1 min-w-0">
            <p className="text-white text-base font-semibold leading-relaxed pr-8">
              {message}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-all duration-200 hover:rotate-90"
          >
            <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div 
              className={`h-full ${
                type === 'success' ? 'bg-green-500' :
                type === 'error' ? 'bg-red-500' :
                type === 'warning' ? 'bg-yellow-500' :
                'bg-indigo-500'
              }`}
              style={{
                animation: `shrink ${duration}ms linear forwards`
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(toastContent, document.body);
};

export default Toast;
