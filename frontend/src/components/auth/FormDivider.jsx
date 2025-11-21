import React from 'react';

const FormDivider = () => {
  return (
    <div className="my-6 flex items-center gap-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
      <span className="text-xs text-gray-500 font-medium">OR</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
    </div>
  );
};

export default FormDivider;
