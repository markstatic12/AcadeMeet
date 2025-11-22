import React, { useState, useEffect } from 'react';
import { getSessionComments, createComment } from '../../services/CommentService';
import { useUser } from '../../context/UserContext';
import { formatDistance } from 'date-fns';
import { updateComment, deleteComment } from '../../services/CommentService';


// ===== COMMENT INPUT =====

export const CommentInput = ({ 
  onSubmit, 
  onCancel, 
  placeholder = "Write a comment...", 
  initialValue = "",
  submitText = "Comment",
  disabled = false 
}) => {
  const [content, setContent] = useState(initialValue);
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

  const handleCancel = () => {
    setContent(initialValue);
    if (onCancel) {
      onCancel();
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
        
        <div className="flex items-center space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={disabled || !content.trim() || isSubmitting || content.length > 500}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : submitText}
          </button>
        </div>
      </div>
    </form>
  );
};

// ===== COMMENT CARD =====

export const CommentCard = ({ comment, onReply, onUpdate, onDelete, currentUser, isReply = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const canEdit = currentUser && currentUser.id === comment.userId;
  const canDelete = currentUser && (currentUser.id === comment.userId || currentUser.role === 'ADMIN');

  const handleEdit = async (newContent) => {
    try {
      const updatedComment = await updateComment(comment.id, newContent);
      onUpdate(comment.id, updatedComment);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update comment:', err);
      alert('Failed to update comment. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteComment(comment.id);
      onDelete(comment.id);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleReply = async (content) => {
    try {
      await onReply(comment.id, content);
      setIsReplying(false);
    } catch (err) {
      console.error('Failed to add reply:', err);
      alert('Failed to add reply. Please try again.');
    }
  };

  const formatTime = (timestamp) => {
    try {
      return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <div className={`${isReply ? 'ml-8 border-l-2 border-gray-700 pl-4' : ''}`}>
      <div className="bg-gray-800 rounded-lg p-4">
        {/* Comment Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
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
                {comment.isEdited && (
                  <span className="ml-2 text-gray-500">(edited)</span>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-white text-sm"
              >
                Edit
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-400 text-sm"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Comment Content */}
        {isEditing ? (
          <div className="mb-3">
            <CommentInput
              initialValue={comment.content}
              onSubmit={handleEdit}
              onCancel={() => setIsEditing(false)}
              placeholder="Edit your comment..."
              submitText="Update"
            />
          </div>
        ) : (
          <div className="mb-3">
            <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
          </div>
        )}

        {/* Reply Button */}
        {!isReply && currentUser && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-gray-400 hover:text-white text-sm flex items-center space-x-1"
            >
              <span>Reply</span>
            </button>
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-gray-400 hover:text-white text-sm flex items-center space-x-1"
              >
                <span>
                  {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </span>
              </button>
            )}
          </div>
        )}

        {/* Reply Input */}
        {isReplying && (
          <div className="mt-4">
            <CommentInput
              onSubmit={handleReply}
              onCancel={() => setIsReplying(false)}
              placeholder="Write a reply..."
              submitText="Reply"
            />
          </div>
        )}
      </div>

      {/* Replies */}
      {!isReply && comment.replies && comment.replies.length > 0 && showReplies && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onUpdate={onUpdate}
              onDelete={onDelete}
              currentUser={currentUser}
              isReply={true}
            />
          ))}
        </div>
      )}
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
      const newComment = await createComment(sessionId, user.id, content);
      setComments(prev => [newComment, ...prev]);
    } catch (err) {
      setError(err.message);
      console.error('Failed to add comment:', err);
    }
  };

  const handleAddReply = async (parentCommentId, content) => {
    if (!user) {
      setError('You must be logged in to reply');
      return;
    }

    try {
      const newReply = await createComment(sessionId, user.id, content, parentCommentId);
      setComments(prev => prev.map(comment => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      }));
    } catch (err) {
      setError(err.message);
      console.error('Failed to add reply:', err);
    }
  };

  const handleUpdateComment = (commentId, updatedComment) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, ...updatedComment };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply =>
            reply.id === commentId ? { ...reply, ...updatedComment } : reply
          )
        };
      }
      return comment;
    }));
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => {
      if (comment.id === commentId) {
        return false;
      }
      if (comment.replies) {
        comment.replies = comment.replies.filter(reply => reply.id !== commentId);
      }
      return true;
    }));
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
          Discussion ({comments.length})
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
              key={comment.id}
              comment={comment}
              onReply={handleAddReply}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
              currentUser={user}
            />
          ))
        )}
      </div>
    </div>
  );
};


export default CommentPanel;
