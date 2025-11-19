import React from 'react';

const PopularSessionCard = ({ session }) => {
  return (
    <div
      className={`bg-gradient-to-br ${session.color} rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform duration-300 shadow-xl`}
    >
      <div className="text-4xl mb-3">{session.icon}</div>
      <h3 className="text-white text-xl font-bold mb-2">{session.title}</h3>
      <p className="text-white/80 text-sm">{session.subtitle}</p>
    </div>
  );
};

export default PopularSessionCard;
