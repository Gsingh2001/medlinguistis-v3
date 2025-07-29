// components/charts/EmotionalToneBarChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EmotionalToneBarChart = ({ data }) => {
  // data example: { fear: 4, frustration: 3, hope: 2, isolation: 5, relief: 1 }
  const labels = Object.keys(data).map(
    (tone) => tone.charAt(0).toUpperCase() + tone.slice(1)
  );

  const values = Object.values(data);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Emotional Tone",
        data: values,
        backgroundColor: "#2196f3", // blue color
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Emotional Tone Analysis",
      },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default EmotionalToneBarChart;
