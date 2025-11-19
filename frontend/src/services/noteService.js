const API_BASE_URL = 'http://localhost:8080/api';

function pickOwnerName(n) {
  // Try common shapes returned by the backend
  if (!n) return null;
  if (n.owner) {
    return n.owner.fullName || n.owner.name || n.owner.email || null;
  }
  if (n.ownerName) return n.ownerName;
  if (n.owner_full_name) return n.owner_full_name;
  // try id fallback
  const id = n.ownerId || n.owner_id || n.owner_user_id || n.ownerUserId;
  return id ? `User ${id}` : null;
}

function normalizeNote(n) {
  const created = n.createdAt || n.created_at || n.createdDate || null;
  return {
    noteId: n.noteId || n.id || n.note_id || null,
    title: n.title || 'Untitled Note',
    content: n.content || n.richText || '',
    tags: n.tags || n.note_tags || [],
    createdAt: created ? new Date(created).toISOString() : null,
    createdBy: pickOwnerName(n),
    raw: n,
  };
}

export const noteService = {
  async getAllActiveNotes() {
    // Get all active notes from all users (for public notes page)
    const res = await fetch(`${API_BASE_URL}/notes/all/active`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || 'Failed to load notes');
    }
    const data = await res.json();
    console.log('Fetched all active notes:', data);
    const arr = Array.isArray(data) ? data : [];
    const normalized = arr.map(normalizeNote).sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    console.log('Normalized all active notes:', normalized);
    return normalized;
  },

  async getActiveNotes() {
    // Alias for getAllActiveNotes for backward compatibility
    return this.getAllActiveNotes();
  },

  async getUserActiveNotes(userId) {
    // Get active notes for a specific user (for profile page)
    console.log('Fetching notes for user:', userId);
    const res = await fetch(`${API_BASE_URL}/notes/user/${userId}/active`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || 'Failed to load notes');
    }
    const data = await res.json();
    console.log('Fetched user notes for user', userId, ':', data);
    const arr = Array.isArray(data) ? data : [];
    const normalized = arr.map(normalizeNote).sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    console.log('Normalized user notes for user', userId, ':', normalized);
    return normalized;
  },

  async createNote({ title, content, tagIds = [], userId }) {
    const payload = {
      title: title || 'Untitled Note',
      type: 'RICHTEXT',
      content: content || '',
      tagIds,
    };

    const headers = { 'Content-Type': 'application/json' };
    if (userId) {
      headers['X-User-Id'] = userId.toString();
    }

    const res = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Failed to create note');
    }

    const created = await res.json();
    return normalizeNote(created);
  }
};
