import React from 'react';
import SessionStatusBadge from '../ui/SessionStatusBadge';
import { CalendarIcon, ClockIcon, LocationIcon, UserIcon, UsersIcon, LockIcon, GlobeIcon } from '../../icons';
import { formatTime as formatTimeUtil } from '../../utils/dateTimeUtils';
import { buildSafeDownloadUrl, sanitizeFilePath } from '../../utils/urlValidator';
import { API_BASE_URL } from '../../services/apiHelper';

// Read-only Tags Display
export const TagsDisplay = ({ tags = [] }) => {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <label className="text-gray-300 text-sm font-semibold">Tags</label>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-full text-sm"
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

// Read-only Notes Display
export const NotesDisplay = ({ notes = [] }) => {
  if (!notes || notes.length === 0) return null;

  const getFileIcon = (filepath) => {
    const ext = filepath?.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext)) return '📄';
    if (['doc', 'docx'].includes(ext)) return '📝';
    if (['xls', 'xlsx'].includes(ext)) return '📊';
    if (['ppt', 'pptx'].includes(ext)) return '📽️';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return '🖼️';
    if (['zip', 'rar', '7z'].includes(ext)) return '📦';
    return '📎';
  };

  const getFilename = (filepath) => {
    if (!filepath) return 'Unknown file';
    const parts = filepath.split('/');
    return parts[parts.length - 1];
  };

  const getFullUrl = (filepath) => {
    if (!filepath) return '#';
    // If filepath already starts with http, return as is (external links)
    if (filepath.startsWith('http')) return filepath;
    // Otherwise use safe URL builder with validation
    return buildSafeDownloadUrl(filepath, API_BASE_URL.replace('/api', ''));
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <label className="text-gray-300 text-sm font-semibold">Session Notes</label>
        <span className="text-xs text-gray-500">({notes.length})</span>
      </div>
      <div className="space-y-2">
        {notes.map((note, index) => {
          const filepath = typeof note === 'string' ? note : note.filepath;
          const filename = getFilename(filepath);
          const fullUrl = getFullUrl(filepath);
          return (
            <a
              key={index}
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 hover:border-indigo-500/40 rounded-lg transition-all group"
            >
              <span className="text-2xl">{getFileIcon(filepath)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-indigo-300 group-hover:text-indigo-200 truncate">{filename}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
};

// Read-only Session Profile Display
export const SessionProfileDisplay = ({ session }) => {
  return (
    <div className="relative group">
      <div className="w-36 h-36 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl shadow-indigo-500/40 border-4 border-gray-900">
        <svg className="w-18 h-18 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 5h13v7h2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8v-2H4V5zm16 10l-4-4v3H9v2h7v3l4-4z" />
        </svg>
      </div>
      {/* Status Badge positioned on profile */}
      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
        <SessionStatusBadge status={session?.status || 'ACTIVE'} />
      </div>
    </div>
  );
};

// Read-only Session Title Display
export const SessionTitleDisplay = ({ title }) => {
  return (
    <div className="flex-1">
      <h1 className="text-5xl font-bold text-white tracking-tight">
        {title || 'Untitled Session'}
      </h1>
    </div>
  );
};

// Read-only Session Header
export const SessionViewHeader = ({ session }) => {
  return (
    <div className="flex items-center gap-8 mb-8">
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
    <div className="flex items-center gap-3 text-gray-300">
      <CalendarIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
      <span className="text-sm">{formatDate()}</span>
    </div>
  );
};

// Read-only Time Display
export const TimeDisplay = ({ startTime, endTime }) => {
  const formatTime = () => {
    if (!startTime || !endTime) return 'Time not set';
    return `${formatTimeUtil(startTime)} - ${formatTimeUtil(endTime)}`;
  };

  return (
    <div className="flex items-center gap-3 text-gray-300">
      <ClockIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
      <span className="text-sm">{formatTime()}</span>
    </div>
  );
};

// Read-only Location Display
export const LocationDisplay = ({ location }) => {
  return (
    <div className="flex items-center gap-3 text-gray-300">
      <LocationIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
      <span className="text-sm">{location || 'Location not specified'}</span>
    </div>
  );
};

// Read-only Session Type Display
export const SessionPrivacyDisplay = ({ sessionPrivacy }) => {
  const isPrivate = sessionPrivacy === 'PRIVATE';
  
  return (
    <div className="flex items-center gap-3 text-gray-300">
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
export const ParticipantsDisplay = ({ currentParticipants, maxParticipants, participants, participantCount, onClick }) => {
  // Determine the actual participant count from various possible sources
  let count = 0;
  if (participantCount !== undefined && participantCount !== null) {
    count = participantCount; // From backend's getParticipantCount() method
  } else if (Array.isArray(participants)) {
    count = participants.length; // From participants array
  } else if (currentParticipants !== undefined && currentParticipants !== null) {
    count = currentParticipants; // From currentParticipants field
  }
  
  const displayContent = (
    <div className="flex items-center gap-3 text-gray-300">
      <UsersIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
      <span className="text-sm">{count} / {maxParticipants || '∞'} participants</span>
    </div>
  );

  // If onClick is provided, make it clickable
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left hover:bg-indigo-900/20 rounded-lg p-2 -ml-2 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          {displayContent}
          <svg 
            className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    );
  }

  return displayContent;
};

// Read-only Host Display
export const HostDisplay = ({ host }) => {
  return (
    <div className="flex items-center gap-3 text-gray-300">
      <UserIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
      <span className="text-sm">{host?.name || 'Unknown Host'}</span>
    </div>
  );
};

// Read-only Session Details Panel
export const ViewDetailsPanel = ({ session, onParticipantsClick }) => {
  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-center gap-2.5 px-5 py-4 bg-[#161A2B] border border-indigo-900/40 rounded-xl mb-4 flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-white font-bold text-base">Session Details</h3>
      </div>

      <div className="flex-1 px-5 py-4 space-y-3 overflow-y-auto custom-scrollbar min-h-0">
        {(() => {
          // Show participant info if any participant-related data exists
          const hasParticipantInfo = session && (
            session.maxParticipants !== undefined ||
            session.currentParticipants !== undefined ||
            session.participants !== undefined ||
            session.participantCount !== undefined
          );

          if (hasParticipantInfo) {
            return (
              <>
                <ParticipantsDisplay
                  currentParticipants={session?.currentParticipants}
                  maxParticipants={session?.maxParticipants}
                  participants={session?.participants}
                  participantCount={session?.participantCount}
                  onClick={onParticipantsClick}
                />
                <div className="border-t border-indigo-900/10 my-3"></div>
              </>
            );
          }

          return null;
        })()}

        <DateDisplay
          month={session?.month}
          day={session?.day}
          year={session?.year}
        />
        <div className="border-t border-indigo-900/10 my-3"></div>

        <TimeDisplay
          startTime={session?.startTime}
          endTime={session?.endTime}
        />
        <div className="border-t border-indigo-900/10 my-3"></div>

        <LocationDisplay location={session?.location} />
        <div className="border-t border-indigo-900/10 my-3"></div>

        <HostDisplay host={session?.createdBy} />
        <div className="border-t border-indigo-900/10 my-3"></div>

        <SessionPrivacyDisplay
          sessionPrivacy={session?.sessionPrivacy}
        />

        {session?.tags && session.tags.length > 0 && (
          <>
            <div className="border-t border-indigo-900/10 my-3"></div>
            <TagsDisplay tags={session?.tags} />
          </>
        )}

        {session?.notes && session.notes.length > 0 && (
          <>
            <div className="border-t border-indigo-900/10 my-3"></div>
            <NotesDisplay notes={session?.notes} />
          </>
        )}
      </div>
    </div>
  );
};

// Read-only Session Overview Panel
export const ViewOverviewPanel = ({ session }) => {
  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-center gap-2.5 px-5 py-4 bg-[#161A2B] border border-indigo-900/40 rounded-xl mb-4 flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </div>
        <h3 className="text-white font-bold text-base">Session Overview</h3>
      </div>

      <div className="flex-1 p-5 overflow-y-auto custom-scrollbar min-h-0">
        <div className="h-full px-4 py-4 bg-[#0f0f1e]/40 border border-indigo-900/20 rounded-lg">
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {session?.description || 'No description provided for this session.'}
          </p>
        </div>
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
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-center gap-2.5 px-5 py-4 bg-[#161A2B] border border-indigo-900/40 rounded-xl mb-4 flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-white font-bold text-base">Comments</h3>
        {/* numeric comment count removed */}
      </div>
      
      {/* Comment Input */}
      <div className="px-5 py-3 border-b border-indigo-900/20 flex-shrink-0">
        {replyingTo && (
          <div className="mb-2 flex items-center gap-2 text-xs text-indigo-300 bg-indigo-500/10 px-3 py-2 rounded-lg border border-indigo-500/20">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span className="flex-1">Replying to <span className="font-semibold">@{replyingTo.userName}</span></span>
            <button
              onClick={cancelReply}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <textarea
          placeholder={replyingTo ? `Reply to @${replyingTo.userName}...` : "Add a comment..."}
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-300 text-xs resize-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
        />
        <button
          onClick={handleSubmit}
          disabled={!newComment.trim() || submitting}
          className="mt-2 w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-indigo-500/20 hover:shadow-lg hover:scale-[1.02]"
        >
          {submitting ? 'Posting...' : (replyingTo ? 'Post Reply' : 'Post Comment')}
        </button>
      </div>

      {/* Comments List - Scrollable */}
      <div className="flex-1 px-5 py-3 overflow-y-auto custom-scrollbar min-h-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-xs">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm font-medium mb-1">No comments yet</p>
            <p className="text-xs text-gray-500">Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.commentId} className="group hover:bg-white/[0.02] rounded-lg p-2.5 transition-colors">
                {/* Parent Comment */}
                <div className="flex items-start gap-2.5">
                  {comment.profilePic ? (
                    <img 
                      src={comment.profilePic} 
                      alt={comment.userName}
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0 shadow-md ring-2 ring-indigo-500/20"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
                      {getInitials(comment.userName)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-xs font-semibold">{comment.userName}</span>
                      <span className="text-gray-500 text-[10px]">{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-300 text-xs mb-2 break-words leading-relaxed">{comment.content}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleReply(comment.commentId, comment.userName, comment.userId)}
                        className="text-indigo-400 hover:text-indigo-300 text-[10px] font-medium flex items-center gap-1 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Reply
                      </button>
                      {comment.replies && comment.replies.length > 0 && (
                        <button
                          onClick={() => toggleReplies(comment.commentId)}
                          className="text-gray-400 hover:text-gray-300 text-[10px] font-medium flex items-center gap-1 transition-colors"
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

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && expandedComments.has(comment.commentId) && (
                  <div className="ml-10 mt-2 space-y-2 pl-3 border-l-2 border-indigo-900/20">
                    {comment.replies.map((reply) => (
                      <div key={reply.commentId} className="flex items-start gap-2.5 hover:bg-white/[0.02] rounded-lg p-2 transition-colors">
                        {reply.profilePic ? (
                          <img 
                            src={reply.profilePic} 
                            alt={reply.userName}
                            className="w-7 h-7 rounded-lg object-cover flex-shrink-0 shadow-md ring-2 ring-purple-500/20"
                          />
                        ) : (
                          <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-md">
                            {getInitials(reply.userName)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white text-xs font-semibold">{reply.userName}</span>
                            <span className="text-gray-500 text-[10px]">{formatTimeAgo(reply.createdAt)}</span>
                          </div>
                          <p className="text-gray-300 text-xs mb-1.5 break-words leading-relaxed">{reply.content}</p>
                          <button
                            onClick={() => handleReply(comment.commentId, reply.userName, reply.userId)}
                            className="text-indigo-400 hover:text-indigo-300 text-[10px] font-medium flex items-center gap-1 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            Reply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};