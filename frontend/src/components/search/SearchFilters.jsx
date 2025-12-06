import React from 'react';
import { FilterIcon, XIcon } from '../../icons';

const SearchFilters = ({ 
  dateFilter, 
  setDateFilter, 
  timeFilter, 
  setTimeFilter, 
  privacyFilter, 
  setPrivacyFilter, 
  sortBy, 
  setSortBy,
  onClearFilters 
}) => {
  const hasActiveFilters = dateFilter || timeFilter || privacyFilter !== 'all' || sortBy !== 'relevance';
  
  return (
    <div className="bg-[#161A2B] rounded-2xl border border-gray-800/50 p-6 shadow-xl hover:border-indigo-500/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600/10 rounded-lg">
            <FilterIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Filters</h3>
        </div>
        
        {hasActiveFilters && (
          <button 
            onClick={onClearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all hover:scale-105 border border-gray-700/50 hover:border-gray-600"
          >
            <XIcon className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>
      
      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Filter */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-400 group-hover:text-gray-300 mb-2.5 transition-colors">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Date
            </span>
          </label>
          <input 
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 hover:border-gray-600 transition-all duration-200"
          />
        </div>
        
        {/* Time Filter */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-400 group-hover:text-gray-300 mb-2.5 transition-colors">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Time of Day
            </span>
          </label>
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 hover:border-gray-600 transition-all duration-200 cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.25em 1.25em',
            }}
          >
            <option value="">Any Time</option>
            <option value="morning">Morning (6AM - 12PM)</option>
            <option value="afternoon">Afternoon (12PM - 6PM)</option>
            <option value="evening">Evening (6PM - 12AM)</option>
          </select>
        </div>
        
        {/* Privacy Filter */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-400 group-hover:text-gray-300 mb-2.5 transition-colors">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Privacy
            </span>
          </label>
          <select 
            value={privacyFilter}
            onChange={(e) => setPrivacyFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 hover:border-gray-600 transition-all duration-200 cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.25em 1.25em',
            }}
          >
            <option value="all">All Sessions</option>
            <option value="public">Public Only</option>
            <option value="private">Private Only</option>
          </select>
        </div>
        
        {/* Sort By */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-400 group-hover:text-gray-300 mb-2.5 transition-colors">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Sort By
            </span>
          </label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 hover:border-gray-600 transition-all duration-200 cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.25em 1.25em',
            }}
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date (Earliest First)</option>
            <option value="participants">Most Popular</option>
          </select>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-5 pt-5 border-t border-gray-800/50 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Active Filters</p>
          <div className="flex flex-wrap gap-2">
            {dateFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 text-sm rounded-lg border border-indigo-500/30 hover:bg-indigo-500/20 transition-all group/tag">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(dateFilter).toLocaleDateString()}
                <button 
                  onClick={() => setDateFilter('')}
                  className="hover:text-indigo-300 hover:scale-110 transition-all"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            
            {timeFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 text-sm rounded-lg border border-indigo-500/30 hover:bg-indigo-500/20 transition-all group/tag">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}
                <button 
                  onClick={() => setTimeFilter('')}
                  className="hover:text-indigo-300 hover:scale-110 transition-all"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            
            {privacyFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 text-sm rounded-lg border border-indigo-500/30 hover:bg-indigo-500/20 transition-all group/tag">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {privacyFilter.charAt(0).toUpperCase() + privacyFilter.slice(1)}
                <button 
                  onClick={() => setPrivacyFilter('all')}
                  className="hover:text-indigo-300 hover:scale-110 transition-all"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            
            {sortBy !== 'relevance' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 text-sm rounded-lg border border-indigo-500/30 hover:bg-indigo-500/20 transition-all group/tag">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Sort: {sortBy === 'date' ? 'Date' : 'Most Popular'}
                <button 
                  onClick={() => setSortBy('relevance')}
                  className="hover:text-indigo-300 hover:scale-110 transition-all"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex flex-wrap gap-2">
            {dateFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/20 text-indigo-400 text-sm rounded-full border border-indigo-500/30">
                Date: {new Date(dateFilter).toLocaleDateString()}
                <button 
                  onClick={() => setDateFilter('')}
                  className="hover:text-indigo-300"
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {timeFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/20 text-indigo-400 text-sm rounded-full border border-indigo-500/30">
                Time: {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}
                <button 
                  onClick={() => setTimeFilter('')}
                  className="hover:text-indigo-300"
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {privacyFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/20 text-indigo-400 text-sm rounded-full border border-indigo-500/30">
                Privacy: {privacyFilter.charAt(0).toUpperCase() + privacyFilter.slice(1)}
                <button 
                  onClick={() => setPrivacyFilter('all')}
                  className="hover:text-indigo-300"
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {sortBy !== 'relevance' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/20 text-indigo-400 text-sm rounded-full border border-indigo-500/30">
                Sort: {sortBy === 'date' ? 'Date' : 'Most Popular'}
                <button 
                  onClick={() => setSortBy('relevance')}
                  className="hover:text-indigo-300"
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
