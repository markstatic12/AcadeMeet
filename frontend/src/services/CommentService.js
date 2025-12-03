/**
 * Comment Service - handles basic comment operations (create and get only)
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
  
  // Return only top-level comments (no replies/threading)
  return comments.filter(comment => !comment.parentCommentId);
};

export const createComment = async (sessionId, content) => {
  const response = await authFetch(`/sessions/${sessionId}/comments`, {
    method: 'POST',
    body: JSON.stringify({
      content
    })
  });

  return await handleResponse(response, 'Failed to create comment');
};