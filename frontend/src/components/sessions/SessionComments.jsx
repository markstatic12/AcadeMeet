import React, { useState, useEffect } from 'react';
import { getSessionComments, createComment } from '../../services/CommentService';
import { useUser } from '../../context/UserContext';
import { formatDistance } from 'date-fns';


// ===== COMMENT INPUT =====

export const CommentInput = ({ 
  onSubmit, 
  placeholder = "Write a comment...", 
  disabled = false 
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          {content.length}/500 characters
        </div>
        
        <button
          type="submit"
          disabled={disabled || !content.trim() || isSubmitting || content.length > 500}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
};

// ===== COMMENT CARD =====

export const CommentCard = ({ comment }) => {
  const formatTime = (timestamp) => {
    try {
      return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {/* Comment Header */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {comment.userName?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div>
          <p className="text-white font-medium">
            {comment.userName || 'Unknown User'}
          </p>
          <p className="text-gray-400 text-sm">
            {formatTime(comment.createdAt)}
          </p>
        </div>
      </div>

      {/* Comment Content */}
      <div className="text-gray-300 whitespace-pre-wrap">
        {comment.content}
      </div>
    </div>
  );
};

// ===== COMMENT PANEL =====

export const CommentPanel = ({ sessionId, className = '' }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (sessionId) {
      loadComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const commentsData = await getSessionComments(sessionId);
      setComments(commentsData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (content) => {
    if (!user) {
      setError('You must be logged in to comment');
      return;
    }

    try {
      const newComment = await createComment(sessionId, content);
      setComments(prev => [newComment, ...prev]);
    } catch (err) {
      setError(err.message);
      console.error('Failed to add comment:', err);
    }
  };

  if (loading) {
    return (
      <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          Comments ({comments.length})
        </h3>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <CommentInput
          onSubmit={handleAddComment}
          placeholder="Share your thoughts about this session..."
          disabled={!user}
        />
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map(comment => (
            <CommentCard
              key={comment.commentId}
              comment={comment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentPanel;
