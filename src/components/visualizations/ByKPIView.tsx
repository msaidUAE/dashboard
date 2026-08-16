import React from 'react';
import { KPIRecord } from '../../types';
import { parseNumericValue, groupByKPITitle } from '../../utils/dataProcessor';
import '../../styles/ByKPIView.css';

interface ByKPIViewProps {
  data: KPIRecord[];
}

const getHeatmapColor = (value: number): string => {
  if (value === 0) return '#f0f0f0';
  if (value >= 95) return '#00a86b'; // Dark green
  if (value >= 90) return '#39d67f'; // Green
  if (value >= 80) return '#9ede73'; // Light green
  if (value >= 70) return '#ffef63'; // Yellow
  if (value >= 50) return '#ffaa3e'; // Orange
  return '#ff3333'; // Red
};

const getHeatmapLabel = (value: number): string => {
  if (value === 0) return 'N/A';
  return value.toFixed(1);
};

export const ByKPIView: React.FC<ByKPIViewProps> = ({ data }) => {
  const groupedByKPI = groupByKPITitle(data);
  const kpiTitles = Object.keys(groupedByKPI)
    .filter(k => k && k !== 'NO_DATA_AVAILABLE')
    .sort();

  // Get all unique lanes
  const allLanes = Array.from(new Set(data.map(r => r.Lane))).sort();

  const renderHeatmap = (kpiTitle: string) => {
    const kpiRecords = groupedByKPI[kpiTitle];

    // Create heatmap data: lanes x dates
    const heatmapMatrix: { [lane: string]: { [date: string]: number } } = {};

    allLanes.forEach(lane => {
      heatmapMatrix[lane] = {};
      const laneRecords = kpiRecords.filter(r => r.Lane === lane);

      laneRecords.forEach(record => {
        const value = parseNumericValue(record.Actual_Result);
        const key = `${record.Date}`;
        
        if (heatmapMatrix[lane][key]) {
          heatmapMatrix[lane][key] = (heatmapMatrix[lane][key] + value) / 2;
        } else {
          heatmapMatrix[lane][key] = value;
        }
      });
    });

    // Get all dates for this KPI
    const allDates = Array.from(
      new Set(kpiRecords.map(r => r.Date))
    ).sort();

    return (
      <div key={kpiTitle} className="heatmap-card">
        <div className="heatmap-header">
          <h3>{kpiTitle}</h3>
          <span className="heatmap-count">{kpiRecords.length} records</span>
        </div>

        <div className="heatmap-table">
          <div className="heatmap-row header-row">
            <div className="heatmap-cell lane-label">Lane</div>
            {allDates.map(date => (
              <div key={date} className="heatmap-cell date-label">
                {date}
              </div>
            ))}
          </div>

          {allLanes.map(lane => (
            <div key={lane} className="heatmap-row">
              <div className="heatmap-cell lane-label">{lane}</div>
              {allDates.map(date => {
                const value = heatmapMatrix[lane]?.[date] ?? 0;
                const color = getHeatmapColor(value);

                return (
                  <div
                    key={`${lane}-${date}`}
                    className="heatmap-cell"
                    style={{ backgroundColor: color }}
                    title={`${lane} - ${date}: ${getHeatmapLabel(value)}%`}
                  >
                    <span className="heatmap-value">{getHeatmapLabel(value)}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="by-kpi-view">
      <div className="view-header">
        <h2>KPI Performance Heatmap</h2>
        <p className="view-description">
          {kpiTitles.length} KPI indicators | {allLanes.length} lanes
        </p>
      </div>

      <div className="heatmap-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#00a86b' }}></div>
          <span>95-100%</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#39d67f' }}></div>
          <span>90-95%</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#9ede73' }}></div>
          <span>80-90%</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ffef63' }}></div>
          <span>70-80%</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ffaa3e' }}></div>
          <span>50-70%</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ff3333' }}></div>
          <span>&lt;50%</span>
        </div>
      </div>

      <div className="heatmaps-grid">
        {kpiTitles.map(kpiTitle => renderHeatmap(kpiTitle))}
      </div>
    </div>
  );
};
