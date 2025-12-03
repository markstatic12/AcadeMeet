import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { SearchIcon } from '../icons';
import { SessionCard } from '../components/sessions/Sessions';
import SearchUserCard from '../components/search/SearchUserCard';

// Static mock data
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', program: 'CIT University', studentId: 'BSIT, 23-2684-947', bio: 'Passionate about AI and machine learning.', profileImageUrl: null },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', program: 'CIT University', studentId: 'BSIT, 23-2684-947', bio: 'Web development enthusiast.', profileImageUrl: null },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', program: 'CIT University', studentId: 'BSIT, 23-2684-947', bio: 'Senior CS student.', profileImageUrl: null },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', program: 'CIT University', studentId: 'BSIT, 23-2684-947', bio: 'Data science enthusiast.', profileImageUrl: null },
  { id: 5, name: 'Alex Brown', email: 'alex@example.com', program: 'CIT University', studentId: 'BSCS, 23-2684-948', bio: 'Full-stack developer.', profileImageUrl: null },
  { id: 6, name: 'Emily Davis', email: 'emily@example.com', program: 'CIT University', studentId: 'BSIS, 23-2684-949', bio: 'UI/UX enthusiast.', profileImageUrl: null },
  { id: 7, name: 'Chris Wilson', email: 'chris@example.com', program: 'CIT University', studentId: 'BSIT, 23-2684-950', bio: 'Mobile app developer.', profileImageUrl: null },
  { id: 8, name: 'Lisa Anderson', email: 'lisa@example.com', program: 'CIT University', studentId: 'BSCS, 23-2684-951', bio: 'Database specialist.', profileImageUrl: null },
];

