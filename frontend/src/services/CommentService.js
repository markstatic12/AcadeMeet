import api from './apiClient';

export const getSessionComments = async (sessionId) => {
  const response = await api.get(`/sessions/${sessionId}/comments`);
  return response.data;
};

export const createComment = async (sessionId, content) => {
  const response = await api.post(`/sessions/${sessionId}/comments`, { content });
  return response.data;
};

export const createReply = async (sessionId, commentId, content) => {
  const response = await api.post(
    `/sessions/${sessionId}/comments/${commentId}/replies`,
    { content }
  );

  return response.data;
};

export const deleteComment = async (sessionId, commentId) => {
  await api.delete(`/sessions/${sessionId}/comments/${commentId}`);
  return;
};

export const getReplies = async (commentId) => {
  const response = await api.get(`/comments/${commentId}/replies`);
  return response.data;
};