/**
 * Comment Service - handles comment and reply operations
 */
import { authFetch } from './apiHelper';

// Helper function to handle API responses
const handleResponse = async (response, errorMessage = 'Request failed') => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || errorMessage);
  }
  return await response.json();
};

export const getSessionComments = async (sessionId) => {
  const response = await authFetch(`/sessions/${sessionId}/comments`);
  const comments = await handleResponse(response, 'Failed to fetch comments');
  
  // Backend now returns comments grouped with replies as CommentDTO[]
  return comments;
};

export const createComment = async (sessionId, content) => {
  const response = await authFetch(`/sessions/${sessionId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content })
  });

  return await handleResponse(response, 'Failed to create comment');
};

export const createReply = async (sessionId, commentId, content) => {
  const response = await authFetch(
    `/sessions/${sessionId}/comments/${commentId}/replies`,
    {
      method: 'POST',
      body: JSON.stringify({ content })
    }
  );

  return await handleResponse(response, 'Failed to create reply');
};

export const deleteComment = async (sessionId, commentId) => {
  const response = await authFetch(
    `/sessions/${sessionId}/comments/${commentId}`,
    {
      method: 'DELETE'
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'Failed to delete comment');
  }
  
  // 204 No Content response has no body
  return;
};

export const getReplies = async (commentId) => {
  const response = await authFetch(`/comments/${commentId}/replies`);
  return await handleResponse(response, 'Failed to fetch replies');
};