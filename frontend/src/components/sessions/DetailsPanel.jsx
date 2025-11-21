import React from 'react';
import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';
import LocationInput from './LocationInput';
import SessionPrivacySelector from './SessionPrivacySelector';

const DetailsPanel = ({ sessionData, onChange, onPasswordChange, onParticipantsChange }) => {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6">
      <h3 className="text-white font-bold text-xl mb-6">Details</h3>

      <DateSelector
        month={sessionData.month}
        day={sessionData.day}
        year={sessionData.year}
        onChange={onChange}
      />

      <TimeSelector
        startTime={sessionData.startTime}
        endTime={sessionData.endTime}
        onChange={onChange}
      />

      <LocationInput
        value={sessionData.location}
        onChange={onChange}
      />

      <SessionPrivacySelector
        sessionType={sessionData.sessionType}
        password={sessionData.password}
        maxParticipants={sessionData.maxParticipants}
        onChange={onChange}
        onPasswordChange={onPasswordChange}
        onParticipantsChange={onParticipantsChange}
      />
    </div>
  );
};

export default DetailsPanel;
