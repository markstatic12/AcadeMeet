// noteService.js - handles all note-related HTTP requests
import { authFetch, authFetchMultipart } from './apiHelper';

const API_BASE_URL = '/notes';

// Helper function to build headers with optional user ID
const buildHeaders = (userId) => {
  const headers = {};
  if (userId) {
    headers['X-User-Id'] = userId.toString();
  }
  return headers;
};

// Helper function to handle API responses
const handleResponse = async (response, errorMessage = 'Request failed') => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || errorMessage);
  }
  return await response.json();
};

/**
 * Utility function to infer the note owner's name from various backend response shapes.
 * @param {object} n - The raw note object.
 * @returns {string|null} The owner's name or a fallback ID string.
 */
function pickOwnerName(n) {
  if (!n) return null;
  // Try embedded owner object
  if (n.owner) {
    return n.owner.fullName || n.owner.name || n.owner.email || null;
  }
  // Try direct owner name properties
  if (n.ownerName) return n.ownerName;
  if (n.owner_full_name) return n.owner_full_name;
  
  // Try owner ID fallback
  const id = n.ownerId || n.owner_id || n.owner_user_id || n.ownerUserId;
  return id ? `User ${id}` : null;
}

/**
 * Normalizes a raw note object from the backend into a consistent client-side format.
 * Handles both SessionNote responses and general note responses.
 * @param {object} n - The raw note object.
 * @returns {object} The normalized note object.
 */
function normalizeNote(n) {
  const created = n.createdAt || n.created_at || n.createdDate || n.linkedAt || null;
  
  return {
    // Core SessionNote fields
    noteId: n.noteId || n.id || n.note_id || null,
    id: n.noteId || n.id || n.note_id || null,  // Alias for compatibility
    title: n.title || 'Untitled Note',
    filepath: n.filepath || n.filePath || null,    // SessionNote.filepath
    filePath: n.filepath || n.filePath || null,    // Alias for compatibility
    
    // Metadata
    linkedAt: n.linkedAt || null,                  // SessionNote.linkedAt
    createdAt: created ? new Date(created).toISOString() : null,
    createdBy: pickOwnerName(n),
    
    // Session relationship (if present)
    sessionId: n.sessionId || null,
    sessionTitle: n.sessionTitle || null,
    
    // Content (for non-file notes)
    content: n.content || n.richText || '',
    
    // Tags and categorization
    tags: n.tags || n.note_tags || [],
    type: 'FILE',  // All notes are file uploads (SessionNote model)
    
    // Frontend-only features
    isFavourite: false,
    isArchived: false,
    
    raw: n,
  };
}

/**
 * Service object for all Note-related API interactions.
 */
