import React from 'react';
import { KPIRecord } from '../../types';
import {
  groupByKPITitle,
  aggregateRecords,
  sortDatesChronologically,
  formatDate,
} from '../../utils/dataProcessor';
import { getPerformanceColor, getContrastTextColor } from '../../utils/colors';
import { PerformanceLegend } from '../PerformanceLegend';
import '../../styles/ByKPIView.css';

interface ByKPIViewProps {
  data: KPIRecord[];
}

export const ByKPIView: React.FC<ByKPIViewProps> = ({ data }) => {
  const groupedByKPI = groupByKPITitle(data);
  const kpiTitles = Object.keys(groupedByKPI)
    .filter((k) => k && k !== 'NO_DATA_AVAILABLE')
    .sort();

  const lanes = Array.from(new Set(data.map((r) => r.Lane))).sort();
  const dates = sortDatesChronologically(
    Array.from(new Set(data.map((r) => r.Date)))
  );

  const renderHeatmap = (kpiTitle: string) => {
    const kpiRecords = groupedByKPI[kpiTitle];

    // Index records by lane → date for O(1) cell lookup.
    const byLaneDate: { [lane: string]: { [date: string]: KPIRecord[] } } = {};
    kpiRecords.forEach((record) => {
      if (!byLaneDate[record.Lane]) byLaneDate[record.Lane] = {};
      if (!byLaneDate[record.Lane][record.Date]) {
        byLaneDate[record.Lane][record.Date] = [];
      }
      byLaneDate[record.Lane][record.Date].push(record);
    });

    return (
      <div key={kpiTitle} className="heatmap-card">
        <div className="heatmap-header">
          <h3>{kpiTitle}</h3>
          <span className="heatmap-count">{kpiRecords.length} records</span>
        </div>

        <div className="heatmap-table">
          <div className="heatmap-row header-row">
            <div className="heatmap-cell lane-label">Lane</div>
            {dates.map((date) => (
              <div
                key={date}
                className="heatmap-cell date-label"
                title={formatDate(date)}
              >
                {formatDate(date).substring(0, 5)}
              </div>
            ))}
          </div>

          {lanes.map((lane) => (
            <div key={lane} className="heatmap-row">
              <div className="heatmap-cell lane-label" title={lane}>
                {lane}
              </div>
              {dates.map((date) => {
                const records = byLaneDate[lane]?.[date] ?? [];
                const { value, display } = aggregateRecords(records);
                const bg = getPerformanceColor(value);
                const fg = getContrastTextColor(value);

                return (
                  <div
                    key={`${lane}-${date}`}
                    className="heatmap-cell"
                    style={{ backgroundColor: bg, color: fg }}
                    title={`${lane} · ${formatDate(date)}: ${display}`}
                  >
                    <span className="heatmap-value">{display}</span>
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
          {kpiTitles.length} KPI indicators × {lanes.length} lanes × {dates.length} dates
        </p>
      </div>

      <PerformanceLegend />

      <div className="heatmaps-grid">{kpiTitles.map((kpiTitle) => renderHeatmap(kpiTitle))}</div>
    </div>
  );
};
