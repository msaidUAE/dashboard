import React, { useState, useEffect, useCallback } from 'react';
import { KPIRecord, FilterState, DashboardStats as DashboardStatsType } from './types';
import { FilterPanel } from './components/FilterPanel';
import { DashboardVisualization } from './components/DashboardVisualization';
import { DashboardStats } from './components/DashboardStats';
import {
  parseCSV,
  extractFilterOptions,
  filterData,
  sortDatesChronologically,
} from './utils/dataProcessor';
import './styles/App.css';

const App: React.FC = () => {
  const refreshIntervalMs = 5 * 60 * 1000;
  const [allData, setAllData] = useState<KPIRecord[]>([]);
  const [filteredData, setFilteredData] = useState<KPIRecord[]>([]);
  const [filters, setFilters] = useState<Partial<FilterState>>({
    dates: [],
    lanes: [],
    kpiTitles: [],
    actualResultRanges: [],
  });
  const [filterOptions, setFilterOptions] = useState({
    dates: [] as string[],
    lanes: [] as string[],
    kpiTitles: [] as string[],
    actualResultRanges: [] as string[],
  });
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Reload the published daily snapshot so open dashboard pages stay current.
  const loadData = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.BASE_URL}Input/complete_KPIs_Analysis.csv`,
        { cache: 'no-store' }
      );
      if (!response.ok) {
        throw new Error(`KPI data request failed: HTTP ${response.status}`);
      }
      const csvContent = await response.text();
      const parsedData = parseCSV(csvContent);
      setAllData(parsedData);
      setFilteredData(parsedData);
      setFilterOptions(extractFilterOptions(parsedData));
      setLastUpdated(new Date());

      if (parsedData.length > 0) {
        const dates = sortDatesChronologically(parsedData.map(r => r.Date));
        setStats({
          totalRecords: parsedData.length,
          uniqueLanes: new Set(parsedData.map(r => r.Lane)).size,
          uniqueKPIs: new Set(parsedData.map(r => r.KPI_ID)).size,
          dateRange: {
            start: dates[0],
            end: dates[dates.length - 1],
          },
        });
      } else {
        setStats(null);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void loadData();
      }
    }, refreshIntervalMs);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadData, refreshIntervalMs]);

  // Apply filters
  useEffect(() => {
    const filtered = filterData(allData, filters);
    setFilteredData(filtered);
  }, [filters, allData]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(newFilters);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1> Professional KPI Analysis Dashboard</h1>
          <p className="subtitle">
            KPI Data Visualization & Performance Analytics
            {lastUpdated && ` • Updated ${lastUpdated.toLocaleString()} • Refreshes every 5 minutes`}
          </p>
        </div>
      </header>

      <div className="app-container">
        <aside className="sidebar">
          <FilterPanel
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        </aside>

        <main className="main-content">
          {stats && (
            <DashboardStats
              stats={stats}
              filteredCount={filteredData.length}
              totalCount={allData.length}
            />
          )}

          <DashboardVisualization
            data={filteredData}
            isLoading={isLoading}
          />
        </main>
      </div>

      <footer className="app-footer">
        <p>© 2026 Tahseel Information Technology - Professional KPI Analysis Platform</p>
      </footer>
    </div>
  );
};

export default App;
