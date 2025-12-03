import React from 'react';
import SessionStatusBadge from '../ui/SessionStatusBadge';
import { CalendarIcon, ClockIcon, LocationIcon, UserIcon, UsersIcon, LockIcon, GlobeIcon } from '../../icons';

// Read-only Session Profile Display
export const SessionProfileDisplay = ({ session }) => {
  return (
    <div className="relative">
      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden">
        <svg className="w-16 h-16 text-indigo-400" fill="currentColor">
          <path d="M4 5h13v7h2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8v-2H4V5zm16 10l-4-4v3H9v2h7v3l4-4z" />
        </svg>
      </div>
      {/* Status Badge positioned on profile */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
        <SessionStatusBadge status={session?.status || 'ACTIVE'} />
      </div>
    </div>
  );
};

// Read-only Session Title Display
export const SessionTitleDisplay = ({ title }) => {
  return (
    <div className="flex-1">
      <h1 className="text-4xl font-bold text-white">
        {title || 'Untitled Session'}
      </h1>
    </div>
  );
};

// Read-only Session Header
export const SessionViewHeader = ({ session }) => {
  return (
    <div className="flex items-center gap-6 mb-12">
      <SessionProfileDisplay session={session} />
      <SessionTitleDisplay title={session?.title} />
    </div>
  );
};

// Read-only Date Display
export const DateDisplay = ({ month, day, year }) => {
  const formatDate = () => {
    if (!month || !day || !year) return 'Date not set';
    return `${month} ${day}, ${year}`;
  };

  return (
    <div className="mb-4 flex items-center gap-3 text-gray-300">
      <CalendarIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
      <span className="text-sm">{formatDate()}</span>
    </div>
  );
};

// Read-only Time Display
export const TimeDisplay = ({ startTime, endTime }) => {
  const formatTime = () => {
    if (!startTime || !endTime) return 'Time not set';
    return `${startTime} - ${endTime}`;
  };

  return (
    <div className="mb-4 flex items-center gap-3 text-gray-300">
      <ClockIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
      <span className="text-sm">{formatTime()}</span>
    </div>
  );
};

// Read-only Location Display
export const LocationDisplay = ({ location }) => {
  return (
    <div className="mb-4 flex items-center gap-3 text-gray-300">
      <LocationIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
      <span className="text-sm">{location || 'Location not specified'}</span>
    </div>
  );
};

// Read-only Session Type Display
export const SessionTypeDisplay = ({ sessionType }) => {
  const isPrivate = sessionType === 'PRIVATE';
  
  return (
    <div className="mb-4 flex items-center gap-3 text-gray-300">
      {isPrivate ? (
        <LockIcon className="w-4 h-4 text-yellow-400 flex-shrink-0" />
      ) : (
        <GlobeIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
      )}
      <span className="text-sm">{isPrivate ? 'Private Session' : 'Public Session'}</span>
    </div>
  );
};

// Read-only Participants Display
export const ParticipantsDisplay = ({ currentParticipants, maxParticipants }) => {
  if (!maxParticipants) return null;
  
  return (
    <div className="mb-4 flex items-center gap-3 text-gray-300">
      <UsersIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
      <span className="text-sm">{currentParticipants || 0} / {maxParticipants} participants</span>
    </div>
  );
};

// Read-only Host Display
export const HostDisplay = ({ host }) => {
  return (
    <div className="mb-4 flex items-center gap-3 text-gray-300">
      <UserIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
      <span className="text-sm">{host?.name || 'Unknown Host'}</span>
    </div>
  );
};

// Read-only Session Details Panel
export const ViewDetailsPanel = ({ session }) => {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6">
      <h3 className="text-white font-bold text-xl mb-6">Session Details</h3>

      <ParticipantsDisplay
        currentParticipants={session?.currentParticipants}
        maxParticipants={session?.maxParticipants}
      />

      <DateDisplay
        month={session?.month}
        day={session?.day}
        year={session?.year}
      />

      <TimeDisplay
        startTime={session?.startTime}
        endTime={session?.endTime}
      />

      <LocationDisplay location={session?.location} />

      <HostDisplay host={session?.createdBy} />

      <SessionTypeDisplay
        sessionType={session?.sessionType}
      />
    </div>
  );
};

