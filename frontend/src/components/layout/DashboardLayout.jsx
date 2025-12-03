import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { HomeIcon, SessionsIcon, NotesIcon, ProfileIcon, SearchIcon, MoonIcon, SunIcon, BellIcon, GearIcon } from '../../icons';
import logo from '../../assets/academeet-white.svg';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/users/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => setCurrentUser(data))
      .catch(err => console.error('Failed to load user', err));
  }, []);

  // Logout handlers removed with sidebar logout button

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon },
    { name: 'Sessions', href: '/sessions', icon: SessionsIcon },
    { name: 'Notes', href: '/notes', icon: NotesIcon },
    { name: 'Profile', href: '/profile', icon: ProfileIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex">
      {/* Left Sidebar - Narrow Vertical */}
      <div className="w-16 bg-[#0f0f0f] flex flex-col items-center py-6 border-r border-gray-800">
        {/* Logo */}
        <Link to="/dashboard" className="mb-12 group relative">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/40 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl ring-1 ring-inset ring-white/20 group-hover:ring-white/30">
            <img src={logo} alt="AcadeMeet Logo" className="w-7 h-7 object-contain transition-transform duration-300 group-hover:scale-105" />
          </div>
        </Link>

        {/* Navigation Icons */}
        <nav className="flex-1 flex flex-col items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`relative p-3 rounded-xl transition-all group ${
                isActive(item.href)
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 hover:text-white hover:bg-gray-800'
              }`}
              title={item.name}
            >
              <item.icon className="w-6 h-6" />
              {isActive(item.href) && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full -ml-3"></div>
              )}
              <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg shadow-black/30">
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Bottom space preserved */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-[#141414] border-b border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo Text & Search */}
            <div className="flex items-center gap-6">
              <div>
                <span className="text-2xl font-bold text-white tracking-tight">
                  Acade<span className="text-indigo-400">Meet</span>
                </span>
              </div>
              
              {/* Search Bar - Hide on search page */}
              {!location.pathname.startsWith('/search') && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    onFocus={() => navigate('/search')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
                      }
                    }}
                    className="w-80 px-4 py-2 pl-10 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              )}
            </div>

            {/* Right: Settings */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/settings')}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                title="Settings"
              >
                <GearIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className={`flex-1 p-8 ${location.pathname === '/profile' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          {children}
        </div>
      </div>

      {/* No global logout modal */}
    </div>
  );
};

export default DashboardLayout;
