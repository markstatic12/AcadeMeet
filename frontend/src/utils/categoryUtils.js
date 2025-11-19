export const getCategoryColor = (category) => {
  const colors = {
    'Springboot': { bg: 'rgba(76, 175, 80, 0.2)', text: '#4CAF50' },
    'Excel': { bg: 'rgba(33, 150, 243, 0.2)', text: '#2196F3' },
    'Accounting': { bg: 'rgba(255, 152, 0, 0.2)', text: '#FF9800' },
    'Database': { bg: 'rgba(156, 39, 176, 0.2)', text: '#9C27B0' },
    'Web Development': { bg: 'rgba(233, 30, 99, 0.2)', text: '#E91E63' },
    'Data Science': { bg: 'rgba(0, 188, 212, 0.2)', text: '#00BCD4' }
  };
  return colors[category] || { bg: 'rgba(158, 158, 158, 0.2)', text: '#9E9E9E' };
};
