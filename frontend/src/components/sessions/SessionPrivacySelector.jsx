import React from 'react';

const SessionPrivacySelector = ({ sessionType, password, maxParticipants, onChange, onPasswordChange, onParticipantsChange }) => {
  return (
    <div className="mb-6">
      <h4 className="text-white font-semibold mb-3">Session Privacy</h4>
      
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sessionType"
            value="PUBLIC"
            checked={sessionType === 'PUBLIC'}
            onChange={onChange}
            className="accent-indigo-500"
          />
          <span className="text-gray-300">Public</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sessionType"
            value="PRIVATE"
            checked={sessionType === 'PRIVATE'}
            onChange={onChange}
            className="accent-indigo-500"
          />
          <span className="text-gray-300">Private</span>
        </label>
      </div>

      {sessionType === 'PRIVATE' && (
        <div className="mb-4">
          <input
            type="password"
            name="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="Enter session password (min 6 characters)"
            className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            minLength={6}
            required
          />
        </div>
      )}

      <div>
        <label className="block text-gray-300 text-sm mb-2">
          Maximum Participants (optional)
        </label>
        <input
          type="number"
          name="maxParticipants"
          value={maxParticipants}
          onChange={onParticipantsChange}
          placeholder="Enter max participants"
          min="1"
          max="100"
          className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>
    </div>
  );
};

export default SessionPrivacySelector;