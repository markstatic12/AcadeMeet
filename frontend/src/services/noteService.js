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
  async getActiveNotes() {
    const res = await fetch(`${API_BASE_URL}/notes/active`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || 'Failed to load notes');
    }
    const data = await res.json();
    const arr = Array.isArray(data) ? data : [];
    return arr.map(normalizeNote).sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  },

  async createNote({ title, content, tagIds = [] }) {
    const payload = {
      title: title || 'Untitled Note',
      type: 'RICHTEXT',
      content: content || '',
      tagIds,
    };

    const res = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
