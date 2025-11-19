import React from 'react';
import { getCategoryColor } from '../../utils/categoryUtils';

const CategoryBadge = ({ category }) => {
  const colors = getCategoryColor(category);
  
  return (
    <span
      className="px-3 py-1 text-xs rounded-full bg-opacity-20 whitespace-nowrap"
      style={{
        backgroundColor: colors.bg,
        color: colors.text
      }}
    >
      {category}
    </span>
  );
};

export default CategoryBadge;
