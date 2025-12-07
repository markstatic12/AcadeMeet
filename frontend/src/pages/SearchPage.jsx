import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { SearchIcon } from '../icons';
import SessionCard from '../components/search/SessionCard';
import SearchUserCard from '../components/search/SearchUserCard';
import SearchEmptyState from '../components/search/SearchEmptyState';
import SearchService from '../services/SearchService';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'users', 'session'
  const [sortBy, setSortBy] = useState('relevance');
  
  // Data from API
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Session filters
  const [dateFilter, setDateFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('Any Time');
  const [privacyFilter, setPrivacyFilter] = useState('All Sessions');
  
  // User filters
  const [programFilter, setProgramFilter] = useState('All Programs');
  const [yearLevelFilter, setYearLevelFilter] = useState('All Year Levels');
  
  // Carousel scroll tracking
  const [isUsersCarouselAtEnd, setIsUsersCarouselAtEnd] = useState(false);
  const [isSessionsCarouselAtEnd, setIsSessionsCarouselAtEnd] = useState(false);
  
  // Update search query from URL params
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);
  
  // Perform search when filters or query change
  useEffect(() => {
    const performSearch = async () => {
      // Don't search if query is empty and no filters applied
      if (!searchQuery && activeTab === 'all') {
        setUsers([]);
        setSessions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (activeTab === 'all') {
          // Search both users and sessions
          const result = await SearchService.searchAll(searchQuery, sortBy);
          setUsers(result.users || []);
          setSessions(result.sessions || []);
        } else if (activeTab === 'users') {
          // Search only users with filters
          const result = await SearchService.searchUsers(searchQuery, {
            program: programFilter,
            yearLevel: yearLevelFilter === 'All Year Levels' ? null : parseInt(yearLevelFilter),
            sortBy: sortBy
          });
          setUsers(result || []);
          setSessions([]);
        } else if (activeTab === 'session') {
          // Search only sessions with filters
          const result = await SearchService.searchSessions(searchQuery, {
            date: dateFilter,
            timeOfDay: timeFilter,
            privacy: privacyFilter,
            sortBy: sortBy
          });
          setSessions(result || []);
          setUsers([]);
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to perform search. Please try again.');
        setUsers([]);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [searchQuery, activeTab, sortBy, dateFilter, timeFilter, privacyFilter, programFilter, yearLevelFilter]);
  
  // Display logic for users and sessions
  const displayUsers = useMemo(() => {
    // 'All' tab: limit to 6 items for preview
    if (activeTab === 'all') {
      return users.slice(0, 6);
    }
    // 'Users' tab: show all items (vertical scroll)
    if (activeTab === 'users') {
      return users;
    }
    return [];
  }, [users, activeTab]);
  
  const displaySessions = useMemo(() => {
    // 'All' tab: limit to 6 items for preview
    if (activeTab === 'all') {
      return sessions.slice(0, 6);
    }
    // 'Session' tab: show all items (vertical scroll)
    if (activeTab === 'session') {
      return sessions;
    }
    return [];
  }, [sessions, activeTab]);
  
  const handleViewAllUsers = () => {
    setActiveTab('users');
    setSortBy('relevance'); // Reset sort when changing tabs
  };
  
  const handleViewAllSessions = () => {
    setActiveTab('session');
    setSortBy('relevance'); // Reset sort when changing tabs
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSortBy('relevance'); // Reset sort when changing tabs
    // Clear session filters when leaving session tab
    if (tab !== 'session') {
      setDateFilter('');
      setTimeFilter('Any Time');
      setPrivacyFilter('All Sessions');
    }
    // Clear user filters when leaving users tab
    if (tab !== 'users') {
      setProgramFilter('All Programs');
      setYearLevelFilter('All Year Levels');
    }
  };
  
  // Check if carousel is at the end
  const handleUsersCarouselScroll = (e) => {
    const element = e.target;
    const isAtEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 10;
    setIsUsersCarouselAtEnd(isAtEnd);
  };
  
  const handleSessionsCarouselScroll = (e) => {
    const element = e.target;
    const isAtEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 10;
    setIsSessionsCarouselAtEnd(isAtEnd);
  };

  return (
    <DashboardLayout>
      {/* Sidebar + Main Content Layout */}
      <div className="flex h-full animate-in fade-in duration-300 gap-6 p-8">
        
        {/* LEFT SIDEBAR - Search & Filters */}
        <div className="w-[340px] flex-shrink-0 border-r border-gray-800/30 pr-6">
          <div className="sticky top-8">
            {/* Search Title */}
            <h1 className="text-2xl font-bold text-white mb-5 opacity-0 animate-fadeSlideUp" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>Search</h1>
            
            {/* Search Input */}
            <div className="mb-5 opacity-0 animate-fadeSlideUp" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <SearchIcon className="w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-all" />
                </div>
                <input
                  type="text"
                  placeholder="Search for sessions or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                    }
                  }}
                  className="w-full h-10 pl-10 pr-3 bg-[#161A2B] border border-gray-800/50 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 hover:border-gray-700 transition-all duration-200"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-5 opacity-0 animate-fadeSlideUp" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTabChange('all')}
                  className={`flex-1 px-3 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                    activeTab === 'all'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-[#161A2B] text-gray-400 hover:text-white hover:bg-gray-800/50 border border-gray-800/50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleTabChange('users')}
                  className={`flex-1 px-3 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                    activeTab === 'users'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-[#161A2B] text-gray-400 hover:text-white hover:bg-gray-800/50 border border-gray-800/50'
                  }`}
                >
                  Users
                </button>
                <button
                  onClick={() => handleTabChange('session')}
                  className={`flex-1 px-3 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                    activeTab === 'session'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-[#161A2B] text-gray-400 hover:text-white hover:bg-gray-800/50 border border-gray-800/50'
                  }`}
                >
                  Session
                </button>
              </div>
            </div>

            {/* Sort By */}
            <div className="bg-[#161A2B] rounded-lg p-3.5 border border-gray-800/50 opacity-0 animate-fadeSlideUp" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-2 mb-2.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                <span className="text-sm font-bold text-gray-400">Sort by</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25em 1.25em',
                }}
              >
                <option value="relevance" className="bg-gray-800">Relevance</option>
                {activeTab === 'session' && <option value="newest" className="bg-gray-800">Newest</option>}
                {activeTab === 'session' && <option value="oldest" className="bg-gray-800">Oldest</option>}
                {activeTab === 'users' && <option value="name" className="bg-gray-800">Name</option>}
              </select>
            </div>

            {/* SESSION FILTERS - Show only when Session tab is active */}
            {activeTab === 'session' && (
              <div className="mt-5 bg-[#161A2B] rounded-lg p-3.5 border border-gray-800/50 opacity-0 animate-fadeSlideUp" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-sm font-bold text-gray-400">Filter</span>
                </div>
                
                {/* Date */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-500 mb-2">Date</label>
                  <input 
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    placeholder="dd/mm/yyyy"
                    className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10"
                  />
                </div>

                {/* Time of Day */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-500 mb-2">Time of Day</label>
                  <select 
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25em 1.25em',
                    }}
                  >
                    <option value="Any Time" className="bg-gray-800">Any Time</option>
                    <option value="morning" className="bg-gray-800">Morning (6AM - 11:59AM)</option>
                    <option value="afternoon" className="bg-gray-800">Afternoon (12PM - 5:59PM)</option>
                    <option value="evening" className="bg-gray-800">Evening (6PM - 11:59PM)</option>
                    <option value="night" className="bg-gray-800">Night (12AM - 5:59AM)</option>
                  </select>
                </div>

                {/* Privacy */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Privacy</label>
                  <select 
                    value={privacyFilter}
                    onChange={(e) => setPrivacyFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25em 1.25em',
                    }}
                  >
                    <option value="All Sessions" className="bg-gray-800">All Sessions</option>
                    <option value="public" className="bg-gray-800">Public Only</option>
                    <option value="private" className="bg-gray-800">Private Only</option>
                  </select>
                </div>
              </div>
            )}

            {/* USER FILTERS - Show when Users tab is active */}
            {activeTab === 'users' && (
              <div className="mt-5 bg-[#161A2B] rounded-lg p-3.5 border border-gray-800/50 opacity-0 animate-fadeSlideUp" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-sm font-bold text-gray-400">Filter</span>
                </div>
                
                {/* Program */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-500 mb-2">Program</label>
                  <select 
                    value={programFilter}
                    onChange={(e) => setProgramFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25em 1.25em',
                    }}
                  >
                    <option value="All Programs" className="bg-gray-800">All Programs</option>
                    <option value="BSCS" className="bg-gray-800">BSCS</option>
                    <option value="BSIT" className="bg-gray-800">BSIT</option>
                    <option value="BSCE" className="bg-gray-800">BSCE</option>
                    <option value="BSCPE" className="bg-gray-800">BSCpE</option>
                    <option value="BSEE" className="bg-gray-800">BSEE</option>
                    <option value="BSME" className="bg-gray-800">BSME</option>
                    <option value="BSA" className="bg-gray-800">BSA</option>
                    <option value="BSBA" className="bg-gray-800">BSBA</option>
                  </select>
                </div>

                {/* Year Level */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Year Level</label>
                  <select 
                    value={yearLevelFilter}
                    onChange={(e) => setYearLevelFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25em 1.25em',
                    }}
                  >
                    <option value="All Year Levels" className="bg-gray-800">All Year Levels</option>
                    <option value="1" className="bg-gray-800">1st Year</option>
                    <option value="2" className="bg-gray-800">2nd Year</option>
                    <option value="3" className="bg-gray-800">3rd Year</option>
                    <option value="4" className="bg-gray-800">4th Year</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MAIN CONTENT AREA - Results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0">
            
            {/* Users Section */}
            {displayUsers.length > 0 && (
              <div className={`flex flex-col opacity-0 animate-fadeSlideUp ${activeTab === 'users' ? 'flex-1 min-h-0' : 'mb-8'}`} style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-600/10 rounded-lg border border-indigo-500/20">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl text-white font-bold">People</h3>
                    <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/30">
                      {users.length}
                    </span>
                  </div>
                  {activeTab === 'all' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => document.getElementById('users-carousel').scrollBy({ left: -350, behavior: 'smooth' })}
                        className="p-2 bg-[#161A2B] hover:bg-[#1a1f35] text-gray-400 hover:text-white rounded-lg transition-all duration-200 border border-gray-800/50 hover:border-indigo-500/50"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      {/* Right arrow transforms to View All button when at end and more than 6 results */}
                      {users.length > 6 && isUsersCarouselAtEnd ? (
                        <button
                          onClick={handleViewAllUsers}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-bold text-sm"
                        >
                          <span>View All</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => document.getElementById('users-carousel').scrollBy({ left: 350, behavior: 'smooth' })}
                          className="p-2 bg-[#161A2B] hover:bg-[#1a1f35] text-gray-400 hover:text-white rounded-lg transition-all duration-200 border border-gray-800/50 hover:border-indigo-500/50"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Conditional Layout: Carousel for 'all', Vertical Scroll for 'users' */}
                {activeTab === 'all' ? (
                  <div className="relative -my-4">
                    <div 
                      id="users-carousel" 
                      className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-4" 
                      style={{ scrollSnapType: 'x mandatory' }}
                      onScroll={handleUsersCarouselScroll}
                    >
                      {displayUsers.map((user, index) => (
                        <div 
                          key={user.id} 
                          className="flex-shrink-0 w-[280px] opacity-0 animate-fadeSlideUp"
                          style={{ animationDelay: `${600 + (index * 80)}ms`, scrollSnapAlign: 'start', animationFillMode: 'forwards' }}
                        >
                          <SearchUserCard user={user} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar py-3 px-2 -mx-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {displayUsers.map((user, index) => (
                        <div 
                          key={user.id}
                          className="opacity-0 animate-fadeSlideUp"
                          style={{ animationDelay: `${600 + (index * 50)}ms`, animationFillMode: 'forwards' }}
                        >
                          <SearchUserCard user={user} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Sessions Section */}
            {displaySessions.length > 0 && (
              <div className={`flex flex-col opacity-0 animate-fadeSlideUp ${activeTab === 'session' ? 'flex-1 min-h-0' : 'mt-6'}`} style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-600/10 rounded-lg border border-indigo-500/20">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-xl text-white font-bold">Study Sessions</h3>
                    <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/30">
                      {sessions.length}
                    </span>
                  </div>
                  {activeTab === 'all' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => document.getElementById('sessions-carousel').scrollBy({ left: -350, behavior: 'smooth' })}
                        className="p-2 bg-[#161A2B] hover:bg-[#1a1f35] text-gray-400 hover:text-white rounded-lg transition-all duration-200 border border-gray-800/50 hover:border-indigo-500/50"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      {/* Right arrow transforms to View All button when at end and more than 6 results */}
                      {sessions.length > 6 && isSessionsCarouselAtEnd ? (
                        <button
                          onClick={handleViewAllSessions}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-bold text-sm"
                        >
                          <span>View All</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => document.getElementById('sessions-carousel').scrollBy({ left: 350, behavior: 'smooth' })}
                          className="p-2 bg-[#161A2B] hover:bg-[#1a1f35] text-gray-400 hover:text-white rounded-lg transition-all duration-200 border border-gray-800/50 hover:border-indigo-500/50"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Conditional Layout: Carousel for 'all', Vertical Scroll for 'session' */}
                {activeTab === 'all' ? (
                  <div className="relative -my-4">
                    <div 
                      id="sessions-carousel" 
                      className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-4" 
                      style={{ scrollSnapType: 'x mandatory' }}
                      onScroll={handleSessionsCarouselScroll}
                    >
                      {displaySessions.map((session, index) => (
                        <div 
                          key={session.id}
                          className="flex-shrink-0 w-[280px] opacity-0 animate-fadeSlideUp"
                          style={{ animationDelay: `${800 + (index * 80)}ms`, scrollSnapAlign: 'start', animationFillMode: 'forwards' }}
                        >
                          <SessionCard session={session} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar py-3 px-2 -mx-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {displaySessions.map((session, index) => (
                        <div 
                          key={session.id}
                          className="opacity-0 animate-fadeSlideUp"
                          style={{ animationDelay: `${800 + (index * 50)}ms`, animationFillMode: 'forwards' }}
                        >
                          <SessionCard session={session} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-red-400 text-lg mb-2">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            
            {/* Empty State - Show when no search query or no results */}
            {!loading && !error && displayUsers.length === 0 && displaySessions.length === 0 && (
              <SearchEmptyState searchQuery={searchQuery} type={activeTab} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SearchPage;
