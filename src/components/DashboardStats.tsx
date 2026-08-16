import React from 'react';
import { KPIRecord, DashboardStats as DashboardStatsType } from '../types';
import { formatDate } from '../utils/dataProcessor';
import '../styles/DashboardStats.css';

interface DashboardStatsProps {
  stats: DashboardStatsType;
  filteredCount: number;
  totalCount: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  filteredCount,
  totalCount,
}) => {
  const getStatusColor = (value: number): string => {
    if (value >= 90) return 'excellent';
    if (value >= 75) return 'good';
    if (value >= 50) return 'warning';
    return 'critical';
  };

  return (
    <div className="dashboard-stats">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h4>Total Records</h4>
            <p className="stat-value">{totalCount}</p>
            <p className="stat-subtitle">Showing {filteredCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛣️</div>
          <div className="stat-content">
            <h4>Unique Lanes</h4>
            <p className="stat-value">{stats.uniqueLanes}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h4>KPI Indicators</h4>
            <p className="stat-value">{stats.uniqueKPIs}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h4>Date Range</h4>
            <p className="stat-subtitle">
              {formatDate(stats.dateRange.start)} to {formatDate(stats.dateRange.end)}
            </p>
          </div>
        </div>
      </div>

      {filteredCount !== totalCount && (
        <div className="filter-info-banner">
          <span className="info-icon">ℹ️</span>
          <span>
            Filters applied: showing {filteredCount} of {totalCount} records
            ({Math.round((filteredCount / totalCount) * 100)}%)
          </span>
        </div>
      )}
    </div>
  );
};
