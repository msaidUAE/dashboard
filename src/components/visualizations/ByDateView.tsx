import React from 'react';
import { Line } from 'react-chartjs-2';
import { KPIRecord } from '../../types';
import {
  groupByKPITitle,
  aggregateRecords,
  sortDatesChronologically,
  formatDate,
  isSecondsValue,
} from '../../utils/dataProcessor';
import { getLaneColor } from '../../utils/colors';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import '../../styles/ByDateView.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ByDateViewProps {
  data: KPIRecord[];
}

interface Cell {
  value: number | null;
  display: string;
  unit: 'seconds' | 'percentage' | 'status' | 'none';
}

export const ByDateView: React.FC<ByDateViewProps> = ({ data }) => {
  const groupedByKPI = groupByKPITitle(data);
  const kpiTitles = Object.keys(groupedByKPI)
    .filter((k) => k && k !== 'NO_DATA_AVAILABLE')
    .sort();

  const lanes = Array.from(new Set(data.map((r) => r.Lane))).sort();
  const dates = sortDatesChronologically(
    Array.from(new Set(data.map((r) => r.Date)))
  );

  const renderKPITrendCard = (kpiTitle: string) => {
    const kpiRecords = groupedByKPI[kpiTitle];
    const isSecondsKpi = kpiRecords.some((record) =>
      isSecondsValue(record.Actual_Result)
    );

    // Index records by lane → date.
    const byLaneDate: { [lane: string]: { [date: string]: KPIRecord[] } } = {};
    kpiRecords.forEach((record) => {
      if (!byLaneDate[record.Lane]) byLaneDate[record.Lane] = {};
      if (!byLaneDate[record.Lane][record.Date]) {
        byLaneDate[record.Lane][record.Date] = [];
      }
      byLaneDate[record.Lane][record.Date].push(record);
    });

    // Pre-aggregate every lane × date cell for datasets and tooltips.
    const cells: { [lane: string]: { [date: string]: Cell } } = {};
    lanes.forEach((lane) => {
      cells[lane] = {};
      dates.forEach((date) => {
        cells[lane][date] = aggregateRecords(
          byLaneDate[lane]?.[date] ?? []
        );
      });
    });

    const datasets = lanes.map((lane, laneIndex) => ({
      label: lane,
      data: dates.map((date) => cells[lane][date].value),
      borderColor: getLaneColor(lane, laneIndex),
      backgroundColor: getLaneColor(lane, laneIndex),
      tension: 0.3,
      spanGaps: true,
      fill: false,
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
    }));

    const chartData = {
      labels: dates.map((d) => formatDate(d)),
      datasets,
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
          labels: {
            font: { size: 11, weight: 'bold' as const },
            padding: 12,
            usePointStyle: true,
            pointStyle: 'circle' as const,
          },
        },
        title: {
          display: true,
          text: kpiTitle,
          font: { size: 14, weight: 'bold' as const },
          color: '#1e293b',
          padding: { bottom: 8 },
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          titleFont: { size: 13, weight: 'bold' as const },
          bodyFont: { size: 12 },
          padding: 10,
          callbacks: {
            title: (items: any) => formatDate(dates[items[0].dataIndex]),
            label: (context: any) => {
              const lane = lanes[context.datasetIndex];
              const date = dates[context.dataIndex];
              const { display } = cells[lane][date];
              return ` ${lane}: ${display}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: any) => isSecondsKpi ? `${value} sec` : `${value}%`,
            font: { size: 11 },
          },
          title: {
            display: true,
            text: isSecondsKpi ? 'Elapsed time (seconds)' : 'Performance (%)',
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
      <div key={kpiTitle} className="trend-card">
        <div className="chart-wrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    );
  };

  return (
    <div className="by-date-view">
      <div className="view-header">
        <h2>KPI Trends by Date</h2>
        <p className="view-description">
          {kpiTitles.length} KPI indicators × {lanes.length} lanes × {dates.length} dates
        </p>
      </div>

      <div className="trends-container">
        {kpiTitles.map((kpiTitle) => renderKPITrendCard(kpiTitle))}
      </div>
    </div>
  );
};
