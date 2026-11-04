import React from 'react';
import { PERFORMANCE_LEGEND, NO_DATA_COLOR, UNSCORED_COLOR } from '../utils/colors';

/**
 * Shared color legend for performance (percentage) visualizations.
 */
export const PerformanceLegend: React.FC<{ showUnscored?: boolean }> = ({
  showUnscored = false,
}) => {
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
      {showUnscored && (
        <div className="perf-legend-item">
          <span
            className="perf-legend-swatch"
            style={{ backgroundColor: UNSCORED_COLOR }}
          />
          <span>Seconds (unscored)</span>
        </div>
      )}
    </div>
  );
};
