import React from 'react';
import { Link } from 'react-router-dom';

// ===== PUBLIC PROFILE CONTENT (RIGHT PANEL) =====

export const PublicProfileContent = ({ userData, activeTab, onTabChange }) => {
  return (
    <div className="h-full flex flex-col bg-[#161A2B] border border-indigo-900/40 rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-indigo-500/40">
      {/* Tab Bar Header */}
      <div className="flex-shrink-0 border-b border-gray-800/50 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
        <div className="flex items-center px-6 py-4">
          <div className="flex gap-2">
            <TabButton
              active={activeTab === 'about'}
              onClick={() => onTabChange('about')}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              label="Owned Session"
            />
          </div>
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-3 px-3 -mx-3 -my-3">
        {activeTab === 'about' && <AboutTab userData={userData} />}
      </div>
    </div>
  );
};

// ===== TAB BUTTON COMPONENT =====

const TabButton = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden px-5 py-2.5 rounded-lg text-sm font-bold border transition-all ${
        active
          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-500 shadow-lg shadow-indigo-500/30'
          : 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-400 border-gray-700/50 hover:from-gray-700 hover:to-gray-800 hover:text-gray-300 hover:border-gray-600'
      } group/tab`}
    >
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover/tab:translate-x-[200%] transition-transform duration-700"></div>
      )}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {label}
      </span>
    </button>
  );
};

// ===== ABOUT TAB (NOW SHOWS OWNED SESSIONS) =====

const AboutTab = ({ userData }) => {
  // Mock sessions data
  const sessions = [
    {
      id: 1,
      title: 'Introduction to Machine Learning with Python',
      description: 'Learn the fundamentals of ML algorithms and practical implementation using Python and scikit-learn',
      startTime: new Date('2025-12-15T14:00:00'),
      endTime: new Date('2025-12-15T16:00:00'),
      location: 'Online via Zoom',
      sessionType: 'PUBLIC',
      participants: 12,
      maxParticipants: 15,
      tags: ['Python', 'Machine Learning', 'Data Science']
    },
    {
      id: 2,
      title: 'Advanced React Patterns',
      description: 'Deep dive into advanced React patterns including custom hooks, context, and performance optimization',
      startTime: new Date('2025-12-18T10:00:00'),
      endTime: new Date('2025-12-18T12:00:00'),
      location: 'Room 301, CIT-U',
      sessionType: 'PUBLIC',
      participants: 8,
      maxParticipants: 20,
      tags: ['React', 'JavaScript', 'Web Development']
    },
    {
      id: 3,
      title: 'Data Structures Deep Dive',
      description: 'Comprehensive study of fundamental data structures and their applications',
      startTime: new Date('2025-12-20T15:00:00'),
      endTime: new Date('2025-12-20T17:00:00'),
      location: 'Online via Teams',
      sessionType: 'PRIVATE',
      participants: 5,
      maxParticipants: 10,
      tags: ['Algorithms', 'Data Structures', 'CS Fundamentals']
    }
  ];

  return (
    <div className="p-6 pt-8">
      <div className="grid grid-cols-1 gap-5 py-2">
        {sessions.map((session, index) => (
          <div key={session.id} className="relative hover:z-10">
            <PublicSessionCard session={session} index={index} />
          </div>
        ))}
      </div>
      
      {sessions.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-50">📅</div>
          <h3 className="text-xl font-bold text-white mb-2">No Owned Sessions</h3>
          <p className="text-gray-400 text-sm">This user hasn't created any sessions yet.</p>
        </div>
      )}
    </div>
  );
};

// ===== SCHEDULE TAB =====

const ScheduleTab = ({ userData }) => {
  // Mock sessions data
  const sessions = [
    {
      id: 1,
      title: 'Introduction to Machine Learning with Python',
      description: 'Learn the fundamentals of ML algorithms and practical implementation using Python and scikit-learn',
      startTime: new Date('2025-12-15T14:00:00'),
      endTime: new Date('2025-12-15T16:00:00'),
      location: 'Online via Zoom',
      sessionType: 'PUBLIC',
      participants: 12,
      maxParticipants: 15,
      tags: ['Python', 'Machine Learning', 'Data Science']
    },
    {
      id: 2,
      title: 'Advanced React Patterns',
      description: 'Deep dive into advanced React patterns including custom hooks, context, and performance optimization',
      startTime: new Date('2025-12-18T10:00:00'),
      endTime: new Date('2025-12-18T12:00:00'),
      location: 'Room 301, CIT-U',
      sessionType: 'PUBLIC',
      participants: 8,
      maxParticipants: 20,
      tags: ['React', 'JavaScript', 'Web Development']
    },
    {
      id: 3,
      title: 'Data Structures Deep Dive',
      description: 'Comprehensive study of fundamental data structures and their applications',
      startTime: new Date('2025-12-20T15:00:00'),
      endTime: new Date('2025-12-20T17:00:00'),
      location: 'Online via Teams',
      sessionType: 'PRIVATE',
      participants: 5,
      maxParticipants: 10,
      tags: ['Algorithms', 'Data Structures', 'CS Fundamentals']
    }
  ];

  return (
    <div className="p-6 pt-8">
      <div className="grid grid-cols-1 gap-5 py-2">
        {sessions.map((session, index) => (
          <div key={session.id} className="relative hover:z-10">
            <PublicSessionCard session={session} index={index} />
          </div>
        ))}
      </div>
      
      {sessions.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-50">📅</div>
          <h3 className="text-xl font-bold text-white mb-2">No Upcoming Sessions</h3>
          <p className="text-gray-400 text-sm">This user hasn't scheduled any public sessions yet.</p>
        </div>
      )}
    </div>
  );
};

// ===== REVIEWS TAB =====

const ReviewsTab = ({ userData }) => {
  // Mock reviews data
  const reviews = [
    {
      id: 1,
      reviewerName: 'John Doe',
      reviewerAvatar: null,
      rating: 5,
      comment: 'Excellent mentor! Very patient and explains concepts clearly. The machine learning session was incredibly helpful.',
      date: new Date('2025-12-01'),
      sessionTitle: 'Introduction to Machine Learning'
    },
    {
      id: 2,
      reviewerName: 'Jane Smith',
      reviewerAvatar: null,
      rating: 5,
      comment: 'Great teaching style and very knowledgeable. Highly recommend!',
      date: new Date('2025-11-28'),
      sessionTitle: 'Advanced React Patterns'
    },
    {
      id: 3,
      reviewerName: 'Mike Johnson',
      reviewerAvatar: null,
      rating: 4,
      comment: 'Good session overall. Would have liked more hands-on examples, but the theoretical foundation was solid.',
      date: new Date('2025-11-25'),
      sessionTitle: 'Data Structures Deep Dive'
    }
  ];

  return (
    <div className="p-6 space-y-5 pt-8 py-2">
      {/* Rating Summary */}
      {userData.isMentor && (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl font-bold text-white">{userData.rating || 0}</span>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(userData.rating) ? 'text-amber-400' : 'text-gray-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">Based on {userData.totalReviews || 0} reviews</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-400">{userData.completedSessions || 0}</p>
              <p className="text-xs text-gray-400">Completed Sessions</p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <ReviewCard key={review.id} review={review} index={index} />
        ))}
      </div>
      
      {reviews.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-50">⭐</div>
          <h3 className="text-xl font-bold text-white mb-2">No Reviews Yet</h3>
          <p className="text-gray-400 text-sm">This user hasn't received any reviews.</p>
        </div>
      )}
    </div>
  );
};

// ===== FEATURED SESSION CARD =====

const FeaturedSessionCard = ({ session }) => {
  return (
    <div className="group relative bg-gradient-to-br from-amber-900/20 via-amber-800/20 to-amber-700/20 border border-amber-500/30 rounded-2xl overflow-hidden transition-all hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-[1.02]">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="text-white font-bold text-lg mb-2 group-hover:text-amber-300 transition-colors">
              {session.title}
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {session.description}
            </p>
          </div>
          {session.rating && (
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-amber-300">{session.rating}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {session.tags && session.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {session.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Participants Info */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-medium">{session.participants}/{session.maxParticipants} participants</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== PUBLIC SESSION CARD =====

const PublicSessionCard = ({ session, index }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getAvailabilityColor = () => {
    const percentageFull = (session.participants / session.maxParticipants) * 100;
    if (percentageFull >= 90) return 'text-red-400';
    if (percentageFull >= 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Link
      to={`/session/${session.id}`}
      className="group relative block bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-2xl border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.01] overflow-hidden animate-slideInLeft"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all duration-700 pointer-events-none"></div>
      
      <div className="relative z-10 p-5">
        <div className="flex items-start gap-4">
          {/* Left: Date Badge */}
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex flex-col items-center justify-center border border-indigo-500/30 shadow-lg">
            <span className="text-white text-xs font-medium">
              {formatDate(session.startTime).split(' ')[0]}
            </span>
            <span className="text-white text-2xl font-bold leading-none">
              {formatDate(session.startTime).split(' ')[1].replace(',', '')}
            </span>
          </div>

          {/* Middle: Session Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-white font-bold text-base group-hover:text-indigo-300 transition-colors line-clamp-1">
                {session.title}
              </h3>
              {session.sessionType === 'PRIVATE' && (
                <div className="flex-shrink-0 px-2 py-1 bg-gray-700/50 rounded-lg border border-gray-600/50 flex items-center gap-1">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-400">Private</span>
                </div>
              )}
            </div>

            <p className="text-gray-400 text-sm line-clamp-2 mb-3">
              {session.description}
            </p>

            {/* Session Details */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-3">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>{session.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className={`w-4 h-4 ${getAvailabilityColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className={`font-medium ${getAvailabilityColor()}`}>
                  {session.participants}/{session.maxParticipants}
                </span>
              </div>
            </div>

            {/* Tags */}
            {session.tags && session.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {session.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2.5 py-1 bg-indigo-600/10 border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// ===== REVIEW CARD =====

const ReviewCard = ({ review, index }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div
      className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700/50 rounded-xl p-5 transition-all hover:border-indigo-500/30 hover:bg-gray-800/70 animate-slideInLeft"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start gap-4">
        {/* Reviewer Avatar */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center border-2 border-indigo-500/30 shadow-lg">
          {review.reviewerAvatar ? (
            <img src={review.reviewerAvatar} alt={review.reviewerName} className="w-full h-full rounded-xl object-cover" />
          ) : (
            <span className="text-white text-sm font-bold">
              {review.reviewerName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-white font-bold text-sm">{review.reviewerName}</h4>
              <p className="text-gray-500 text-xs">{formatDate(review.date)}</p>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-gray-600'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-2">
            {review.comment}
          </p>

          {review.sessionTitle && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-600/10 border border-indigo-500/30 rounded-lg">
              <svg className="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-indigo-300 font-medium">{review.sessionTitle}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfileContent;
