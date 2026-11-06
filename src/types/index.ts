export interface KPIRecord {
  Date: string;
  Lane: string;
  Batch: string;
  KPI_ID: string;
  KPI_Title: string;
  Actual_Result: string;
  Data_Source: string;
  Confidence: string;
  Target: string;
  Pass_Fail: string;
}

export interface FilterState {
  dates: string[];
  lanes: string[];
  kpiTitles: string[];
  actualResultRanges: string[];
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  title: string;
  data: any;
  options?: any;
}

export interface DashboardStats {
  totalRecords: number;
  uniqueLanes: number;
  uniqueKPIs: number;
  dateRange: {
    start: string;
    end: string;
  };
}

export type ViewMode = 'byLane' | 'byKPI' | 'byDate';

export enum KPIStatus {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  NO_DATA = 'NO_DATA',
  UNSCORED = 'UNSCORED',
}

export interface LaneVisualization {
  lane: string;
  kpiData: { [kpiTitle: string]: number };
}

export interface KPIVisualization {
  kpiTitle: string;
  heatmapData: { [lane: string]: { [date: string]: number } };
}

export interface DateVisualization {
  kpiTitle: string;
  lanes: { [lane: string]: { date: string; value: number }[] };
}
