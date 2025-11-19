import React from 'react';
import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';
import LocationInput from './LocationInput';

const DetailsPanel = ({ sessionData, onChange }) => {
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
    </div>
  );
};

export default DetailsPanel;
