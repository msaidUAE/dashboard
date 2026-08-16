import React from 'react';
import { Line } from 'react-chartjs-2';
import { KPIRecord } from '../../types';
import { parseNumericValue, groupByKPITitle, formatDate } from '../../utils/dataProcessor';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../../styles/ByDateView.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ByDateViewProps {
  data: KPIRecord[];
}

const LANE_COLORS: { [key: string]: string } = {
  'Al_Dhead_Lane_1_Daily': '#FF6384',
  'Al_Dhead_Lane_2_Daily': '#36A2EB',
  'Al_Dhead_Lane_3_Daily': '#FFCE56',
  'Al_Madam_Lane_3': '#4BC0C0',
  'Al_Zubair_Lane_3': '#9966FF',
  'Al_Zubair_Lane_4': '#FF9F40',
};

export const ByDateView: React.FC<ByDateViewProps> = ({ data }) => {
  const groupedByKPI = groupByKPITitle(data);
  const kpiTitles = Object.keys(groupedByKPI)
    .filter(k => k && k !== 'NO_DATA_AVAILABLE')
    .sort();

  // Get all unique lanes
  const allLanes = Array.from(new Set(data.map(r => r.Lane))).sort();

  // Get all unique dates
  const allDates = Array.from(new Set(data.map(r => r.Date)))
    .sort()
    .map(d => ({ raw: d, formatted: formatDate(d) }));

  const renderKPITrendCard = (kpiTitle: string) => {
    const kpiRecords = groupedByKPI[kpiTitle];

    // For each lane, create trend data
    const laneDatasets = allLanes.map((lane, laneIndex) => {
      const laneRecords = kpiRecords.filter(r => r.Lane === lane);

      // Get trend data for this lane
      const trendData = allDates.map(dateObj => {
        const dateRecords = laneRecords.filter(r => r.Date === dateObj.raw);
        if (dateRecords.length === 0) return null;

        const validRecords = dateRecords.filter(r => r.Actual_Result !== 'NO_DATA_AVAILABLE');
        if (validRecords.length === 0) return null;

        const sum = validRecords.reduce((acc, r) => acc + parseNumericValue(r.Actual_Result), 0);
        return sum / validRecords.length;
      });

      return {
        label: lane,
        data: trendData,
        borderColor: LANE_COLORS[lane] || `hsl(${laneIndex * 60}, 70%, 50%)`,
        backgroundColor: `${LANE_COLORS[lane] || `hsl(${laneIndex * 60}, 70%, 50%)`}20`,
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
      };
    });

    const chartData = {
      labels: allDates.map(d => d.formatted),
      datasets: laneDatasets,
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: { 
          display: true, 
          position: 'top' as const,
          labels: {
            font: { size: 12, weight: 'bold' as const },
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle',
          }
        },
        title: { 
          display: true, 
          text: `${kpiTitle} - Trend by Lane`,
          font: { size: 15, weight: 'bold' as const },
          padding: { bottom: 20 }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleFont: { size: 13, weight: 'bold' as const },
          bodyFont: { size: 12 },
          padding: 10,
          displayColors: true,
          callbacks: {
            label: function(context: any) {
              return `${context.dataset.label}: ${context.parsed.y?.toFixed(2) ?? 'N/A'}%`;
            }
          }
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
            text: 'Performance (%)',
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
          {kpiTitles.length} KPI indicators | {allLanes.length} lanes | {allDates.length} dates
        </p>
      </div>

      <div className="trends-container">
        {kpiTitles.map(kpiTitle => renderKPITrendCard(kpiTitle))}
      </div>
    </div>
  );
};
