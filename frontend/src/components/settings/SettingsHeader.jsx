import React from 'react';
import { BackIcon } from '../../icons';

const SettingsHeader = ({ onBack }) => {
  return (
    <div className="flex gap-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-indigo-300 hover:text-white mb-4"
      >
        <BackIcon className="w-7 h-7 p-1.5 rounded-full bg-indigo-600/80" />
        <span className="text-lg">Back</span>
      </button>
    </div>
  );
};

export default SettingsHeader;
