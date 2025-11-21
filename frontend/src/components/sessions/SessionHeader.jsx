import React from 'react';
import SessionProfilePic from './SessionProfilePic';
import SessionTitleInput from './SessionTitleInput';

const SessionHeader = ({ title, onChange }) => {
  return (
    <div className="flex items-center gap-6 mb-12">
      <SessionProfilePic />
      <SessionTitleInput value={title} onChange={onChange} />
    </div>
  );
};

export default SessionHeader;