const mockSessions = [
  { id: 1, title: 'Application Development', month: 'Sep', day: '31', year: '2025', startTime: '09:00', endTime: '10:00', location: 'Microsoft Teams', tags: ['Programming', 'Springboot'], sessionType: 'PUBLIC', status: 'ACTIVE', currentParticipants: 15, maxParticipants: 25 },
  { id: 2, title: 'Web Design Workshop', month: 'Oct', day: '05', year: '2025', startTime: '14:00', endTime: '16:00', location: 'Zoom', tags: ['Design', 'CSS'], sessionType: 'PUBLIC', status: 'ACTIVE', currentParticipants: 8, maxParticipants: 12 },
  { id: 3, title: 'Database Management', month: 'Oct', day: '10', year: '2025', startTime: '10:00', endTime: '12:00', location: 'Google Meet', tags: ['Database', 'SQL'], sessionType: 'PUBLIC', status: 'ACTIVE', currentParticipants: 10, maxParticipants: 15 },
  { id: 4, title: 'Machine Learning Basics', month: 'Oct', day: '15', year: '2025', startTime: '13:00', endTime: '15:00', location: 'Microsoft Teams', tags: ['AI', 'Python'], sessionType: 'PUBLIC', status: 'ACTIVE', currentParticipants: 20, maxParticipants: 30 },
  { id: 5, title: 'React Fundamentals', month: 'Oct', day: '20', year: '2025', startTime: '09:00', endTime: '11:00', location: 'Zoom', tags: ['React', 'JavaScript'], sessionType: 'PUBLIC', status: 'ACTIVE', currentParticipants: 12, maxParticipants: 20 },
  { id: 6, title: 'Cloud Computing 101', month: 'Oct', day: '25', year: '2025', startTime: '15:00', endTime: '17:00', location: 'Google Meet', tags: ['Cloud', 'AWS'], sessionType: 'PUBLIC', status: 'ACTIVE', currentParticipants: 18, maxParticipants: 25 },
  { id: 7, title: 'Mobile App Development', month: 'Nov', day: '01', year: '2025', startTime: '10:00', endTime: '12:00', location: 'Microsoft Teams', tags: ['Mobile', 'Flutter'], sessionType: 'PUBLIC', status: 'ACTIVE', currentParticipants: 14, maxParticipants: 20 },
  { id: 8, title: 'Cybersecurity Workshop', month: 'Nov', day: '05', year: '2025', startTime: '14:00', endTime: '16:00', location: 'Zoom', tags: ['Security', 'Network'], sessionType: 'PRIVATE', status: 'ACTIVE', currentParticipants: 9, maxParticipants: 15 },
];

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'users', 'session'
  const [sortBy, setSortBy] = useState('Relevance');
  
  // Session filters
  const [dateFilter, setDateFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('Any Time');
  const [privacyFilter, setPrivacyFilter] = useState('All Sessions');
  
  // User filters
  const [programFilter, setProgramFilter] = useState('All Programs');
  const [yearLevelFilter, setYearLevelFilter] = useState('All Year Levels');
  
  // Pagination state
  const [userPage, setUserPage] = useState(0);
  const [sessionPage, setSessionPage] = useState(0);
  const [viewMode, setViewMode] = useState('paginated'); // 'paginated' or 'all'
  const [viewAllType, setViewAllType] = useState(null); // 'users' or 'sessions'
  
  const ITEMS_PER_PAGE = 4;
  
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);
  
  // Filter and search logic
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return mockUsers;
    const searchLower = searchQuery.toLowerCase();
    return mockUsers.filter(user => 
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.program.toLowerCase().includes(searchLower) ||
      user.studentId.toLowerCase().includes(searchLower)
    );
  }, [searchQuery]);
  
  const filteredSessions = useMemo(() => {
    if (!searchQuery) return mockSessions;
    const searchLower = searchQuery.toLowerCase();
    return mockSessions.filter(session =>
      session.title.toLowerCase().includes(searchLower) ||
      session.location.toLowerCase().includes(searchLower) ||
      session.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }, [searchQuery]);
  
  // Calculate pagination
  const totalUserPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const totalSessionPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE);
  
  const paginatedUsers = useMemo(() => {
    // Show all when in "View All" mode
    if (viewMode === 'all' && viewAllType === 'users') {
      return filteredUsers;
    }
    // Show paginated for "All" tab or when in carousel mode
    if (activeTab === 'all' || activeTab === 'users') {
      const start = userPage * ITEMS_PER_PAGE;
      return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
    }
    return [];
  }, [filteredUsers, userPage, viewMode, viewAllType, activeTab]);
  
  const paginatedSessions = useMemo(() => {
    // Show all when in "View All" mode
    if (viewMode === 'all' && viewAllType === 'sessions') {
      return filteredSessions;
    }
    // Show paginated for "All" tab or when in carousel mode
    if (activeTab === 'all' || activeTab === 'session') {
      const start = sessionPage * ITEMS_PER_PAGE;
      return filteredSessions.slice(start, start + ITEMS_PER_PAGE);
    }
    return [];
  }, [filteredSessions, sessionPage, viewMode, viewAllType, activeTab]);
  
  const displayUsers = paginatedUsers;
  const displaySessions = paginatedSessions;
  
  const handleViewAllUsers = () => {
    setViewMode('all');
    setViewAllType('users');
    setActiveTab('users');
    setUserPage(0);
  };
  
  const handleViewAllSessions = () => {
    setViewMode('all');
    setViewAllType('sessions');
    setActiveTab('session');
    setSessionPage(0);
  };

  return (
    <DashboardLayout>
      <div className="flex gap-6 h-[calc(100vh-120px)] -mt-8">
        {/* Left Sidebar - Fixed, Non-scrollable */}
        <div className="w-[380px] bg-[#2a2a2a] flex-shrink-0 h-full flex flex-col rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 flex flex-col h-full">
            <h1 className="text-2xl font-bold text-white mb-5">Search</h1>
            
            {/* Search Input */}
            <div className="relative mb-4 group">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 transition-colors group-focus-within:text-indigo-400" />
              <input
                type="text"
                placeholder="Search for sessions or users here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border-none rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
              />
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]'
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#1f1f1f] hover:scale-[1.01]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'users'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]'
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#1f1f1f] hover:scale-[1.01]'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('session')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'session'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]'
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#1f1f1f] hover:scale-[1.01]'
                }`}
              >
                Session
              </button>
            </div>
            
            {/* Filters Container - Scrollable if needed */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {/* Sort By */}
            <div className="bg-[#1a1a1a] rounded-xl p-5 hover:bg-[#1f1f1f] transition-colors duration-200">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span className="text-sm text-gray-400 font-medium">Sort by</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#2a2a2a] border-none rounded-lg text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer transition-all duration-200 hover:bg-[#2f2f2f]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25em 1.25em',
                }}
              >
                <option value="Relevance">Relevance</option>
                <option value="Date">Date</option>
                <option value="Name">Name</option>
              </select>
            </div>
            
            {/* Filter - Only show for Users */}
            {activeTab === 'users' && (
              <div className="bg-[#1a1a1a] rounded-xl p-5 hover:bg-[#1f1f1f] transition-all duration-200 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-sm text-gray-400 font-medium">Filter</span>
                </div>
                
                {/* Program */}
                <div className="mb-4">
                  <label className="block text-white text-xs font-medium mb-2">Program</label>
                  <select
                    value={programFilter}
                    onChange={(e) => setProgramFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#2a2a2a] border-none rounded-lg text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer transition-all duration-200 hover:bg-[#2f2f2f]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25em 1.25em',
                    }}
                  >
                    <option value="All Programs">All Programs</option>
                    <option value="BSIT">BSIT</option>
                    <option value="BSCS">BSCS</option>
                    <option value="BSIS">BSIS</option>
                    <option value="ACT">ACT</option>
                  </select>
                </div>
                
                {/* Year Level */}
                <div>
                  <label className="block text-white text-xs font-medium mb-2">Year Level</label>
                  <select
                    value={yearLevelFilter}
                    onChange={(e) => setYearLevelFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#2a2a2a] border-none rounded-lg text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer transition-all duration-200 hover:bg-[#2f2f2f]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25em 1.25em',
                    }}
                  >
                    <option value="All Year Levels">All Year Levels</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
            )}
            
            {/* Filter - Only show for Sessions */}
            {activeTab === 'session' && (
              <div className="bg-[#1a1a1a] rounded-xl p-5 hover:bg-[#1f1f1f] transition-all duration-200 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-sm text-gray-400 font-medium">Filter</span>
                </div>
                
                {/* Date */}
                <div className="mb-4">
                  <label className="block text-white text-xs font-medium mb-2">Date</label>
                  <input
                    type="text"
                    placeholder="dd/mm/yyyy"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#2a2a2a] border-none rounded-lg text-gray-300 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 hover:bg-[#2f2f2f]"
                  />
                </div>
                
                {/* Time of Day */}
                <div className="mb-4">
                  <label className="block text-white text-xs font-medium mb-2">Time of Day</label>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#2a2a2a] border-none rounded-lg text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer transition-all duration-200 hover:bg-[#2f2f2f]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25em 1.25em',
                    }}
                  >
                    <option value="Any Time">Any Time</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
                
                {/* Privacy */}
                <div>
                  <label className="block text-white text-xs font-medium mb-2">Privacy</label>
                  <select
                    value={privacyFilter}
                    onChange={(e) => setPrivacyFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#2a2a2a] border-none rounded-lg text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer transition-all duration-200 hover:bg-[#2f2f2f]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25em 1.25em',
                    }}
                  >
                    <option value="All Sessions">All Sessions</option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
        
        {/* Main Content - Scrollable when viewing all, carousel otherwise */}
        <div className={`flex-1 h-full pl-6 ${viewMode === 'all' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
          <div className="mb-8">
            <h2 className="text-2xl text-white font-normal">
              Searching {activeTab === 'users' ? 'Users' : activeTab === 'session' ? 'Sessions' : 'All'} for "<span className="italic">{searchQuery || '...'}</span>"
            </h2>
          </div>
          
          {/* Users Section */}
          {displayUsers.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl text-white font-semibold">Users</h3>
                {(activeTab === 'all' || activeTab === 'users') && filteredUsers.length > ITEMS_PER_PAGE && (
                  <button
                    onClick={handleViewAllUsers}
                    className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333333] text-indigo-400 hover:text-indigo-300 text-sm font-medium rounded-lg transition-all duration-200"
                  >
                    View All Users ({filteredUsers.length})
                  </button>
                )}
              </div>
              
              <div className="relative">
                {/* Left Arrow */}
                {totalUserPages > 1 && (
                  <button
                    onClick={() => setUserPage(userPage > 0 ? userPage - 1 : totalUserPages - 1)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                
                <div className="grid grid-cols-2 gap-6 transition-all duration-300">
                  {displayUsers.map(user => (
                    <SearchUserCard key={user.id} user={user} />
                  ))}
                </div>
                
                {/* Right Arrow */}
                {totalUserPages > 1 && (
                  <button
                    onClick={() => setUserPage(userPage < totalUserPages - 1 ? userPage + 1 : 0)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Sessions Section */}
          {displaySessions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl text-white font-semibold">Sessions</h3>
                {(activeTab === 'all' || activeTab === 'session') && filteredSessions.length > ITEMS_PER_PAGE && (
                  <button
                    onClick={handleViewAllSessions}
                    className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333333] text-indigo-400 hover:text-indigo-300 text-sm font-medium rounded-lg transition-all duration-200"
                  >
                    View All Sessions ({filteredSessions.length})
                  </button>
                )}
              </div>
              
              <div className="relative">
                {/* Left Arrow */}
                {totalSessionPages > 1 && (
                  <button
                    onClick={() => setSessionPage(sessionPage > 0 ? sessionPage - 1 : totalSessionPages - 1)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                
                <div className="grid grid-cols-4 gap-6 transition-all duration-300">
                  {displaySessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
                
                {/* Right Arrow */}
                {totalSessionPages > 1 && (
                  <button
                    onClick={() => setSessionPage(sessionPage < totalSessionPages - 1 ? sessionPage + 1 : 0)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {displayUsers.length === 0 && displaySessions.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                No results found for "{searchQuery}"
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Try adjusting your search terms
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SearchPage;
