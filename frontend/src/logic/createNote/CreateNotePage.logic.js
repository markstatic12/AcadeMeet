import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { noteService } from '../../services/noteService';

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
    const { name, value } = e.target;
    setNoteData(prev => ({ ...prev, [name]: value }));
  };

  const applyFormatting = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const applyLink = () => {
    const url = prompt('Enter URL:');
    if (url) document.execCommand('createLink', false, url);
  };

  const handleSave = () => {
    const html = editorRef.current?.innerHTML || '';
    const userId = getUserId();
    
    noteService.createNote({ title: noteData.title, content: html, userId })
      .then((created) => {
        navigate('/profile');
      })
      .catch((err) => {
        console.error('Create note failed, falling back to localStorage', err);
        const newNote = {
          id: Date.now(),
          title: noteData.title || 'Untitled Note',
          content: html,
          createdAt: new Date().toISOString(),
        };
        try {
          const existing = JSON.parse(localStorage.getItem('notes') || '[]');
          existing.unshift(newNote);
          localStorage.setItem('notes', JSON.stringify(existing));
        } catch (e) {
          console.error('Failed to save note locally', e);
        }
        navigate('/profile');
      });
  };

  const handleBack = () => navigate(-1);

  return {
    editorRef,
    noteData,
    userName,
    handleInputChange,
    applyFormatting,
    applyLink,
    handleSave,
    handleBack
  };
};
