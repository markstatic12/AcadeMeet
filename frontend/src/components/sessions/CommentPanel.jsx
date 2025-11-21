import React, { useState, useEffect } from 'react';
import { getSessionComments, createComment } from '../../services/CommentService';
import CommentCard from './CommentCard';
import CommentInput from './CommentInput';
import { useUser } from '../../context/UserContext';

const CommentPanel = ({ sessionId, className = '' }) => {
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