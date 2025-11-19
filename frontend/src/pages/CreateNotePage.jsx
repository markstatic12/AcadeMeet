import React from 'react';
import PageHeader from '../components/createNote/PageHeader';
import NoteTitleInput from '../components/createNote/NoteTitleInput';
import EditorToolbar from '../components/createNote/EditorToolbar';
import RichTextEditor from '../components/createNote/RichTextEditor';
import AuthorFooter from '../components/createNote/AuthorFooter';
import { useCreateNotePage } from '../logic/createNote/CreateNotePage.logic';
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
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-96 bg-gradient-to-bl from-indigo-900/30 via-purple-900/20 to-transparent"></div>
      
      <div className="relative z-10 p-8 max-w-6xl mx-auto animate-fadeIn">
        <PageHeader onBack={handleBack} onSave={handleSave} />
        
        <NoteTitleInput value={noteData.title} onChange={handleInputChange} />
        
        <EditorToolbar onFormat={applyFormatting} onLink={applyLink} />
        
        <RichTextEditor editorRef={editorRef} />
        
        <AuthorFooter userName={userName} />
      </div>
    </div>
  );
};

export default CreateNotePage;
