import React from 'react';
import PageHeader from '../components/common/PageHeader';
import { NoteTitleInput, EditorToolbar, AuthorFooter } from '../components/notes/NotesEditor';
import RichTextEditor from '../components/notes/NotesEditor';
import { useCreateNotePage } from '../services/NoteService';
import '../styles/createNote/CreateNotePage.css';

const CreateNotePage = () => {
  const {
    editorRef,
    noteData,
    userName,
    handleInputChange,
    applyFormatting,
    applyLink,
    handleSave,
    handleBack
  } = useCreateNotePage();

  return (
    <div className="min-h-screen relative overflow-hidden acm-create-note-page">
      {/* background shapes handled by CSS - decorative only */}
      <div className="acm-bg-shapes" aria-hidden="true" />

      <div className="page-content relative z-10 p-8 max-w-6xl mx-auto animate-fadeIn">
        <PageHeader 
          onBack={handleBack} 
          onSave={handleSave} 
          showSave={true}
          saveText="Save Note"
        />
        
        <NoteTitleInput value={noteData.title} onChange={handleInputChange} />
        
  <EditorToolbar onFormat={applyFormatting} onLink={applyLink} editorRef={editorRef} />
        
  <RichTextEditor editorRef={editorRef} />
        
        <AuthorFooter userName={userName} />
      </div>
    </div>
  );
};

export default CreateNotePage;
