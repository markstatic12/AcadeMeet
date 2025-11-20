import React from 'react';
import { CalendarIcon, ClockIcon, LocationIcon } from '../../icons';
import { to12Hour } from '../../utils/timeUtils';

const TrashedSessionCard = ({ session, daysLeft, onRestore }) => {
  return (
    <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden">
      {/* Vertical Restore action */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
        <button
          onClick={() => onRestore(session.id)}
          className="px-2 py-1 text-xs rounded-lg bg-green-600/20 text-green-300 border border-green-500/40 hover:bg-green-600/30"
        >
          Restore
        </button>
      </div>
      <div className="relative h-[120px] bg-gradient-to-br from-[#0f172a] via-[#1f2937] to-[#111827]">
        <span className="absolute top-2 left-2 text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded-full border border-red-500/30">
          {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
        </span>
      </div>
      
      <div className="p-3 bg-[#0a0a0a]">
        <h3 className="text-white font-bold text-sm mb-2 opacity-70 line-through">{session.title}</h3>
        <div className="space-y-1 text-gray-500 text-[11px]">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="w-3 h-3 text-indigo-400" />
            <span>{session.month} {session.day}, {session.year}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ClockIcon className="w-3 h-3 text-indigo-400" />
            <span>{to12Hour(session.startTime)} - {to12Hour(session.endTime)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <LocationIcon className="w-3 h-3 text-indigo-400" />
            <span>{session.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrashedSessionCard;
