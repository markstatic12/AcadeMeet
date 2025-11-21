import React, { useState, useEffect } from 'react';

const RichTextEditor = ({ editorRef, initialContent = '', onContentChange, onSessionLink }) => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (editorRef.current && initialContent !== content) {
      editorRef.current.innerHTML = initialContent;
      setContent(initialContent);
    }
  }, [initialContent, content, editorRef]);

  const handleInput = (e) => {
    const newContent = e.target.innerHTML;
    setContent(newContent);
    if (onContentChange) {
      onContentChange(newContent);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleKeyDown = (e) => {
    // Handle session linking with @ symbol
    if (e.key === '@') {
      // Trigger session linking functionality
      if (onSessionLink) {
        onSessionLink();
      }
    }

    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="relative">
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Start typing your notes here... Use @ to link to sessions"
        className="min-h-[500px] bg-[#101010] border border-gray-800 rounded-xl p-6 text-gray-300 leading-relaxed text-sm focus:outline-none focus:border-indigo-500 overflow-y-auto custom-scrollbar"
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        style={{
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap'
        }}
      />
      
      {/* Floating word count */}
      <div className="absolute bottom-4 right-4 bg-gray-800 px-3 py-1 rounded text-xs text-gray-400">
        {content.replace(/<[^>]*>/g, '').length} characters
      </div>
    </div>
  );
};

export default RichTextEditor;
