import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { SearchIcon } from '../icons';
import SessionCard from '../components/search/SessionCard';
import SearchUserCard from '../components/search/SearchUserCard';
import SearchEmptyState from '../components/search/SearchEmptyState';

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
      {/* Full-Width Discovery Layout */}
      <div className="flex flex-col h-full">
        {/* STICKY SEARCH HEADER - Top Section */}
        <div className="sticky top-0 z-20 pb-6 px-12 mx-8">
          {/* Hero Search Input - Full Width */}
          <div className="w-full mb-6 pt-6">
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-200">
                <SearchIcon className="w-6 h-6 text-gray-500 group-focus-within:text-indigo-400 group-focus-within:scale-110 transition-all" />
              </div>
              <input
                type="text"
                placeholder="Search for sessions, users, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className="w-full h-12 pl-16 pr-6 bg-[#161A2B] border-2 border-gray-800/50 rounded-2xl text-white text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 hover:border-gray-700 transition-all duration-200 shadow-xl"
              />
            </div>
          </div>
          {/* Filters Toolbar - Horizontal Layout */}
          <div className="flex items-center justify-between gap-6 w-full">
            {/* Filter Tabs */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 font-medium mr-2">Filter by:</span>
              <div className="flex gap-2 p-1 bg-[#161A2B] rounded-xl border border-gray-800/50">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                    activeTab === 'all'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  All Results
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                    activeTab === 'users'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  People
                </button>
                <button
                  onClick={() => setActiveTab('session')}
                  className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                    activeTab === 'session'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  Sessions
                </button>
              </div>
            </div>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-[#161A2B] border border-gray-800/50 rounded-lg text-gray-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer transition-all duration-200 hover:border-gray-700 min-w-[160px]"
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
          </div>

          {/* Search Results Count */}
          {searchQuery && (
            <div className="w-full mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-gray-400 text-sm">
                Found <span className="text-white font-bold">{filteredUsers.length + filteredSessions.length}</span> results for "<span className="text-indigo-400 font-medium">{searchQuery}</span>"
              </p>
            </div>
          )}
        </div>

        {/* SCROLLABLE RESULTS AREA - Full Width Masonry Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="w-full px-8 py-8 pb-20">
            
            {/* Users Section */}
            {displayUsers.length > 0 && (
              <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600/10 rounded-xl border border-indigo-500/20">
                      <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl text-white font-bold">People</h3>
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-sm font-bold rounded-full border border-indigo-500/30">
                      {filteredUsers.length}
                    </span>
                  </div>
                  {(activeTab === 'all' || activeTab === 'users') && filteredUsers.length > (viewMode === 'all' ? displayUsers.length : ITEMS_PER_PAGE) && (
                    <button
                      onClick={handleViewAllUsers}
                      className="px-5 py-2.5 bg-[#161A2B] hover:bg-[#1a1f35] text-indigo-400 hover:text-indigo-300 text-sm font-bold rounded-xl transition-all duration-200 border border-gray-800/50 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-105 flex items-center gap-2"
                    >
                      View All
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Users Grid - Full Width Responsive */}
                <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                  {displayUsers.map((user, index) => (
                    <div 
                      key={user.id} 
                      className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <SearchUserCard user={user} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Sessions Section */}
            {displaySessions.length > 0 && (
              <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600/10 rounded-xl border border-indigo-500/20">
                      <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl text-white font-bold">Study Sessions</h3>
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-sm font-bold rounded-full border border-indigo-500/30">
                      {filteredSessions.length}
                    </span>
                  </div>
                  {(activeTab === 'all' || activeTab === 'session') && filteredSessions.length > (viewMode === 'all' ? displaySessions.length : ITEMS_PER_PAGE) && (
                    <button
                      onClick={handleViewAllSessions}
                      className="px-5 py-2.5 bg-[#161A2B] hover:bg-[#1a1f35] text-indigo-400 hover:text-indigo-300 text-sm font-bold rounded-xl transition-all duration-200 border border-gray-800/50 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-105 flex items-center gap-2"
                    >
                      View All
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Sessions Grid - Full Width Responsive */}
                <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                  {displaySessions.map((session, index) => (
                    <div 
                      key={session.id}
                      className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <SessionCard session={session} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {displayUsers.length === 0 && displaySessions.length === 0 && (
              <SearchEmptyState searchQuery={searchQuery} type={activeTab} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SearchPage;