// Read-only Session Overview Panel
export const ViewOverviewPanel = ({ session }) => {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6">
      <h3 className="text-white font-bold text-xl mb-6">Session Overview</h3>

      <div className="px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-gray-300 text-sm min-h-[400px]">
        {session?.description || 'No description provided for this session.'}
      </div>
    </div>
  );
};

// Comments/Replies Panel  
export const CommentsPanel = ({ sessionId }) => {
  const [comments, setComments] = React.useState([]);
  const [newComment, setNewComment] = React.useState('');
  const [replyingTo, setReplyingTo] = React.useState(null); // { commentId, userName, userId }
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [expandedComments, setExpandedComments] = React.useState(new Set()); // Track which comments have expanded replies

  const loadComments = React.useCallback(async () => {
    setLoading(true);
    try {
      const { getSessionComments } = await import('../../services/CommentService');
      const data = await getSessionComments(sessionId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Fetch comments on mount
  React.useEffect(() => {
    if (sessionId) {
      loadComments();
    }
  }, [sessionId, loadComments]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const { createComment, createReply } = await import('../../services/CommentService');
      
      if (replyingTo) {
        // Creating a reply
        await createReply(sessionId, replyingTo.commentId, newComment);
      } else {
        // Creating a new comment
        await createComment(sessionId, newComment);
      }

      // Reload comments and reset form
      await loadComments();
      setNewComment('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error posting comment/reply:', error);
      alert('Failed to post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (commentId, userName, userId) => {
    setReplyingTo({ commentId, userName, userId });
    setNewComment(`@${userName} `);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment('');
  };

  const formatTimeAgo = (createdAt) => {
    const now = new Date();
    const date = new Date(createdAt);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const toggleReplies = (commentId) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 flex flex-col" style={{ height: '600px' }}>
      <h3 className="text-white font-bold text-xl mb-6 flex-shrink-0">Comments & Replies</h3>
      
      {/* Comment Input */}
      <div className="mb-6 flex-shrink-0">
        {replyingTo && (
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
            <span>Replying to @{replyingTo.userName}</span>
            <button
              onClick={cancelReply}
              className="text-indigo-400 hover:text-indigo-300"
            >
              Cancel
            </button>
          </div>
        )}
        <textarea
          placeholder={replyingTo ? `Reply to @${replyingTo.userName}...` : "Add a comment..."}
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-gray-300 text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          onClick={handleSubmit}
          disabled={!newComment.trim() || submitting}
          className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          {submitting ? 'Posting...' : (replyingTo ? 'Post Reply' : 'Post Comment')}
        </button>
      </div>

      {/* Comments List - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No comments yet</p>
            <p className="text-sm">Be the first to leave a comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.commentId} className="border-b border-gray-800 pb-4 last:border-b-0">
              {/* Parent Comment */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {getInitials(comment.userName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-medium">{comment.userName}</span>
                    <span className="text-gray-400 text-xs">{formatTimeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2 break-words">{comment.content}</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleReply(comment.commentId, comment.userName, comment.userId)}
                      className="text-indigo-400 hover:text-indigo-300 text-xs font-medium"
                    >
                      Reply
                    </button>
                    {comment.replies && comment.replies.length > 0 && (
                      <button
                        onClick={() => toggleReplies(comment.commentId)}
                        className="text-gray-400 hover:text-gray-300 text-xs font-medium flex items-center gap-1"
                      >
                        <svg 
                          className={`w-3 h-3 transition-transform ${expandedComments.has(comment.commentId) ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Replies (single-level indent) - Only show when expanded */}
              {comment.replies && comment.replies.length > 0 && expandedComments.has(comment.commentId) && (
                <div className="ml-11 mt-3 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.commentId} className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        {getInitials(reply.userName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white text-sm font-medium">{reply.userName}</span>
                          <span className="text-gray-400 text-xs">{formatTimeAgo(reply.createdAt)}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2 break-words">{reply.content}</p>
                        <button
                          onClick={() => handleReply(comment.commentId, reply.userName, reply.userId)}
                          className="text-indigo-400 hover:text-indigo-300 text-xs font-medium"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};