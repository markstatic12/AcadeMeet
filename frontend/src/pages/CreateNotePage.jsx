import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateNotePage = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [noteData, setNoteData] = useState({
    title: '',
    content: '', // persisted html
  });

  // Load user for display (optional future personalization)
  const [userName, setUserName] = useState('');
  useEffect(() => {
    try {
      const studentData = JSON.parse(localStorage.getItem('student'));
      if (studentData?.name) setUserName(studentData.name);
    } catch (_) {}
  }, []);

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
    const newNote = {
      id: Date.now(),
      title: noteData.title || 'Untitled Note',
      content: html,
      createdAt: new Date().toISOString(),
      // lifecycle flags
      isFavourite: false,
      archivedAt: null,
      deletedAt: null
    };
    try {
      const existing = JSON.parse(localStorage.getItem('notes') || '[]');
      existing.unshift(newNote);
      localStorage.setItem('notes', JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to save note', e);
    }
    navigate('/profile');
    // ensure notes tab opens
    sessionStorage.setItem('openNotesTab', 'true');
  };

  const handleBack = () => navigate(-1);

  // If we want auto-open notes tab after navigating back to profile
  // ProfilePage will check sessionStorage key.

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-96 bg-gradient-to-bl from-indigo-900/30 via-purple-900/20 to-transparent"></div>
      <style>{`
        [contentEditable=true]:empty:before { content: attr(data-placeholder); color: #6b7280; font-style: italic; }
      `}</style>
      <div className="relative z-10 p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <button onClick={handleBack} className="flex items-center gap-3 text-white hover:text-indigo-400 transition-colors group">
            <div className="w-10 h-10 bg-indigo-600/20 group-hover:bg-indigo-600/30 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </div>
            <span className="text-lg font-semibold">Back</span>
          </button>
          <div className="flex gap-3">
            <button onClick={handleSave} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/30">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Save Note
            </button>
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <input
            type="text"
            name="title"
            value={noteData.title}
            onChange={handleInputChange}
            placeholder="Untitled Note"
            className="w-full bg-transparent text-4xl font-bold text-indigo-300 placeholder-indigo-300/50 focus:outline-none focus:text-white transition-colors"
          />
        </div>

        {/* Toolbar */}
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-3 mb-4 flex items-center gap-1 flex-wrap">
          <ToolbarButton label="B" onClick={() => applyFormatting('bold')} className="font-bold" />
          <ToolbarButton label="I" onClick={() => applyFormatting('italic')} className="italic" />
          <ToolbarButton label="U" onClick={() => applyFormatting('underline')} className="underline" />
          <ToolbarButton icon={<ListIcon />} onClick={() => applyFormatting('insertUnorderedList')} />
          <ToolbarButton icon={<LinkIcon />} onClick={applyLink} />
          <ToolbarButton icon={<H1Icon />} onClick={() => applyFormatting('formatBlock','h1')} />
          <ToolbarButton icon={<H2Icon />} onClick={() => applyFormatting('formatBlock','h2')} />
          <ToolbarButton icon={<QuoteIcon />} onClick={() => applyFormatting('formatBlock','blockquote')} />
          <ToolbarButton icon={<CodeIcon />} onClick={() => applyFormatting('formatBlock','pre')} />
          <ToolbarButton icon={<ClearIcon />} onClick={() => applyFormatting('removeFormat')} />
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Start typing your notes here..."
          className="min-h-[500px] bg-[#101010] border border-gray-800 rounded-xl p-6 text-gray-300 leading-relaxed text-sm focus:outline-none focus:border-indigo-500 overflow-y-auto custom-scrollbar"
        ></div>

        {/* Footer meta (optional) */}
        {userName && (
          <p className="mt-4 text-xs text-gray-600">Author: {userName}</p>
        )}
      </div>
    </div>
  );
};

const ToolbarButton = ({ label, icon, onClick, className='' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors text-sm ${className}`}
    title={label || 'format'}
  >
    {icon || label}
  </button>
);

// Icons
const ListIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
);
const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
);
const H1Icon = () => (<span className="text-xs font-bold">H1</span>);
const H2Icon = () => (<span className="text-xs font-semibold">H2</span>);
const QuoteIcon = () => (<span className="text-xs font-serif">“”</span>);
const CodeIcon = () => (<span className="text-[10px] font-mono">{`</>`}</span>);
const ClearIcon = () => (<span className="text-[10px]">CLR</span>);

export default CreateNotePage;
