import React, { useState } from 'react';
import { FilterState } from '../types';
import '../styles/FilterPanel.css';

interface FilterPanelProps {
  filterOptions: {
    dates: string[];
    lanes: string[];
    kpiTitles: string[];
    actualResultRanges: string[];
  };
  onFilterChange: (filters: Partial<FilterState>) => void;
  currentFilters: Partial<FilterState>;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filterOptions,
  onFilterChange,
  currentFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    dates: true,
    lanes: true,
    kpiTitles: false,
    actualResultRanges: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleCheckboxChange = (filterType: keyof FilterState, value: string) => {
    const currentValues = (currentFilters[filterType] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onFilterChange({
      ...currentFilters,
      [filterType]: newValues,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      dates: [],
      lanes: [],
      kpiTitles: [],
      actualResultRanges: [],
    });
  };

  const handleSelectAll = (filterType: keyof FilterState) => {
    const options = filterOptions[filterType];
    onFilterChange({
      ...currentFilters,
      [filterType]: [...options],
    });
  };

  const renderFilterSection = (
    title: string,
    filterType: keyof FilterState,
    options: string[]
  ) => {
    const isExpanded = expandedSections[filterType];
    const selectedCount = (currentFilters[filterType] as string[])?.length || 0;

    return (
      <div key={filterType} className="filter-section">
        <div
          className="filter-header"
          onClick={() => toggleSection(filterType)}
        >
          <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
          <span className="filter-title">
            {title}
            {selectedCount > 0 && <span className="badge">{selectedCount}</span>}
          </span>
        </div>

        {isExpanded && (
          <div className="filter-content">
            <div className="filter-actions">
              <button
                className="filter-action-btn"
                onClick={() => handleSelectAll(filterType)}
              >
                Select All
              </button>
              <button
                className="filter-action-btn"
                onClick={() => onFilterChange({ ...currentFilters, [filterType]: [] })}
              >
                Clear
              </button>
            </div>

            <div className="filter-options">
              {options.map((option) => (
                <label key={option} className="filter-option">
                  <input
                    type="checkbox"
                    checked={((currentFilters[filterType] as string[]) || []).includes(option)}
                    onChange={() => handleCheckboxChange(filterType, option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="filter-panel">
      <div className="filter-header-main">
        <h2>Filters (AND Operator)</h2>
        <button className="clear-all-btn" onClick={handleClearFilters}>
          Clear All Filters
        </button>
      </div>

      {renderFilterSection('📅 Dates', 'dates', filterOptions.dates)}
      {renderFilterSection('🛣️ Lanes', 'lanes', filterOptions.lanes)}
      {renderFilterSection('📊 KPIs', 'kpiTitles', filterOptions.kpiTitles)}
      {renderFilterSection('📈 Result Ranges', 'actualResultRanges', filterOptions.actualResultRanges)}

      <div className="filter-info">
        <p className="info-text">
          💡 Filters work with AND logic: all selected filters must match
        </p>
      </div>
    </div>
  );
};
