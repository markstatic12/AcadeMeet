import React from 'react';
import CategoryBadge from './CategoryBadge';

const NoteCard = ({ title, categories }) => {
  return (
    <div className="bg-[#1f1f1f] rounded-xl p-6 hover:bg-[#2a2a2a] transition-all duration-300 cursor-pointer group h-[200px] flex flex-col">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3 overflow-hidden max-h-[48px]">
            {Array.isArray(categories) ? (
              categories.map((category, index) => (
                <CategoryBadge key={index} category={category} />
              ))
            ) : (
              <CategoryBadge category={categories} />
            )}
          </div>
          <div className="flex items-start gap-3">
            <h3 className="text-lg font-semibold text-white line-clamp-3 overflow-hidden">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
