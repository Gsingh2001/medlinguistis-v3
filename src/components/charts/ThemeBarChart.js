// === FILE: components/charts/ThemeBarChart.js ===
"use client";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ThemeBarChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.theme),
    datasets: [
      {
        label: "Theme Count",
        data: data.map((item) => item.count),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default ThemeBarChart;
