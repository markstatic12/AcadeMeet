import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { SessionViewHeader, ViewDetailsPanel, ViewOverviewPanel, CommentsPanel } from '../components/sessions/SessionViewComponents';
import SessionStatusBadge from '../components/ui/SessionStatusBadge';
import { sessionService } from '../services/SessionService';

const PasswordModal = ({ isOpen, onClose, onSubmit, sessionTitle, needsAuthentication = false }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(password);
      setPassword('');
    } catch (err) {
      // Error handling is done in parent component
      console.error('Password submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  if (!isOpen) return null;

  const modalTitle = needsAuthentication ? 'Private Session Access' : 'Enter Session Password';
  const modalMessage = needsAuthentication 
    ? `"${sessionTitle}" is a private session. Please enter the password to view session details.`
    : `"${sessionTitle}" is a private session. Please enter the password to join.`;
  const submitButtonText = needsAuthentication ? 'Access Session' : 'Join Session';

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-4" 
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-md animate-slideUp" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden group">
          {/* Sweep effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-sweepOnce pointer-events-none"></div>
          
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
          
          {/* Lock Icon Header */}
          <div className="flex items-center justify-center pt-8 pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <h3 className="text-2xl font-bold text-white mb-3 text-center">{modalTitle}</h3>
            <p className="text-gray-300 text-sm mb-6 text-center leading-relaxed">
              {modalMessage}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 pr-12 bg-[#1e293b] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  autoFocus
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!password.trim() || isSubmitting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
                >
                  {isSubmitting ? (needsAuthentication ? 'Accessing...' : 'Joining...') : submitButtonText}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const SessionViewPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [needsAuthentication, setNeedsAuthentication] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('');
  const [validatedPassword, setValidatedPassword] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isParticipant, setIsParticipant] = useState(false);

  // Fetch current user ID on mount
  useEffect(() => {
    fetch('http://localhost:8080/api/users/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => setCurrentUserId(data.id))
      .catch(err => console.error('Failed to load current user', err));
  }, []);

  const isSessionOwner = session && currentUserId && session.createdBy?.id === currentUserId;

  // Helper function to check if session is full
  const isSessionFull = useCallback(() => {
    if (!session) return false;
    const currentParticipants = session.currentParticipants || 0;
    const maxParticipants = session.maxParticipants;
    return maxParticipants && currentParticipants >= maxParticipants;
  }, [session]);

  // Helper function to determine if session requires password authentication
  const requiresPasswordAuth = useCallback((sessionData) => {
    const isOwner = sessionData.createdBy?.id === currentUserId;
    return sessionData.sessionType === 'PRIVATE' && !isOwner;
  }, [currentUserId]);

  // Helper function to show user-friendly error messages
  const showErrorAlert = useCallback((error, defaultMessage) => {
    if (error.message.includes('password')) {
      alert('Incorrect password. Please try again.');
    } else if (error.message.includes('full')) {
      alert('This session is full. Cannot join at this time.');
    } else {
      alert(`${defaultMessage}: ${error.message}`);
    }
  }, []);

  useEffect(() => {
    const loadSession = async () => { 
      try {
        setLoading(true);
        setError(null);
        const sessionData = await sessionService.getSessionById(sessionId);
        console.log('Loaded session:', sessionData);
        
        if (requiresPasswordAuth(sessionData)) {
          // For private sessions, show password modal immediately
          setSessionTitle(sessionData.title);
          setNeedsAuthentication(true);
          setShowPasswordModal(true);
          setSession(null); // Don't show session details until authenticated
        } else {
          // Public session or owner - show normally
          setSession(sessionData);
          setNeedsAuthentication(false);
          
          // Check if user is already a participant
          checkParticipationStatus();
        }

      } catch (err) {
        console.error('Error fetching session:', err);
        setError(err.message || 'Failed to load session');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      loadSession();
    }
  }, [sessionId]); 

  const checkParticipationStatus = async () => {
    try {
      const result = await sessionService.isUserParticipant(sessionId);
      setIsParticipant(result.isParticipant);
    } catch (err) {
      console.error('Error checking participation status:', err);
    }
  };

  const fetchSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const sessionData = await sessionService.getSessionById(sessionId);
      setSession(sessionData);
      // Also refresh participation status
      await checkParticipationStatus();
    } catch (err) {
      console.error('Error fetching session:', err);
      setError(err.message || 'Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSession = () => {
    navigate(`/edit-session/${sessionId}`);
  };

  const handleTrashSession = async () => {
    if (!window.confirm('Are you sure you want to move this session to trash?')) {
      return;
    }

    try {
      await sessionService.updateSessionStatus(sessionId, 'TRASH');
      alert('Session moved to trash successfully');
      navigate('/sessions');
    } catch (error) {
      console.error('Error trashing session:', error);
      alert(`Failed to move session to trash: ${error.message}`);
    }
  };

  const handleJoinSession = async () => {
    if (isParticipant) {
      // User is already a participant, cancel their participation
      await cancelJoinSession();
    } else {
      // User is not a participant, join the session
      const passwordToUse = session.sessionType === 'PRIVATE' ? validatedPassword : null;
      await joinSession(passwordToUse);
    }
  };

  const handlePrivateSessionJoin = async (password) => {
    if (needsAuthentication) {
      // First time accessing private session - validate password to view details (WITHOUT joining)
      try {
        setIsJoining(true);
        // Only validate password, don't join the session yet
        await sessionService.validateSessionPassword(sessionId, password);
        
        // Store the validated password for later use when joining
        setValidatedPassword(password);
        
        // If successful, load the session details
        const sessionData = await sessionService.getSessionById(sessionId);
        setSession(sessionData);
        setNeedsAuthentication(false);
        setShowPasswordModal(false);
        
        // Show success message for viewing (not joining)
        alert(`Successfully accessed "${sessionData.title}". Click "Join Session" to participate.`);
        
      } catch (error) {
        console.error('Error authenticating private session:', error);
        if (error.message.includes('password')) {
          alert('Incorrect password. Please try again.');
          // Keep modal open for retry
        } else {
          alert(`Failed to access session: ${error.message}`);
          setShowPasswordModal(false);
          setError('Failed to authenticate with session');
        }
      } finally {
        setIsJoining(false);
      }
    } else {
      // Already viewing session, just joining again
      await joinSession(password);
      setShowPasswordModal(false);
    }
  };

  const joinSession = async (password = null) => {
    try {
      setIsJoining(true);
      
      if (isSessionFull()) {
        alert('This session is full. Cannot join at this time.');
        return;
      }

      await sessionService.joinSession(sessionId, password);
      
      // Update participation status
      setIsParticipant(true);
      
      // Show success message
      alert(`You have successfully joined "${session.title}"`);
      
      // Refresh session data to update participant count
      await fetchSession();
      
    } catch (error) {
      console.error('Error joining session:', error);
      showErrorAlert(error, 'Failed to join session');
    } finally {
      setIsJoining(false);
    }
  };

  const cancelJoinSession = async () => {
    if (!window.confirm('Are you sure you want to cancel your participation in this session?')) {
      return;
    }

    try {
      setIsJoining(true);
      
      await sessionService.cancelJoinSession(sessionId);
      
      // Update participation status
      setIsParticipant(false);
      
      // Show success message
      alert(`You have canceled your participation in "${session.title}"`);
      
      // Refresh session data to update participant count
      await fetchSession();
      
    } catch (error) {
      console.error('Error canceling participation:', error);
      alert(`Failed to cancel participation: ${error.message}`);
    } finally {
      setIsJoining(false);
    }
  };

  const handleBack = () => {
    navigate('/sessions');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
        <div className="relative z-10 p-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-white">Loading session...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
        <div className="relative z-10 p-8">
          <PageHeader onBack={handleBack} />
          
          <div className="bg-red-900/20 border border-red-800 rounded-2xl p-6 text-center mt-8">
            <h2 className="text-xl font-bold text-red-400 mb-2">Session Not Found</h2>
            <p className="text-gray-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session && !needsAuthentication) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
        <div className="relative z-10 p-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-gray-400">Session not found</div>
          </div>
        </div>
      </div>
    );
  }

  // If we need authentication (private session), show loading state with password modal
  if (needsAuthentication && !session) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
        <div className="relative z-10 p-8">
          <PageHeader onBack={handleBack} />
          
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 text-center mt-8">
            <h2 className="text-xl font-bold text-white mb-2">Private Session</h2>
            <p className="text-gray-300">Please enter the password to access this session.</p>
          </div>

          <PasswordModal
            isOpen={showPasswordModal}
            onClose={() => {
              setShowPasswordModal(false);
              if (needsAuthentication) {
                navigate('/sessions');
              }
            }}
            onSubmit={handlePrivateSessionJoin}
            sessionTitle={sessionTitle}
            needsAuthentication={needsAuthentication}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#0f0f1e] to-[#1a1a2e] relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(99,102,241,0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Hero Header Section */}
        <div className="flex-shrink-0 px-8 pt-6 pb-4 border-b border-indigo-900/20">
          {/* Navigation and Actions Bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </button>

            {/* Action Buttons Bar */}
            <div className="flex items-center gap-3">
              {isSessionOwner && session.status === 'ACTIVE' && (
                <button
                  type="button"
                  onClick={handleTrashSession}
                  className="px-5 py-2.5 bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 hover:border-red-600/50 text-red-400 hover:text-red-300 rounded-lg font-semibold transition-all text-sm flex items-center gap-2 hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Trash
                </button>
              )}
              
              {session.status === 'ACTIVE' && (
                <button
                  type="button"
                  onClick={isSessionOwner ? handleEditSession : handleJoinSession}
                  disabled={isJoining}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 text-sm flex items-center gap-2 hover:scale-105"
                >
                  {isSessionOwner ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Session
                    </>
                  ) : (
                    <>
                      {session.sessionType === 'PRIVATE' && !isParticipant && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                        </svg>
                      )}
                      {isJoining 
                        ? (isParticipant ? 'Canceling...' : 'Joining...') 
                        : (isParticipant ? 'Cancel Join' : 'Join Session')
                      }
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Session Title and Icon Hero */}
          <div className="flex items-center gap-6">
            {/* Session Icon */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-500/40 border-2 border-indigo-400/20">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 5h13v7h2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8v-2H4V5zm16 10l-4-4v3H9v2h7v3l4-4z" />
                </svg>
              </div>
              <div className="absolute -bottom-2 -right-2">
                <SessionStatusBadge status={session?.status || 'ACTIVE'} />
              </div>
            </div>

            {/* Title and Metadata */}
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                {session?.title || 'Untitled Session'}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Created by {session?.createdBy?.name || 'Unknown'}</span>
                </div>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Last updated {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three Column Grid - No Scrolling */}
        <div className="flex-1 px-8 py-6 overflow-hidden">
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Left: Session Details */}
            <div className="col-span-3 h-full">
              <ViewDetailsPanel session={session} />
            </div>
            
            {/* Center: Session Overview */}
            <div className="col-span-5 h-full">
              <ViewOverviewPanel session={session} />
            </div>
            
            {/* Right: Comments & Replies */}
            <div className="col-span-4 h-full">
              <CommentsPanel sessionId={sessionId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionViewPage;