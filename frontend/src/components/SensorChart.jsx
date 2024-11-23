import React from 'react';
import { Line } from 'react-chartjs-2';

const SensorChart = ({ sensorData }) => {
  // Map data for chart
  const data = {
    labels: sensorData.map((entry) => new Date(entry.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Sensor Values',
        data: sensorData.map((entry) => entry.value),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Sensor Value',
        },
      },
    },
  };

  return (
    <div>
      <h4>Sensor Data Over Time</h4>
      <Line data={data} options={options} />
    </div>
  );
};

export default SensorChart;
