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
    <div className="bg-[#1f1f1f] rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FilterIcon className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
        </div>
        
        {hasActiveFilters && (
          <button 
            onClick={onClearFilters}
            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <XIcon className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Date
          </label>
          <input 
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        {/* Time Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Time of Day
          </label>
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Any Time</option>
            <option value="morning">Morning (6AM - 12PM)</option>
            <option value="afternoon">Afternoon (12PM - 6PM)</option>
            <option value="evening">Evening (6PM - 12AM)</option>
          </select>
        </div>
        
        {/* Privacy Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Privacy
          </label>
          <select 
            value={privacyFilter}
            onChange={(e) => setPrivacyFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Sessions</option>
            <option value="public">Public Only</option>
            <option value="private">Private Only</option>
          </select>
        </div>
        
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Sort By
          </label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date (Earliest First)</option>
            <option value="participants">Most Popular</option>
          </select>
        </div>
      </div>
      
      {/* Active Filters Display */}
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
