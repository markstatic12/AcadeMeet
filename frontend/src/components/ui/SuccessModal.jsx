import React from 'react';
import Button from './Button';

const SuccessModal = ({ open, message, onClose, buttonText = 'OK' }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#181829] rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-[#28284a] flex flex-col items-center animate-fadeIn">
        <div className="mb-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Success</h3>
          <p className="text-base text-purple-100">{message}</p>
        </div>
        <Button
          className="w-auto px-8 py-2 mt-2 text-base font-semibold rounded-full"
          onClick={onClose}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default SuccessModal;
