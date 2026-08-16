import React from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartConfig } from '../types';
import '../styles/ChartGrid.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartGridProps {
  charts: ChartConfig[];
  isLoading: boolean;
}

export const ChartGrid: React.FC<ChartGridProps> = ({ charts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="chart-grid loading">
        <div className="spinner"></div>
        <p>Loading charts...</p>
      </div>
    );
  }

  if (charts.length === 0) {
    return (
      <div className="chart-grid empty">
        <p>No data available for the selected filters</p>
      </div>
    );
  }

  const renderChart = (chart: ChartConfig, index: number) => {
    const ChartComponent = {
      line: Line,
      bar: Bar,
      pie: Pie,
      doughnut: Doughnut,
    }[chart.type];

    return (
      <div key={index} className="chart-container">
        <div className="chart-header">
          <h3>{chart.title}</h3>
        </div>
        <div className="chart-wrapper">
          <ChartComponent
            data={chart.data}
            options={chart.options || {
              responsive: true,
              maintainAspectRatio: true,
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="chart-grid">
      {charts.map((chart, index) => renderChart(chart, index))}
    </div>
  );
};
