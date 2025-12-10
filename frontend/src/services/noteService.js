import api from './apiClient';

const API_BASE_URL = '/notes';

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
    const response = await api.get(`${API_BASE_URL}/me/active`);
    const data = response.data;
    const arr = Array.isArray(data) ? data : [];
    
    return arr.map(normalizeNote).sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  },

  async getNotesBySession(sessionId) {
    const response = await api.get(`${API_BASE_URL}/session/${sessionId}`);
    const data = response.data;
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
    
    const response = await api.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return normalizeNote(response.data);
  },

  async linkNoteToSession(filepath, sessionId) {
    const response = await api.post(`${API_BASE_URL}/link`, null, {
      params: {
        filepath,
        sessionId
      }
    });

    return response.data;
  },

  async getLinkedNotes(sessionId) {
    return this.getNotesBySession(sessionId);
  },

  async deleteNote(noteId) {
    await api.delete(`${API_BASE_URL}/${noteId}`);
  },

  async getNoteCount(sessionId) {
    const response = await api.get(`${API_BASE_URL}/session/${sessionId}/count`);
    return response.data.count || 0;
  }
};