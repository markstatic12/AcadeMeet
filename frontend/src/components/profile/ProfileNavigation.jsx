import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeDotsVerticalIcon, HistoryIcon, TrashIcon, PlusIcon } from '../../icons';



// ===== TAB OPTIONS MENU =====

export const TabOptionMenu = ({ 
  showMenu, 
  onToggle, 
  onTrashClick,
  onHistoryClick
}) => {
  return (
    <div className="relative tab-options-menu">
      <button
        onClick={onToggle}
        className="relative overflow-hidden p-3.5 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-400 hover:text-white rounded-xl transition-all hover:scale-110 hover:shadow-xl border border-gray-700 hover:border-gray-600 group/btn"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
        <ThreeDotsVerticalIcon className="w-5 h-5 relative z-10 group-hover/btn:rotate-90 transition-transform" />
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-3 w-52 bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl shadow-2xl shadow-indigo-500/20 z-50 overflow-hidden animate-slideDown backdrop-blur-xl">
          <div className="p-1">
            <button
              onClick={() => {
                if (onHistoryClick) {
                  onHistoryClick();
                }
                onToggle();
              }}
              className="w-full px-4 py-3.5 text-left text-sm text-white hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 transition-all flex items-center gap-3 group rounded-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <HistoryIcon className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="font-bold">History</span>
            </button>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-1"></div>
            <button
              onClick={onTrashClick}
              className="w-full px-4 py-3.5 text-left text-sm text-red-400 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-700/20 transition-all flex items-center gap-3 group rounded-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center border border-red-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <TrashIcon className="w-4 h-4 text-red-400" />
              </div>
              <span className="font-bold">Trash</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== CREATE NEW CARD =====

export const CreateNewCard = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="relative bg-[#161A2B] border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center transition-all group hover:shadow-xl hover:shadow-indigo-500/20 h-[180px] w-full overflow-hidden"
    >
      {/* Decorative background gradient */}
      <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-all duration-700"></div>
      
      {/* Decorative orbs */}
      <div className="absolute top-4 left-4 w-20 h-20 bg-indigo-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-4 right-4 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      

      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-12 h-12 bg-[#161A2B] group-hover:from-indigo-600/30 group-hover:to-indigo-700/30 rounded-lg flex items-center justify-center mb-2.5 transition-all shadow-xl group-hover:shadow-indigo-500/40 group-hover:scale-110 border border-gray-700 group-hover:border-indigo-500/50">
          <PlusIcon className="w-6 h-6 text-gray-600 group-hover:text-indigo-400 transition-all group-hover:rotate-180" />
        </div>
        <p className="text-gray-500 group-hover:text-gray-300 text-[11px] font-bold max-w-[160px] text-center leading-relaxed transition-colors">
          {label}
        </p>
      </div>
    </button>
  );
};


export default CreateNewCard;