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
        className="relative overflow-hidden p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all hover:scale-105 border border-white/10 hover:border-white/20 group/btn backdrop-blur-sm"
      >
        <ThreeDotsVerticalIcon className="w-4 h-4 relative z-10 transition-transform group-hover/btn:rotate-90 duration-300" />
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1a1f35]/95 border border-indigo-500/30 rounded-xl shadow-2xl shadow-black/50 z-[100] overflow-hidden animate-slideDown backdrop-blur-xl">
          <div className="p-2">
            <button
              onClick={() => {
                if (onHistoryClick) {
                  onHistoryClick();
                }
                onToggle();
              }}
              className="w-full px-4 py-3 text-left text-sm text-gray-200 hover:bg-indigo-600/20 transition-all flex items-center gap-3 group rounded-lg"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-all">
                <HistoryIcon className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="font-semibold">History</span>
            </button>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent my-1"></div>
            <button
              onClick={onTrashClick}
              className="w-full px-4 py-3 text-left text-sm text-gray-200 hover:bg-red-600/20 transition-all flex items-center gap-3 group rounded-lg"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30 group-hover:scale-110 transition-all">
                <TrashIcon className="w-4 h-4 text-red-400" />
              </div>
              <span className="font-semibold">Trash</span>
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
      className="relative bg-gradient-to-br from-[#1a1f35] to-[#161A2B] border-2 border-dashed border-indigo-600/30 hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center transition-all group hover:shadow-2xl hover:shadow-indigo-500/30 h-[180px] w-full overflow-hidden hover:scale-[1.02]"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-purple-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
      
      {/* Decorative orbs */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent"></div>
        <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 group-hover:from-indigo-600/30 group-hover:to-purple-600/30 rounded-2xl flex items-center justify-center transition-all shadow-lg group-hover:shadow-indigo-500/40 group-hover:scale-110 border-2 border-indigo-500/20 group-hover:border-indigo-400/40">
          <PlusIcon className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300 transition-all group-hover:rotate-90" />
        </div>
        <p className="text-gray-400 group-hover:text-indigo-300 text-sm font-bold text-center leading-relaxed transition-colors px-4">
          {label}
        </p>
      </div>
    </button>
  );
};


export default CreateNewCard;