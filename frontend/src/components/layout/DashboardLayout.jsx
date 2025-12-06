import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { HomeIcon, SessionsIcon, ProfileIcon, SearchIcon, GearIcon } from '../../icons';
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
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Sessions', href: '/sessions', icon: SessionsIcon },
    { name: 'Profile', href: '/profile', icon: ProfileIcon },
  ];

  const bottomNavigation = [
    { name: 'Settings', href: '/settings', icon: GearIcon },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#0f0f1e] to-[#1a1a2e] flex">
      {/* Left Sidebar - Expanded with Labels */}
      <div className="w-56 bg-gradient-to-b from-[#0e0e1a] via-[#12121f] to-[#0e0e1a] flex flex-col py-6 px-3 border-r border-indigo-900/30 shadow-2xl shadow-black/50 relative">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none"></div>
        
        {/* Logo with Text */}
        <Link to="/dashboard" className="mb-8 group relative z-10 flex items-center gap-2.5 px-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/40 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-indigo-500/50 ring-2 ring-inset ring-white/10 group-hover:ring-white/20 group-active:scale-95 flex-shrink-0">
            <img src={logo} alt="AcadeMeet Logo" className="w-8 h-8 object-contain transition-transform duration-300 group-hover:rotate-12" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Acade<span className="text-indigo-400">Meet</span>
          </span>
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
        </Link>

        {/* Navigation with Labels */}
        <nav className="flex-1 flex flex-col gap-1.5 relative z-10">
          {navigation.map((item, index) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className="relative group"
              >
                {/* Active indicator - left line */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-11 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full -ml-3 shadow-lg shadow-indigo-500/50"></div>
                )}
                
                {/* Nav Item */}
                <div className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                  ${active 
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                  group-hover:scale-[1.02] group-active:scale-[0.98]
                  ring-1 ring-inset ${active ? 'ring-white/20' : 'ring-white/5 hover:ring-white/10'}
                `}>
                  <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${active ? '' : 'group-hover:scale-110'}`} />
                  <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>
                    {item.name}
                  </span>
                  
                  {/* Ripple effect on click */}
                  <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
                </div>

                {/* Hover glow effect */}
                {!active && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-300 pointer-events-none"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="relative z-10 my-4 border-t border-indigo-900/30"></div>

        {/* Bottom Navigation - Settings */}
        <nav className="relative z-10 flex flex-col gap-1.5">
          {bottomNavigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className="relative group"
              >
                {/* Active indicator - left line */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-11 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full -ml-3 shadow-lg shadow-indigo-500/50"></div>
                )}
                
                {/* Nav Item */}
                <div className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                  ${active 
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                  group-hover:scale-[1.02] group-active:scale-[0.98]
                  ring-1 ring-inset ${active ? 'ring-white/20' : 'ring-white/5 hover:ring-white/10'}
                `}>
                  <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${active ? '' : 'group-hover:scale-110'}`} />
                  <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>
                    {item.name}
                  </span>
                  
                  {/* Ripple effect on click */}
                  <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
                </div>

                {/* Hover glow effect */}
                {!active && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-300 pointer-events-none"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-[#0a0a14] via-[#0f0f1e] to-[#0a0a14] border-b border-indigo-900/20 px-8 py-4 backdrop-blur-xl">
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

            {/* Right: Empty or future notifications */}
            <div className="flex items-center gap-2">
              {/* Settings moved to sidebar */}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className={`flex-1 p-8 ${location.pathname === '/profile' ? 'overflow-hidden' : 'overflow-y-auto'} bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e] relative`}>
          {/* Subtle animated gradient orbs for depth */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>

      {/* No global logout modal */}
    </div>
  );
};

export default DashboardLayout;
