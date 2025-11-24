import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { noteService } from '../services/noteService';
import { useUser } from '../context/UserContext';
const API_BASE_URL = 'http://localhost:8080/api';

export const useCreateNotePage = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null); 
  const { getUserId } = useUser();

  const [noteData, setNoteData] = useState({
    title: '',
    content: '',
  });

  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetch(`${API_BASE_URL}/users/${userId}`) 
        .then(res => res.json())
        .then(data => setUserName(data.name || ''))
        .catch(err => console.error('Failed to load user', err));
    }
  }, [getUserId]);

  const handleInputChange = (e) => {
    const name = e?.target?.name ?? e?.name;
    const value = e?.target?.value ?? e?.value;
    console.log('[useCreateNotePage] handleInputChange', { name, value }); 
    if (!name) return;
    setNoteData(prev => ({ ...prev, [name]: value }));
  };
  const applyFormatting = (command, value = null) => {
    try {
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

      if (command === 'setFontSize' && value) {
        try {
          const sel = window.getSelection && window.getSelection();
          if (!sel || !sel.rangeCount) return;
          const range = sel.getRangeAt(0);
          
          if (range.collapsed) {
            const span = document.createElement('span');
            span.style.fontSize = value;
            span.appendChild(document.createTextNode('\u200B'));
            range.insertNode(span);
            
            const newRange = document.createRange();
            newRange.setStart(span.firstChild, 1);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
            return;
          }

          const contents = range.extractContents();
          const span = document.createElement('span');
          span.style.fontSize = value;
          span.appendChild(contents);
          range.insertNode(span);
          
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

  /**
   * Placeholder for link insertion logic.
   */
  const applyLink = () => {
    return;
  };

  const handleSave = () => {
    const html = editorRef.current?.innerHTML || '';
    const userId = getUserId();
    
    noteService.createNote({ title: noteData.title, content: html, userId })
      .then(() => {
        navigate('/profile'); 
      })
      .catch((err) => {
        console.error('Create note failed', err);
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