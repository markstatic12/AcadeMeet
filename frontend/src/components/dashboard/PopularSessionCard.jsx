import React from 'react';
import { SlCalender } from "react-icons/sl";
import { IoTimeOutline } from "react-icons/io5";
import { GrVideo } from "react-icons/gr";
import { formatDate, formatTime } from '../../utils/dateTimeUtils';

const PopularSessionCard = ({ session }) => {
  return (
    <div className="bg-[#1e1e1e] rounded-xl p-5 flex flex-col gap-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-white truncate">
        {session.title}
      </h3>
      
      <div className="flex items-center gap-3 text-gray-400 text-sm">
        <SlCalender className="flex-shrink-0" />
        <span>{formatDate(session.month, session.day, session.year)}</span>
      </div>
      
      <div className="flex items-center gap-3 text-gray-400 text-sm">
        <IoTimeOutline className="flex-shrink-0" />
        <span>
          {formatTime(session.startTime)} - {formatTime(session.endTime)}
        </span>
      </div>
      
      <div className="flex items-center gap-3 text-gray-400 text-sm">
        <GrVideo className="flex-shrink-0" />
        <span className="truncate">{session.location}</span>
      </div>
    </div>
  );
};

export default PopularSessionCard;
