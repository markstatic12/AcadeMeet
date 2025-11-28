// Comment Service
import { buildApiUrl, buildHeaders, handleApiResponse, API_CONFIG } from '../config/api';

/**
 * Retrieves all comments for a specific session, organized in thread structure
 * @param {string|number} sessionId - The session identifier
 * @returns {Promise<Array>} Top-level comments with nested replies
 */
export const getSessionComments = async (sessionId) => {
  const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.COMMENTS}/session/${sessionId}`));
  
  const comments = await handleApiResponse(response, 'Failed to fetch comments');
  
  // Organize comments into thread structure (top-level comments with nested replies)
  const topLevelComments = comments.filter(comment => !comment.parentCommentId);
  const replies = comments.filter(comment => comment.parentCommentId);

  // Attach replies to their parent comments
  topLevelComments.forEach(comment => {
    comment.replies = replies.filter(reply => reply.parentCommentId === comment.id);
  });

  return topLevelComments;
};

export const createComment = async (sessionId, userId, content, parentCommentId = null) => {
  const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.COMMENTS), {
    method: 'POST',
    headers: buildHeaders(userId),
    body: JSON.stringify({
      sessionId,
      userId,
      content,
      parentCommentId
    })
  });

  return await handleApiResponse(response, 'Failed to create comment');
};

export const updateComment = async (commentId, content) => {
  const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.COMMENTS}/${commentId}`), {
    method: 'PATCH',
    headers: buildHeaders(),
    body: JSON.stringify({ content })
  });

  return await handleApiResponse(response, 'Failed to update comment');
};

/**
 * Deletes a comment
 * @param {string|number} commentId - The comment identifier
 * @returns {Promise<object>} Deletion confirmation
 */
export const deleteComment = async (commentId) => {
  const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.COMMENTS}/${commentId}`), {
    method: 'DELETE'
  });

  return await handleApiResponse(response, 'Failed to delete comment');
};

/**
 * Retrieves replies for a specific comment
 * @param {string|number} parentCommentId - The parent comment identifier
 * @returns {Promise<Array>} Array of reply comments
 */
export const getCommentReplies = async (parentCommentId) => {
  const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.COMMENTS}/replies/${parentCommentId}`));
  
  return await handleApiResponse(response, 'Failed to fetch replies');
};