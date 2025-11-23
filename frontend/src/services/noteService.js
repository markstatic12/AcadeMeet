import { useUser } from '../context/UserContext';

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

  async createNote({ title, content, tagIds = [], userId, sessionIds = [] }) {
    const payload = {
      title: title || 'Untitled Note',
      type: 'RICHTEXT',
      content: content || '',
      tagIds,
      sessionIds,
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
  },

  async updateNote(noteId, { title, content, tagIds = [], sessionIds = [] }) {
    const payload = {
      title,
      content,
      tagIds,
      sessionIds,
    };

    const res = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Failed to update note');
    }

    const updated = await res.json();
    return normalizeNote(updated);
  },

  async toggleFavoriteNote(noteId, userId) {
    const res = await fetch(`${API_BASE_URL}/notes/${noteId}/favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId.toString(),
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Failed to toggle favorite');
    }

    return await res.json();
  },

  async getFavoriteNotes(userId) {
    const res = await fetch(`${API_BASE_URL}/notes/favorites?userId=${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || 'Failed to load favorite notes');
    }

    const data = await res.json();
    const arr = Array.isArray(data) ? data : [];
    return arr.map(normalizeNote).sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  },

  async deleteNote(noteId) {
    const res = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Failed to delete note');
    }

    return await res.json();
  },

  async getNotesBySession(sessionId) {
    const res = await fetch(`${API_BASE_URL}/notes/session/${sessionId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || 'Failed to load session notes');
    }

    const data = await res.json();
    const arr = Array.isArray(data) ? data : [];
    return arr.map(normalizeNote).sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }
};

// Note Creation Logic Hook
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useCreateNotePage = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const { getUserId } = useUser();

  const [noteData, setNoteData] = useState({
    title: '',
    content: '',
  });

  const [userName, setUserName] = useState('');

  // Load user for display
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetch(`http://localhost:8080/api/users/${userId}`)
        .then(res => res.json())
        .then(data => setUserName(data.name || ''))
        .catch(err => console.error('Failed to load user', err));
    }
  }, [getUserId]);

  const handleInputChange = (e) => {
    // Normalize event-like payloads: support real events and our synthetic wrapper
    const name = e?.target?.name ?? e?.name;
    const value = e?.target?.value ?? e?.value;
    // Debug log to help tracing why title might not update
    // eslint-disable-next-line no-console
    console.log('[useCreateNotePage] handleInputChange', { name, value });
    if (!name) return;
    setNoteData(prev => ({ ...prev, [name]: value }));
  };

  const applyFormatting = (command, value = null) => {
    try {
      // Toggle headings: if current block is same heading, revert to paragraph
      if (command === 'formatBlock' && (value === 'h1' || value === 'h2')) {
        const sel = window.getSelection && window.getSelection();
        const range = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
        const findBlock = (node) => {
          const blockTags = ['P','DIV','LI','H1','H2','H3','H4','H5','H6','PRE','BLOCKQUOTE'];
          let n = node;
          while (n && n !== editorRef.current) {
            if (n.nodeType === 1 && blockTags.includes(n.tagName)) return n;
            n = n.parentNode;
          }
          return editorRef.current;
        };
        const block = range ? findBlock(range.startContainer) : null;
        if (block && block.tagName === value.toUpperCase()) {
          document.execCommand('formatBlock', false, 'p');
        } else {
          document.execCommand('formatBlock', false, value);
        }
        return;
      }

      // Set font size by wrapping selection in a span with inline style
      if (command === 'setFontSize' && value) {
        try {
          const sel = window.getSelection && window.getSelection();
          if (!sel || !sel.rangeCount) return;
          const range = sel.getRangeAt(0);
          // If collapsed, insert an empty span and place caret inside
          if (range.collapsed) {
            const span = document.createElement('span');
            span.style.fontSize = value;
            // insert a zero-width space so span is selectable
            span.appendChild(document.createTextNode('\u200B'));
            range.insertNode(span);
            // move caret inside span after the zero-width space
            const newRange = document.createRange();
            newRange.setStart(span.firstChild, 1);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
            return;
          }

          // For a non-collapsed range, extract contents and wrap in span
          const contents = range.extractContents();
          const span = document.createElement('span');
          span.style.fontSize = value;
          span.appendChild(contents);
          range.insertNode(span);
          // reselect inserted content
          sel.removeAllRanges();
          const newRange = document.createRange();
          newRange.selectNodeContents(span);
          newRange.collapse(false);
          sel.addRange(newRange);
        } catch (err) {
          console.debug('[applyFormatting] setFontSize failed', err);
        }
        return;
      }

      document.execCommand(command, false, value);
    } catch (err) {
      console.debug('[applyFormatting] exec error', err);
    }
  };

  const applyLink = () => {
    // Link insertion is handled by the toolbar's modal inside NotesEditor.
    // Keep this as a no-op to avoid the browser prompt from appearing.
    return;
  };

  const handleSave = () => {
    const html = editorRef.current?.innerHTML || '';
    const userId = getUserId();
    
    noteService.createNote({ title: noteData.title, content: html, userId })
      .then((created) => {
        navigate('/profile');
      })
      .catch((err) => {
        console.error('Create note failed', err);
        // Let the UI handle failures; do not persist to localStorage. Show an alert for now.
        try { window.alert('Failed to create note. Please try again.'); } catch (_) {}
      });
  };

  const handleBack = () => navigate(-1);

  return {
    editorRef,
    noteData,
    userName,
    getUserId,
    handleInputChange,
    applyFormatting,
    applyLink,
    handleSave,
    handleBack
  };
};

// Notes Page Logic Hook
export const useNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    noteService.getAllActiveNotes()
      .then((data) => {
        if (mounted) setNotes(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (mounted) setError(e.message || 'Failed to load notes');
      })
      .finally(() => { 
        if (mounted) setLoading(false); 
      });
    
    return () => { mounted = false; };
  }, []);

  return {
    notes,
    loading,
    error
  };
};
