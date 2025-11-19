import React from 'react';
import { PlusIcon } from './icons';

const CreateNewCard = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#1a1a1a] border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center transition-all group hover:bg-[#1f1f1f] h-[240px] w-full"
    >
      <div className="w-16 h-16 bg-[#2a2a2a] group-hover:bg-indigo-600/20 rounded-full flex items-center justify-center mb-3 transition-colors">
        <PlusIcon className="w-8 h-8 text-gray-600 group-hover:text-indigo-400" />
      </div>
      <p className="text-gray-500 group-hover:text-gray-400 text-xs font-light italic">{label}</p>
    </button>
  );
};

export default CreateNewCard;
