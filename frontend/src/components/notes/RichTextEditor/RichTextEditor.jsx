import React from 'react';

const RichTextEditor = ({ editorRef }) => {
  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      data-placeholder="Start typing your notes here..."
      className="min-h-[500px] bg-[#101010] border border-gray-800 rounded-xl p-6 text-gray-300 leading-relaxed text-sm focus:outline-none focus:border-indigo-500 overflow-y-auto custom-scrollbar"
    />
  );
};

export default RichTextEditor;
