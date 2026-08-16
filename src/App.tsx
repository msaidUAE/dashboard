import React, { useState, useEffect } from 'react';
import { KPIRecord, FilterState, DashboardStats as DashboardStatsType } from './types';
import { FilterPanel } from './components/FilterPanel';
import { DashboardVisualization } from './components/DashboardVisualization';
import { DashboardStats } from './components/DashboardStats';
import {
  parseCSV,
  extractFilterOptions,
  filterData,
} from './utils/dataProcessor';
import './styles/App.css';

const App: React.FC = () => {
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

  // Load CSV data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/Input/complete_KPIs_Analysis.csv');
        const csvContent = await response.text();
        const parsedData = parseCSV(csvContent);
        setAllData(parsedData);
        setFilteredData(parsedData);
        setFilterOptions(extractFilterOptions(parsedData));

        // Calculate initial stats
        if (parsedData.length > 0) {
          const dates = parsedData.map(r => r.Date).sort();
          setStats({
            totalRecords: parsedData.length,
            uniqueLanes: new Set(parsedData.map(r => r.Lane)).size,
            uniqueKPIs: new Set(parsedData.map(r => r.KPI_Title)).size,
            dateRange: {
              start: dates[0],
              end: dates[dates.length - 1],
            },
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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
          <h1>🎯 Professional KPI Analysis Dashboard</h1>
          <p className="subtitle">Real-time Data Visualization & Performance Analytics</p>
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
        <p>© 2026 Tahseel - Professional KPI Analysis Platform</p>
      </footer>
    </div>
  );
};

export default App;
