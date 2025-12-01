// Comment Service  
export const getSessionComments = async (sessionId) => {
  const response = await fetch(`http://localhost:8080/api/comments/session/${sessionId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  const comments = await response.json();
  
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
  const response = await fetch('http://localhost:8080/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      userId,
      content,
      parentCommentId
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create comment');
  }

  return await response.json();
};

export const updateComment = async (commentId, content) => {
  const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update comment');
  }

  return await response.json();
};

export const deleteComment = async (commentId) => {
  const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete comment');
  }

  return await response.json();
};

export const getCommentReplies = async (parentCommentId) => {
  const response = await fetch(`http://localhost:8080/api/comments/replies/${parentCommentId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch replies');
  }

  return await response.json();
};