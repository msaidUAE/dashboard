import React, { useState } from 'react';
import { KPIRecord, ViewMode } from '../types';
import { ByLaneView } from './visualizations/ByLaneView';
import { ByKPIView } from './visualizations/ByKPIView';
import { ByDateView } from './visualizations/ByDateView';
import '../styles/DashboardVisualization.css';

interface DashboardVisualizationProps {
  data: KPIRecord[];
  isLoading: boolean;
}

export const DashboardVisualization: React.FC<DashboardVisualizationProps> = ({
  data,
  isLoading,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('byLane');

  if (isLoading) {
    return (
      <div className="visualization-container loading">
        <div className="spinner"></div>
        <p>Loading visualizations...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="visualization-container empty">
        <p>No data available for the selected filters</p>
      </div>
    );
  }

  return (
    <div className="dashboard-visualization">
      <div className="view-selector">
        <button
          className={`view-btn ${viewMode === 'byLane' ? 'active' : ''}`}
          onClick={() => setViewMode('byLane')}
        >
          🛣️ By Lane
        </button>
        <button
          className={`view-btn ${viewMode === 'byKPI' ? 'active' : ''}`}
          onClick={() => setViewMode('byKPI')}
        >
          🔥 By KPI Heatmap
        </button>
        <button
          className={`view-btn ${viewMode === 'byDate' ? 'active' : ''}`}
          onClick={() => setViewMode('byDate')}
        >
          📈 By Date Trends
        </button>
      </div>

      <div className="visualization-content">
        {viewMode === 'byLane' && <ByLaneView data={data} />}
        {viewMode === 'byKPI' && <ByKPIView data={data} />}
        {viewMode === 'byDate' && <ByDateView data={data} />}
      </div>
    </div>
  );
};
