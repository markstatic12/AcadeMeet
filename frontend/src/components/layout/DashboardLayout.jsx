import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { HomeIcon, SessionsIcon, ProfileIcon, SearchIcon, GearIcon, BellIcon } from '../../icons';
import logo from '../../assets/academeet-white.svg';
import { notificationService } from '../../services/notificationService';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useUser(); // Get user from context instead of local state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedView, setExpandedView] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [bellAnimation, setBellAnimation] = useState('');
  const notificationRef = useRef(null);

  // Removed redundant authFetch - user data now comes from UserContext

  // Load unread count on mount and periodically
  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 60000); // Every 60 seconds
    return () => clearInterval(interval);
  }, []);

  // Trigger bell shake animation every 3 seconds when there are unread notifications
  useEffect(() => {
    if (unreadCount > 0) {
      const shakeInterval = setInterval(() => {
        setBellAnimation('bell-shake');
        setTimeout(() => setBellAnimation(''), 600);
      }, 3000);
      return () => clearInterval(shakeInterval);
    }
  }, [unreadCount]);

  // Load notifications when modal opens
  useEffect(() => {
    if (showNotifications) {
      loadNotifications();
    }
  }, [showNotifications, filter]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const loadUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.count);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    }
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = filter === 'unread' 
        ? await notificationService.getUnreadNotifications()
        : await notificationService.getAllNotifications();
      
      // Filter out scheduled reminders - they belong in dashboard
      const instantNotifications = data.filter(n => !n.scheduledTime);
      setNotifications(instantNotifications);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      if (!notification.read) {
        await notificationService.markAsRead(notification.id);
        // Update local state
        setNotifications(notifications.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        ));
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      // Close modal
      setShowNotifications(false);

      // Navigate to session if exists
      if (notification.sessionId) {
        navigate(`/session/${notification.sessionId}`);
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleToggleRead = async (notification, e) => {
    e.stopPropagation();
    setActiveMenu(null);
    
    try {
      if (!notification.read) {
        await notificationService.markAsRead(notification.id);
        setNotifications(notifications.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        await notificationService.markAsUnread(notification.id);
        setNotifications(notifications.map(n => 
          n.id === notification.id ? { ...n, read: false } : n
        ));
        setUnreadCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Failed to toggle read status:', err);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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
        <nav className="flex flex-col gap-4 relative z-10 flex-shrink-0">
          {navigation.map((item, index) => {
            const active = isActive(item.href);
            const isSearch = item.name === 'Search';
            
            return (
              <React.Fragment key={item.name}>
                <Link
                  to={item.href}
                  className="relative group"
                >
                  {/* Search-specific subtle accent border */}
                  {isSearch && !active && (
                    <div className="absolute inset-0 rounded-xl border border-indigo-500/20 group-hover:border-indigo-400/40 transition-colors duration-300"></div>
                  )}
                  
                  {/* Active indicator - left line */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-11 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full -ml-3 shadow-lg shadow-indigo-500/50"></div>
                  )}
                  
                  {/* Nav Item */}
                  <div className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                    ${active 
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30' 
                      : isSearch
                        ? 'text-gray-300 hover:text-white hover:bg-gradient-to-br hover:from-indigo-600/10 hover:to-purple-600/10 bg-gradient-to-br from-indigo-900/5 to-purple-900/5'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                    group-hover:scale-[1.02] group-active:scale-[0.98]
                    ring-1 ring-inset ${active ? 'ring-white/20' : 'ring-white/5 hover:ring-white/10'}
                  `}>
                    {/* Icon with subtle animation for search */}
                    <item.icon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                      active ? '' : isSearch ? 'group-hover:scale-110 group-hover:rotate-12' : 'group-hover:scale-110'
                    }`} />
                    
                    <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>
                      {item.name}
                    </span>
                    
                    {/* Search-specific subtle indicator */}
                    {isSearch && !active && (
                      <div className="ml-auto">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/60 group-hover:bg-indigo-400 transition-colors duration-300 animate-pulse"></div>
                      </div>
                    )}
                    
                    {/* Ripple effect on click */}
                    <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
                  </div>

                  {/* Enhanced hover glow for search */}
                  {!active && isSearch && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-15 blur-lg transition-opacity duration-300 pointer-events-none"></div>
                  )}
                  
                  {/* Standard hover glow effect for others */}
                  {!active && !isSearch && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-300 pointer-events-none"></div>
                  )}
                </Link>
                
                {/* Subtle divider after Search */}
                {isSearch && (
                  <div className="relative h-px my-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>
                  </div>
                )}
              </React.Fragment>
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
            
            {/* Notification Bell Icon */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => {
                  setBellAnimation('bell-click');
                  setTimeout(() => setBellAnimation(''), 300);
                  setShowNotifications(!showNotifications);
                }}
                className={`relative p-2 hover:bg-gray-800/80 rounded-lg transition-all duration-200 ${
                  unreadCount > 0 ? 'bell-pulse' : ''
                }`}
              >
                <BellIcon className={`w-5 h-5 text-white transition-transform ${bellAnimation}`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Modal */}
              {showNotifications && (
                <div className={`modal-fade-in absolute right-0 mt-2 w-96 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col transition-all duration-300 ${
                  expandedView ? 'h-[calc(100vh-100px)]' : 'max-h-[600px]'
                }`}>
                  {/* Header */}
                  <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    
                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          filter === 'all'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilter('unread')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          filter === 'unread'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        Unread
                        {unreadCount > 0 && (
                          <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                      <div className="p-8 text-center text-gray-400">
                        Loading...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <span className="text-4xl mb-2 block">🔔</span>
                        <p className="text-gray-400">No {filter === 'unread' ? 'unread' : ''} notifications</p>
                      </div>
                    ) : (
                      <div className="p-2">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`relative p-3 rounded-lg transition-all mb-2 ${
                              notification.read
                                ? 'bg-gray-800/30 opacity-80'
                                : 'bg-indigo-500/10 hover:bg-indigo-500/20'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {/* Unread indicator */}
                              {!notification.read && (
                                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              )}
                              
                              <div 
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => handleNotificationClick(notification)}
                              >
                                <p className={`text-sm ${notification.read ? 'text-gray-400' : 'text-white'}`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatTime(notification.createdAt)}
                                </p>
                              </div>

                              {/* Three-dot menu */}
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenu(activeMenu === notification.id ? null : notification.id);
                                  }}
                                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                                >
                                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
                                    <circle cx="8" cy="3" r="1.5"/>
                                    <circle cx="8" cy="8" r="1.5"/>
                                    <circle cx="8" cy="13" r="1.5"/>
                                  </svg>
                                </button>

                                {/* Dropdown menu */}
                                {activeMenu === notification.id && (
                                  <div className="absolute right-0 mt-1 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                                    <button
                                      onClick={(e) => handleToggleRead(notification, e)}
                                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                      {notification.read ? 'Mark as unread' : 'Mark as read'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-gray-800">
                    <button
                      onClick={() => setExpandedView(!expandedView)}
                      className="w-full text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {expandedView ? 'Show less' : 'View all notifications'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Name */}
            {currentUser ? (
              <span className="text-sm font-medium text-white">
                {currentUser.name}
              </span>
            ) : (
              <div className="h-4 w-24 bg-gray-700 animate-pulse rounded"></div>
            )}
            {/* User Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center ring-2 ring-indigo-500/30 overflow-hidden flex-shrink-0">
              {currentUser?.profilePic ? (
                <img 
                  src={currentUser.profilePic} 
                  alt={currentUser.name} 
                  className="w-full h-full object-cover"
                />
              ) : currentUser ? (
                <ProfileIcon className="w-5 h-5 text-white" />
              ) : (
                <div className="w-full h-full bg-gray-700 animate-pulse"></div>
              )}
            </div>
            
          </div>
        </div>

        {/* Content Area - No scrolling at root level */}
        <div className="flex-1 h-full bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e] relative overflow-hidden">
          {/* Subtle animated gradient orbs for depth */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>
          <div className={`relative z-10 ${location.pathname === '/dashboard' || location.pathname === '/search' || location.pathname === '/profile' ? 'h-full' : 'h-full p-8 overflow-y-auto custom-scrollbar'}`}>
            {children}
          </div>
        </div>
      </div>

      {/* No global logout modal */}
    </div>
  );
};

export default DashboardLayout;
