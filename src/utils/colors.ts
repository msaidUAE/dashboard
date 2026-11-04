/**
 * Shared color scales and lane palette for the dashboard.
 *
 * Performance color scale follows the requirement:
 *   Dark Green (95-100%) → Green (90-95%) → Light Green (80-90%) →
 *   Yellow (70-80%) → Orange (50-70%) → Red (<50%)
 */

export const LANE_COLORS: { [lane: string]: string } = {
  Al_Dhead_Lane_1_Daily: '#2563eb',
  Al_Dhead_Lane_2_Daily: '#0891b2',
  Al_Dhead_Lane_3_Daily: '#7c3aed',
  Al_Madam_Lane_3: '#db2777',
  Al_Zubair_Lane_3: '#ea580c',
  Al_Zubair_Lane_4: '#16a34a',
};

export const LANE_COLOR_LIST: string[] = [
  '#2563eb',
  '#0891b2',
  '#7c3aed',
  '#db2777',
  '#ea580c',
  '#16a34a',
];

/** Return a deterministic lane color for any lane string. */
export const getLaneColor = (lane: string, index: number): string => {
  return LANE_COLORS[lane] || LANE_COLOR_LIST[index % LANE_COLOR_LIST.length];
};

/** Performance color buckets (ordered high → low). */
export const PERFORMANCE_LEGEND: { label: string; color: string; min: number; max: number }[] = [
  { label: '95-100%', color: '#0b7a3b', min: 95, max: 100 },
  { label: '90-95%', color: '#2fb344', min: 90, max: 95 },
  { label: '80-90%', color: '#9bc65f', min: 80, max: 90 },
  { label: '70-80%', color: '#f2d94e', min: 70, max: 80 },
  { label: '50-70%', color: '#f59e0b', min: 50, max: 70 },
  { label: '<50%', color: '#e11d48', min: 0, max: 50 },
];

/** Grey used for "no data" cells. */
export const NO_DATA_COLOR = '#e5e7eb';
export const UNSCORED_COLOR = '#e0e7ff';

/**
 * Map a 0-100 value (or null for "no data") to a performance color.
 */
export const getPerformanceColor = (value: number | null, isUnscored = false): string => {
  if (isUnscored) return UNSCORED_COLOR;
  if (value === null) return NO_DATA_COLOR;

  if (value >= 95) return '#0b7a3b';
  if (value >= 90) return '#2fb344';
  if (value >= 80) return '#9bc65f';
  if (value >= 70) return '#f2d94e';
  if (value >= 50) return '#f59e0b';
  return '#e11d48';
};

/**
 * Return readable text color for a given background performance color,
 * so cell text stays legible on light vs dark backgrounds.
 */
export const getContrastTextColor = (value: number | null, isUnscored = false): string => {
  if (isUnscored) return '#3730a3';
  if (value === null) return '#6b7280';
  if (value >= 80) return '#ffffff';
  if (value >= 50) return '#1f2937';
  return '#ffffff';
};
