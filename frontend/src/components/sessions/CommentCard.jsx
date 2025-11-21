import React, { useState } from 'react';
import { updateComment, deleteComment } from '../../services/CommentService';
import CommentInput from './CommentInput';
import { formatDistance } from 'date-fns';

const CommentCard = ({ comment, onReply, onUpdate, onDelete, currentUser, isReply = false }) => {
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

export default CommentCard;