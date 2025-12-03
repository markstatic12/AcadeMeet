import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { SessionViewHeader, ViewDetailsPanel, ViewOverviewPanel, CommentsPanel } from '../components/sessions/SessionViewComponents';
import { sessionService } from '../services/SessionService';
import { useUser } from '../context/UserContext';

const PasswordModal = ({ isOpen, onClose, onSubmit, sessionTitle, needsAuthentication = false }) => {
  const [password, setPassword] = useState('');
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-white mb-4">{modalTitle}</h3>
        <p className="text-gray-300 text-sm mb-6">
          {modalMessage}
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 mb-4"
            autoFocus
            disabled={isSubmitting}
          />
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!password.trim() || isSubmitting}
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? (needsAuthentication ? 'Accessing...' : 'Joining...') : submitButtonText}
            </button>
          </div>
        </form>
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
        }

      } catch (err) {
        console.error('Error fetching session:', err);
        setError(err.message || 'Failed to load session');
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId, currentUserId, requiresPasswordAuth]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const sessionData = await sessionService.getSessionById(sessionId);
      setSession(sessionData);
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

  const handleJoinSession = async () => {
    // For private sessions, use the stored validated password
    // For public sessions, no password needed
    const passwordToUse = session.sessionType === 'PRIVATE' ? validatedPassword : null;
    await joinSession(passwordToUse);
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
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <div className="relative z-10 p-8 animate-fadeIn">
        <PageHeader 
          onBack={handleBack} 
          onSubmit={isSessionOwner ? handleEditSession : handleJoinSession}
          isSubmitting={isJoining}
          showSubmit={session.status === 'ACTIVE'}
          submitText={isSessionOwner ? 'Edit Session' : (isJoining ? 'Joining...' : 'Join Session')}
          submitIcon={isSessionOwner ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          ) : (
            session.sessionType === 'PRIVATE' && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
              </svg>
            )
          )}
        />

        <SessionViewHeader session={session} />

        <div className="grid grid-cols-6 gap-8 mt-6">
          <ViewDetailsPanel session={session} />
          
          <div className="col-span-4">
            <ViewOverviewPanel session={session} />
          </div>
          
          <CommentsPanel />
        </div>
      </div>
    </div>
  );
};

export default SessionViewPage;