export const noteService = {
  /**
   * Fetches all active notes across all users (for public notes page).
   * @returns {Promise<Array<object>>} A promise that resolves to an array of normalized notes.
   */
  async getAllActiveNotes() {
    const response = await authFetch(`${API_BASE_URL}/all/active`, {
      method: 'GET',
      headers: buildHeaders(),
    });
    
    const data = await handleResponse(response, 'Failed to load all active notes');
    const arr = Array.isArray(data) ? data : [];
    
    // Normalize and sort by creation date (newest first)
    return arr.map(normalizeNote).sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  },

  /**
   * Alias for getAllActiveNotes for backward compatibility.
   */
  async getActiveNotes() {
    return this.getAllActiveNotes();
  },

  /**
   * Fetches active notes for a specific user (for profile page).
   * Requires a valid userId - will throw error if not provided.
   * @param {string|number} userId - The ID of the user.
   * @returns {Promise<Array<object>>} A promise that resolves to an array of normalized notes.
   */
  async getUserActiveNotes(userId) {
    if (!userId) {
      throw new Error('User ID is required to fetch user notes');
    }

    const response = await authFetch(`${API_BASE_URL}/user/${userId}/active`, {
      method: 'GET',
      headers: buildHeaders(userId),
    });
    
    const data = await handleResponse(response, 'Failed to load user notes');
    const arr = Array.isArray(data) ? data : [];
    
    // Normalize and sort by creation date (newest first)
    return arr.map(normalizeNote).sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  },

  /**
   * Creates a new note.
   * DEPRECATED: Manual note creation has been removed. Notes are now only created
   * via drag-and-drop file upload or associated with sessions.
   * @deprecated
   */
  /*
  async createNote({ title, content, tagIds = [], sessionIds = [] }) {
    const payload = {
      title: title || 'Untitled Note',
      type: 'RICHTEXT',
      content: content || '',
      tagIds,
      sessionIds,
    };

    const response = await authFetch(API_BASE_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const created = await handleResponse(response, 'Failed to create note');
    return normalizeNote(created);
  },
  */

  /**
   * Updates an existing note.
   * @param {number} noteId - The ID of the note to update.
   * @param {object} params - Update parameters.
   * @returns {Promise<object>} The updated note.
   */
  async updateNote(noteId, { title, content, tagIds = [], sessionIds = [], userId }) {
    const payload = { title, content, tagIds, sessionIds };

    const response = await authFetch(`${API_BASE_URL}/${noteId}`, {
      method: 'PUT',
      headers: buildHeaders(userId),
      body: JSON.stringify(payload),
    });

    const updated = await handleResponse(response, 'Failed to update note');
    return normalizeNote(updated);
  },

  /**
   * Deletes (trashes) a note.
   * @param {number} noteId - The ID of the note to delete.
   * @param {number} userId - The ID of the user.
   */
  async deleteNote(noteId, userId) {
    if (!userId) {
      throw new Error('User ID is required to delete a note');
    }

    const response = await authFetch(`${API_BASE_URL}/${noteId}`, {
      method: 'DELETE',
      headers: buildHeaders(userId),
    });

    return handleResponse(response, 'Failed to delete note');
  },

  /**
   * Archives a note.
   * @param {number} noteId - The ID of the note to archive.
   * @param {number} userId - The ID of the user.
   */
  async archiveNote(noteId, userId) {
    if (!userId) {
      throw new Error('User ID is required to archive a note');
    }

    const response = await authFetch(`${API_BASE_URL}/${noteId}/archive`, {
      method: 'PUT',
      headers: buildHeaders(userId),
    });

    return handleResponse(response, 'Failed to archive note');
  },

  /**
   * Unarchives a note.
   * @param {number} noteId - The ID of the note to unarchive.
   * @param {number} userId - The ID of the user.
   */
  async unarchiveNote(noteId, userId) {
    if (!userId) {
      throw new Error('User ID is required to unarchive a note');
    }

    const response = await authFetch(`${API_BASE_URL}/${noteId}/unarchive`, {
      method: 'PUT',
      headers: buildHeaders(userId),
    });

    return handleResponse(response, 'Failed to unarchive note');
  },

  /**
   * Saves (favorites) a note.
   * @param {number} noteId - The ID of the note to save.
   * @param {number} userId - The ID of the user.
   */
  async saveNote(noteId, userId) {
    if (!userId) {
      throw new Error('User ID is required to save a note');
    }

    const response = await authFetch(`${API_BASE_URL}/${noteId}/save`, {
      method: 'POST',
      headers: buildHeaders(userId),
    });

    return handleResponse(response, 'Failed to save note');
  },

  /**
   * Unsaves (unfavorites) a note.
   * @param {number} noteId - The ID of the note to unsave.
   * @param {number} userId - The ID of the user.
   */
  async unsaveNote(noteId, userId) {
    if (!userId) {
      throw new Error('User ID is required to unsave a note');
    }

    const response = await authFetch(`${API_BASE_URL}/${noteId}/unsave`, {
      method: 'DELETE',
      headers: buildHeaders(userId),
    });

    return handleResponse(response, 'Failed to unsave note');
  },

  /**
   * Fetches saved (favorited) notes for a specific user.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Array<object>>} Array of saved notes.
   */
  async getSavedNotes(userId) {
    if (!userId) {
      throw new Error('User ID is required to fetch saved notes');
    }

    const response = await authFetch(`${API_BASE_URL}/saved`, {
      method: 'GET',
      headers: buildHeaders(userId),
    });

    const data = await handleResponse(response, 'Failed to load saved notes');
    const arr = Array.isArray(data) ? data : [];
    
    return arr.map(normalizeNote).sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  },

  /**
   * Fetches notes associated with a specific session.
   * @param {number} sessionId - The ID of the session.
   * @returns {Promise<Array<object>>} Array of notes.
   */
  async getNotesBySession(sessionId) {
    const response = await authFetch(`${API_BASE_URL}/session/${sessionId}`, {
      method: 'GET',
      headers: buildHeaders(),
    });

    const data = await handleResponse(response, 'Failed to load session notes');
    const arr = Array.isArray(data) ? data : [];
    
    return arr.map(normalizeNote).sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  },

  /**
   * Uploads a file and creates a FILE type note.
   * @param {File} file - The file to upload.
   * @param {object} options - Additional options (title, tagIds, sessionId).
   * @returns {Promise<object>} The created note.
   */
  async uploadFileNote(file, options = {}) {
    if (!file) {
      throw new Error('File is required');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', options.title || file.name);
    
    if (options.tagIds && Array.isArray(options.tagIds)) {
      options.tagIds.forEach(tagId => formData.append('tagIds', tagId));
    }
    
    if (options.sessionId) {
      formData.append('sessionId', options.sessionId);
    }
    
    const response = await authFetchMultipart(`${API_BASE_URL}/upload`, formData);

    const data = await handleResponse(response, 'Failed to upload file');
    return normalizeNote(data);
  }
};