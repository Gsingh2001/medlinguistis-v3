import React from 'react';

const OverallToneChart = ({ data }) => {
  // Placeholder: Replace with chart library like Recharts or Chart.js later
  return (
    <ul className="space-y-2">
      {data.map((item, i) => (
        <li key={i} className="flex justify-between text-sm">
          <span>{item.name}</span>
          <span style={{ color: item.fill }}>{item.value}%</span>
        </li>
      ))}
    </ul>
  );
};

export default OverallToneChart;
