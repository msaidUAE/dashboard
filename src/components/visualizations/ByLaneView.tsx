import React from 'react';
import { Bar } from 'react-chartjs-2';
import { KPIRecord } from '../../types';
import { parseNumericValue, groupByLane } from '../../utils/dataProcessor';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../../styles/ByLaneView.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ByLaneViewProps {
  data: KPIRecord[];
}

const COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#00D4FF', '#FFB6C1', '#87CEEB', '#98D8C8',
];

export const ByLaneView: React.FC<ByLaneViewProps> = ({ data }) => {
  const groupedByLane = groupByLane(data);
  const lanes = Object.keys(groupedByLane).sort();

  // Get all unique KPI titles
  const allKPITitles = Array.from(new Set(data.map(r => r.KPI_Title)))
    .filter(k => k && k !== 'NO_DATA_AVAILABLE')
    .sort();

  const renderLaneCharts = () => {
    return lanes.map((lane, laneIndex) => {
      const laneRecords = groupedByLane[lane];

      // Calculate average for each KPI in this lane
      const kpiAverages = allKPITitles.map(kpiTitle => {
        const kpiRecords = laneRecords.filter(r => r.KPI_Title === kpiTitle);
        if (kpiRecords.length === 0) return 0;

        const validRecords = kpiRecords.filter(r => r.Actual_Result !== 'NO_DATA_AVAILABLE');
        if (validRecords.length === 0) return 0;

        const sum = validRecords.reduce((acc, r) => acc + parseNumericValue(r.Actual_Result), 0);
        return sum / validRecords.length;
      });

      const chartData = {
        labels: allKPITitles,
        datasets: [
          {
            label: `Lane: ${lane}`,
            data: kpiAverages,
            backgroundColor: COLORS[laneIndex % COLORS.length],
            borderColor: COLORS[laneIndex % COLORS.length],
            borderWidth: 2,
          },
        ],
      };

      const chartOptions = {
        indexAxis: 'x' as const,
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { 
            display: true, 
            position: 'top' as const,
            labels: {
              font: { size: 14, weight: 'bold' as const },
              padding: 15,
              usePointStyle: true,
            }
          },
          title: { 
            display: true, 
            text: `KPI Performance - ${lane}`,
            font: { size: 16, weight: 'bold' as const },
            padding: { bottom: 20 }
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFont: { size: 13, weight: 'bold' as const },
            bodyFont: { size: 12 },
            padding: 10,
            displayColors: true,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value: any) {
                return value + '%';
              },
              font: { size: 12 },
            },
            title: { 
              display: true, 
              text: 'Average Score (%)',
              font: { size: 13, weight: 'bold' as const }
            },
          },
          x: {
            ticks: {
              font: { size: 11 },
              maxRotation: 45,
              minRotation: 45,
            }
          }
        },
      };

      return (
        <div key={lane} className="lane-chart-container">
          <div className="chart-wrapper">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      );
    });
  };

  return (
    <div className="by-lane-view">
      <div className="view-header">
        <h2>Performance by Lane</h2>
        <p className="view-description">
          {lanes.length} lanes | {allKPITitles.length} KPI indicators
        </p>
      </div>
      <div className="charts-container">
        {renderLaneCharts()}
      </div>
    </div>
  );
};
