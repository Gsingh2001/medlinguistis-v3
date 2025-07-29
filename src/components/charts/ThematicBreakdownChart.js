import React from 'react';

const ThematicBreakdownChart = ({ themes }) => {
  return (
    <div className="text-sm text-gray-500 italic">
      ({themes.length} themes identified)
    </div>
  );
};

export default ThematicBreakdownChart;
