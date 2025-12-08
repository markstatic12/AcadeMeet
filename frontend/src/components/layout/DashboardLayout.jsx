import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { HomeIcon, SessionsIcon, ProfileIcon, SearchIcon, GearIcon } from '../../icons';
import logo from '../../assets/academeet-white.svg';
import { authFetch } from '../../services/apiHelper';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await authFetch('/users/me');
        if (!res.ok) throw new Error(`Failed to load user (status ${res.status})`);
        const data = await res.json();
        if (mounted) setCurrentUser(data);
      } catch (err) {
        console.error('Failed to load user', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Logout handlers removed with sidebar logout button

  const navigation = [
    { name: 'Search', href: '/search', icon: SearchIcon },
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Sessions', href: '/sessions', icon: SessionsIcon },
    { name: 'Profile', href: '/profile', icon: ProfileIcon },
  ];

  const bottomNavigation = [
    { name: 'Settings', href: '/settings', icon: GearIcon },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#0a0a14] via-[#0f0f1e] to-[#1a1a2e] flex">
      {/* Left Sidebar - Fixed Height, Never Scrolls */}
      <div className="w-56 h-full bg-[#0a0a14] flex flex-col py-6 px-3 border-r border-gray-800 shadow-2xl shadow-black/50 relative">
        
        {/* Logo with Text - Fixed at top */}
        <Link to="/dashboard" className="mb-8 group relative z-10 flex items-center gap-2.5 px-3 flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/40 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-indigo-500/50 ring-2 ring-inset ring-white/10 group-hover:ring-white/20 group-active:scale-95 flex-shrink-0">
            <img src={logo} alt="AcadeMeet Logo" className="w-8 h-8 object-contain transition-transform duration-300 group-hover:rotate-12" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Acade<span className="text-indigo-400">Meet</span>
          </span>
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
        </Link>

        {/* Main Navigation - Takes available space */}
        <nav className="flex flex-col gap-6 relative z-10 flex-shrink-0">
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

        {/* Spacer - Pushes settings to bottom */}
        <div className="flex-1"></div>

        {/* Separator - Gradient Shimmering Line */}
        <div className="relative z-10 my-6 h-[1px] overflow-hidden rounded-full flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-shimmer"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer" style={{animationDelay: '0.5s'}}></div>
        </div>

        {/* Bottom Navigation - Settings - Pinned to bottom with safe padding */}
        <nav className="relative z-10 flex flex-col gap-3 flex-shrink-0 pb-6">
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

      {/* Main Content Area - Fixed Height with Internal Scrolling */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        {/* Top Bar with User Avatar */}
        <div className="h-16 bg-[#0a0a14] border-b border-gray-800 flex items-center justify-end px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* User Name */}
            {currentUser && (
              <span className="text-sm font-medium text-white">
                {currentUser.name}
              </span>
            )}
            {/* User Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center ring-2 ring-indigo-500/30 overflow-hidden flex-shrink-0">
              {currentUser?.profilePic ? (
                <img 
                  src={currentUser.profilePic} 
                  alt={currentUser.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <ProfileIcon className="w-5 h-5 text-white" />
              )}
            </div>
            
          </div>
        </div>

        {/* Content Area - No scrolling at root level */}
        <div className="flex-1 h-full bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e] relative overflow-hidden">
          {/* Subtle animated gradient orbs for depth */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>
          <div className={`relative z-10 ${location.pathname === '/dashboard' || location.pathname === '/search' ? 'h-full' : 'h-full p-8 overflow-y-auto custom-scrollbar'}`}>
            {children}
          </div>
        </div>
      </div>

      {/* No global logout modal */}
    </div>
  );
};

export default DashboardLayout;
