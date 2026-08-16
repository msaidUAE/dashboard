import React, { useState } from 'react';
import { KPIRecord, KPIStatus } from '../types';
import { determineStatus, formatDate, parseNumericValue } from '../utils/dataProcessor';
import '../styles/DataTable.css';

interface DataTableProps {
  data: KPIRecord[];
  maxRows?: number;
}

export const DataTable: React.FC<DataTableProps> = ({ data, maxRows = 20 }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof KPIRecord;
    direction: 'asc' | 'desc';
  }>({ key: 'Date', direction: 'desc' });

  const [pageIndex, setPageIndex] = useState(0);

  const getStatusBadge = (status: KPIStatus): string => {
    const statusColors: { [key in KPIStatus]: string } = {
      [KPIStatus.EXCELLENT]: 'badge-excellent',
      [KPIStatus.GOOD]: 'badge-good',
      [KPIStatus.WARNING]: 'badge-warning',
      [KPIStatus.CRITICAL]: 'badge-critical',
      [KPIStatus.NO_DATA]: 'badge-no-data',
    };
    return statusColors[status];
  };

  const handleSort = (key: keyof KPIRecord) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const paginatedData = sortedData.slice(
    pageIndex * maxRows,
    (pageIndex + 1) * maxRows
  );

  const totalPages = Math.ceil(sortedData.length / maxRows);

  const SortIcon = ({ column }: { column: keyof KPIRecord }) => {
    if (sortConfig.key !== column) return <span className="sort-icon">⇅</span>;
    return (
      <span className="sort-icon active">
        {sortConfig.direction === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  if (data.length === 0) {
    return (
      <div className="data-table-empty">
        <p>No data to display. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <div className="table-header">
        <h3>KPI Records ({data.length} total)</h3>
        <span className="showing-text">
          Showing {paginatedData.length} of {data.length}
        </span>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('Date')}>
                Date <SortIcon column="Date" />
              </th>
              <th onClick={() => handleSort('Lane')}>
                Lane <SortIcon column="Lane" />
              </th>
              <th onClick={() => handleSort('KPI_Title')}>
                KPI Title <SortIcon column="KPI_Title" />
              </th>
              <th onClick={() => handleSort('Actual_Result')}>
                Result <SortIcon column="Actual_Result" />
              </th>
              <th>Status</th>
              <th onClick={() => handleSort('Data_Source')}>
                Source <SortIcon column="Data_Source" />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((record, index) => {
              const status = determineStatus(record.Actual_Result);
              return (
                <tr key={index} className={`status-${status.toLowerCase()}`}>
                  <td>{formatDate(record.Date)}</td>
                  <td>{record.Lane}</td>
                  <td className="kpi-title">{record.KPI_Title}</td>
                  <td className="result-value">{record.Actual_Result}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(status)}`}>
                      {status}
                    </span>
                  </td>
                  <td className="source">{record.Data_Source}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
            disabled={pageIndex === 0}
          >
            ← Previous
          </button>

          <div className="page-info">
            Page {pageIndex + 1} of {totalPages}
          </div>

          <button
            onClick={() => setPageIndex(Math.min(totalPages - 1, pageIndex + 1))}
            disabled={pageIndex === totalPages - 1}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};
