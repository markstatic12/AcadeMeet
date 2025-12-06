import React from 'react';
import { SearchIcon } from '../../icons';

const SearchEmptyState = ({ searchQuery, type = 'all' }) => {
  const getEmptyMessage = () => {
    if (!searchQuery) {
      return {
        title: 'Start searching',
        subtitle: 'Type in the search box to find sessions and users',
        icon: (
          <SearchIcon className="w-16 h-16 text-gray-600" />
        )
      };
    }
    
    const typeLabel = type === 'users' ? 'users' : type === 'session' ? 'sessions' : 'results';
    
    return {
      title: `No ${typeLabel} found`,
      subtitle: `We couldn't find any ${typeLabel} matching "${searchQuery}"`,
      icon: (
        <SearchIcon className="w-16 h-16 text-gray-600" />
      )
    };
  };

  const { title, subtitle, icon } = getEmptyMessage();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Animated Icon Container */}
      <div className="relative mb-6 animate-in zoom-in duration-700">
        {/* Decorative blur orbs */}
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Icon */}
        <div className="relative bg-[#161A2B] border-2 border-gray-800/50 rounded-3xl p-8 shadow-2xl">
          <div className="relative">
            {icon}
            {/* Animated ring */}
            <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>

      {/* Text Content */}
      <h3 className="text-2xl font-bold text-white mb-3 text-center animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: '200ms' }}>
        {title}
      </h3>
      <p className="text-gray-400 text-center max-w-md mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: '300ms' }}>
        {subtitle}
      </p>

      {/* Suggestions */}
      {searchQuery && (
        <div className="bg-[#161A2B] border border-gray-800/50 rounded-2xl p-6 max-w-md w-full animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: '400ms' }}>
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Try these tips:
          </h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">•</span>
              <span>Check your spelling or try different keywords</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">•</span>
              <span>Use more general terms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">•</span>
              <span>Try adjusting your filters</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchEmptyState;
