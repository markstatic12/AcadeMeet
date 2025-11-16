const API_BASE_URL = 'http://localhost:8080/api';

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
    return res.json();
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

    return res.json();
  }
};
