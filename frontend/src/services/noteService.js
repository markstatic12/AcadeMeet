import { authFetch, authFetchMultipart } from './apiHelper';

const API_BASE_URL = '/notes';

const handleResponse = async (response, errorMessage = 'Request failed') => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || errorMessage);
  }
  return await response.json();
};

function normalizeNote(n) {
  return {
    noteId: n.noteId || n.id || null,
    id: n.noteId || n.id || null,
    title: n.title || 'Untitled Note',
    filepath: n.filepath || null,
    filePath: n.filepath || null,
    linkedAt: n.linkedAt || null,
    createdAt: n.linkedAt || null,
    sessionId: n.sessionId || null,
    sessionTitle: n.sessionTitle || null,
    tags: n.tags || [],
    type: 'FILE',
    raw: n,
  };
}

export const noteService = {
  async getMyNotes() {
    const response = await authFetch(`${API_BASE_URL}/me/active`, {
      method: 'GET',
    });
    
    const data = await handleResponse(response, 'Failed to load notes');
    const arr = Array.isArray(data) ? data : [];
    
    return arr.map(normalizeNote).sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  },

  async getNotesBySession(sessionId) {
    const response = await authFetch(`${API_BASE_URL}/session/${sessionId}`, {
      method: 'GET',
    });

    const data = await handleResponse(response, 'Failed to load session notes');
    const arr = Array.isArray(data) ? data : [];
    
    return arr.map(normalizeNote).sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  },

  async uploadFileNote(file, options = {}) {
    if (!file) {
      throw new Error('File is required');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', options.title || file.name);
    
    if (options.sessionId) {
      formData.append('sessionId', options.sessionId);
    }
    
    const response = await authFetchMultipart(`${API_BASE_URL}/upload`, formData);

    const data = await handleResponse(response, 'Failed to upload file');
    return normalizeNote(data);
  },

  async linkNoteToSession(filepath, sessionId) {
    const params = new URLSearchParams();
    params.append('filepath', filepath);
    params.append('sessionId', sessionId);

    const response = await authFetch(`${API_BASE_URL}/link?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    const data = await handleResponse(response, 'Failed to link note to session');
    return data;
  },

  async getLinkedNotes(sessionId) {
    return this.getNotesBySession(sessionId);
  },

  async deleteNote(noteId) {
    const response = await authFetch(`${API_BASE_URL}/${noteId}`, {
      method: 'DELETE',
    });
    
    await handleResponse(response, 'Failed to delete note');
  },

  async getNoteCount(sessionId) {
    const response = await authFetch(`${API_BASE_URL}/session/${sessionId}/count`, {
      method: 'GET',
    });

    const data = await handleResponse(response, 'Failed to get note count');
    return data.count || 0;
  }
};