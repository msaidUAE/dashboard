import React from 'react';
import { Bar } from 'react-chartjs-2';
import { KPIRecord } from '../../types';
import { groupByLane, aggregateRecords } from '../../utils/dataProcessor';
import { getPerformanceColor } from '../../utils/colors';
import { PerformanceLegend } from '../PerformanceLegend';
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

interface BarEntry {
  value: number | null;
  display: string;
}

export const ByLaneView: React.FC<ByLaneViewProps> = ({ data }) => {
  const groupedByLane = groupByLane(data);
  const lanes = Object.keys(groupedByLane).sort();

  const kpiTitles = Array.from(new Set(data.map((r) => r.KPI_Title)))
    .filter((k) => k && k !== 'NO_DATA_AVAILABLE')
    .sort();

  const renderLaneChart = (lane: string) => {
    const laneRecords = groupedByLane[lane];

    const entries: BarEntry[] = kpiTitles.map((kpiTitle) => {
      const kpiRecords = laneRecords.filter((r) => r.KPI_Title === kpiTitle);
      return aggregateRecords(kpiRecords);
    });

    const chartData = {
      labels: kpiTitles,
      datasets: [
        {
          label: 'Performance',
          data: entries.map((e) => (e.value === null ? 0 : e.value)),
          backgroundColor: entries.map((e) => getPerformanceColor(e.value)),
          borderColor: entries.map((e) =>
            e.value === null ? '#cbd5e1' : getPerformanceColor(e.value)
          ),
          borderWidth: 1,
          borderRadius: 4,
          maxBarThickness: 28,
        },
      ],
    };

    const chartOptions = {
      indexAxis: 'x' as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: lane,
          font: { size: 15, weight: 'bold' as const },
          color: '#1e293b',
          padding: { bottom: 12 },
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          titleFont: { size: 13, weight: 'bold' as const },
          bodyFont: { size: 12 },
          padding: 10,
          callbacks: {
            title: () => lane,
            label: (context: any) => {
              const entry = entries[context.dataIndex];
              return ` ${context.label}: ${entry.display}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value: any) => `${value}%`,
            font: { size: 11 },
          },
          title: {
            display: true,
            text: 'Actual Result (%)',
            font: { size: 12, weight: 'bold' as const },
          },
          grid: { color: 'rgba(148, 163, 184, 0.15)' },
        },
        x: {
          ticks: {
            font: { size: 10 },
            maxRotation: 60,
            minRotation: 45,
            autoSkip: false,
          },
          grid: { display: false },
        },
      },
    };

    return (
      <div key={lane} className="lane-chart-container">
        <div className="chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    );
  };

  return (
    <div className="by-lane-view">
      <div className="view-header">
        <h2>Performance by Lane</h2>
        <p className="view-description">
          {lanes.length} lanes × {kpiTitles.length} KPI indicators
        </p>
      </div>

      <PerformanceLegend />

      <div className="charts-container">{lanes.map((lane) => renderLaneChart(lane))}</div>
    </div>
  );
};
