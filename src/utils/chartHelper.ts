import { KPIRecord, ChartConfig } from '../types';
import { groupByKPITitle, groupByLane, groupByDate, parseNumericValue, formatDate } from './dataProcessor';

const COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
  '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
];

/**
 * Intelligent chart type selector based on data characteristics
 */
export const selectBestChartType = (
  data: KPIRecord[],
  groupBy: 'kpi' | 'lane' | 'date'
): 'line' | 'bar' | 'pie' => {
  if (data.length === 0) return 'bar';

  // For time series (date-based), prefer line charts
  if (groupBy === 'date' && data.length > 1) {
    return 'line';
  }

  // For categorical comparison (lanes, KPIs)
  if (groupBy === 'lane' || groupBy === 'kpi') {
    // If comparing percentages across categories, use pie/doughnut
    const hasPercentages = data.some(r => r.Actual_Result.includes('%'));
    const uniqueValues = new Set(data.map(r => r.Actual_Result)).size;

    if (hasPercentages && uniqueValues <= 10) {
      return 'pie';
    }
    return 'bar';
  }

  return 'bar';
};

/**
 * Create KPI Performance over Time chart
 */
export const createTimeSeriesChart = (data: KPIRecord[]): ChartConfig => {
  const groupedByDate = groupByDate(data);
  const sortedDates = Object.keys(groupedByDate).sort();

  const chartData = {
    labels: sortedDates.map(formatDate),
    datasets: [
      {
        label: 'Average KPI Score (%)',
        data: sortedDates.map((date) => {
          const records = groupedByDate[date];
          const validRecords = records.filter(r => r.Actual_Result !== 'NO_DATA_AVAILABLE');
          const sum = validRecords.reduce((acc, r) => acc + parseNumericValue(r.Actual_Result), 0);
          return validRecords.length > 0 ? (sum / validRecords.length) : 0;
        }),
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  return {
    type: 'line',
    title: 'KPI Performance Trend Over Time',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'KPI Performance Trend Over Time' },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: 'Score (%)' },
        },
      },
    },
  };
};

/**
 * Create Lane Comparison chart
 */
export const createLaneComparisonChart = (data: KPIRecord[]): ChartConfig => {
  const groupedByLane = groupByLane(data);
  const lanes = Object.keys(groupedByLane).sort();

  const chartData = {
    labels: lanes,
    datasets: [
      {
        label: 'Average Performance (%)',
        data: lanes.map((lane) => {
          const records = groupedByLane[lane];
          const validRecords = records.filter(r => r.Actual_Result !== 'NO_DATA_AVAILABLE');
          const sum = validRecords.reduce((acc, r) => acc + parseNumericValue(r.Actual_Result), 0);
          return validRecords.length > 0 ? (sum / validRecords.length) : 0;
        }),
        backgroundColor: COLORS.slice(0, lanes.length),
        borderColor: COLORS.slice(0, lanes.length),
        borderWidth: 2,
      },
    ],
  };

  return {
    type: 'bar',
    title: 'Performance by Lane',
    data: chartData,
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Performance by Lane' },
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  };
};

/**
 * Create KPI Category Distribution chart
 */
export const createKPICategoryChart = (data: KPIRecord[]): ChartConfig => {
  const categories: { [key: string]: number } = {
    Hardware: 0,
    Software: 0,
    Central: 0,
    Compliance: 0,
    Other: 0,
  };

  data.forEach((record) => {
    if (
      record.KPI_ID.startsWith('HW')
      || record.KPI_ID === 'SW-00'
      || record.KPI_ID === 'KPI-D-11'
    ) categories['Hardware']++;
    else if (record.KPI_ID.startsWith('SW')) categories['Software']++;
    else if (record.KPI_ID.startsWith('CT')) categories['Central']++;
    else if (record.KPI_ID.startsWith('CMP')) categories['Compliance']++;
    else categories['Other']++;
  });

  const filteredCategories = Object.entries(categories)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  const chartData = {
    labels: filteredCategories.map(([cat]) => cat),
    datasets: [
      {
        data: filteredCategories.map(([_, count]) => count),
        backgroundColor: COLORS.slice(0, filteredCategories.length),
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  return {
    type: 'pie',
    title: 'KPI Distribution by Category',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, position: 'right' },
        title: { display: true, text: 'KPI Distribution by Category' },
      },
    },
  };
};

/**
 * Create KPI Performance Matrix
 */
export const createKPIPerformanceChart = (data: KPIRecord[]): ChartConfig => {
  const groupedByKPI = groupByKPITitle(data);
  const kpis = Object.keys(groupedByKPI).sort();

  const chartData = {
    labels: kpis,
    datasets: [
      {
        label: 'Average Score (%)',
        data: kpis.map((kpi) => {
          const records = groupedByKPI[kpi];
          const validRecords = records.filter(r => r.Actual_Result !== 'NO_DATA_AVAILABLE');
          const sum = validRecords.reduce((acc, r) => acc + parseNumericValue(r.Actual_Result), 0);
          return validRecords.length > 0 ? (sum / validRecords.length) : 0;
        }),
        backgroundColor: COLORS.slice(0, Math.min(kpis.length, COLORS.length)),
        borderColor: COLORS.slice(0, Math.min(kpis.length, COLORS.length)),
        borderWidth: 2,
      },
    ],
  };

  return {
    type: 'bar',
    title: 'KPI Performance Summary',
    data: chartData,
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'KPI Performance Summary' },
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  };
};

/**
 * Create Status Distribution chart
 */
export const createStatusDistributionChart = (data: KPIRecord[]): ChartConfig => {
  const statusCounts = {
    'NO_DATA': 0,
    'CRITICAL': 0,
    'WARNING': 0,
    'GOOD': 0,
    'EXCELLENT': 0,
  };

  data.forEach((record) => {
    const value = parseNumericValue(record.Actual_Result);

    if (record.Actual_Result === 'NO_DATA_AVAILABLE') {
      statusCounts['NO_DATA']++;
    } else if (value >= 90) {
      statusCounts['EXCELLENT']++;
    } else if (value >= 75) {
      statusCounts['GOOD']++;
    } else if (value >= 50) {
      statusCounts['WARNING']++;
    } else {
      statusCounts['CRITICAL']++;
    }
  });

  const filteredStatuses = Object.entries(statusCounts)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  const statusColors: { [key: string]: string } = {
    'EXCELLENT': '#4CAF50',
    'GOOD': '#8BC34A',
    'WARNING': '#FFC107',
    'CRITICAL': '#F44336',
    'NO_DATA': '#9E9E9E',
  };

  const chartData = {
    labels: filteredStatuses.map(([status]) => status),
    datasets: [
      {
        data: filteredStatuses.map(([_, count]) => count),
        backgroundColor: filteredStatuses.map(([status]) => statusColors[status]),
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  return {
    type: 'doughnut',
    title: 'KPI Status Distribution',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, position: 'bottom' },
        title: { display: true, text: 'KPI Status Distribution' },
      },
    },
  };
};
