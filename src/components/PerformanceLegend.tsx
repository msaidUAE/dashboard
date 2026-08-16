import React from 'react';
import { PERFORMANCE_LEGEND, NO_DATA_COLOR } from '../utils/colors';

/**
 * Shared color legend for performance (percentage) visualizations.
 */
export const PerformanceLegend: React.FC = () => {
  return (
    <div className="perf-legend">
      {PERFORMANCE_LEGEND.map((item) => (
        <div key={item.label} className="perf-legend-item">
          <span
            className="perf-legend-swatch"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.label}</span>
        </div>
      ))}
      <div className="perf-legend-item">
        <span
          className="perf-legend-swatch"
          style={{ backgroundColor: NO_DATA_COLOR }}
        />
        <span>No Data</span>
      </div>
    </div>
  );
};
