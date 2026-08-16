import { KPIRecord, FilterState } from '../types';

/**
 * Parse CSV content to KPI records with proper CSV handling
 */
export const parseCSV = (csvContent: string): KPIRecord[] => {
  const lines = csvContent.trim().split('\n');
  
  const records: KPIRecord[] = lines.slice(1).map((line) => {
    // Properly parse CSV with quoted fields
    const values = parseCSVLine(line);
    
    return {
      Date: values[0]?.trim() || '',
      Lane: values[1]?.trim() || '',
      Batch: values[2]?.trim() || '',
      KPI_ID: values[3]?.trim() || '',
      KPI_Title: values[4]?.trim() || '',
      Actual_Result: values[5]?.trim() || '',
      Data_Source: values[6]?.trim() || '',
      Confidence: values[7]?.trim() || '',
    };
  });

  return records.filter(r => r.Date && r.Lane && r.KPI_Title);
};

/**
 * Properly parse a CSV line handling quoted fields
 */
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
};

/**
 * Extract unique values from dataset for filter options
 */
export const extractFilterOptions = (data: KPIRecord[]) => {
  return {
    dates: Array.from(new Set(data.map(r => r.Date)))
      .sort()
      .map(d => formatDate(d)),
    lanes: Array.from(new Set(data.map(r => r.Lane))).sort(),
    kpiTitles: Array.from(new Set(data.map(r => r.KPI_Title)))
      .filter(k => k && k !== 'NO_DATA_AVAILABLE')
      .sort(),
    actualResultRanges: [
      'Between 95 - 100',
      'Between 90 - 95',
      'Between 80 - 90',
      'Between 70 - 80',
      'Between 50 - 70',
      'Below 50'
    ],
  };
};

/**
 * Get result range category
 */
export const getResultRange = (value: string): string => {
  if (value === 'NO_DATA_AVAILABLE' || value === '') return 'NO_DATA';
  
  const num = parseNumericValue(value);
  if (num >= 95) return 'Between 95 - 100';
  if (num >= 90) return 'Between 90 - 95';
  if (num >= 80) return 'Between 80 - 90';
  if (num >= 70) return 'Between 70 - 80';
  if (num >= 50) return 'Between 50 - 70';
  return 'Below 50';
};

/**
 * Determine KPI status based on actual result
 */
export const determineStatus = (actualResult: string): string => {
  if (actualResult === 'NO_DATA_AVAILABLE' || actualResult === '') {
    return 'NO_DATA';
  }

  const numValue = parseFloat(actualResult.replace('%', ''));
  if (isNaN(numValue)) {
    return 'GOOD';
  }

  if (numValue >= 90) return 'EXCELLENT';
  if (numValue >= 75) return 'GOOD';
  if (numValue >= 50) return 'WARNING';
  return 'CRITICAL';
};

/**
 * Apply AND operator filters to data
 */
export const filterData = (
  data: KPIRecord[],
  filters: Partial<FilterState>
): KPIRecord[] => {
  return data.filter((record) => {
    // AND operator: ALL selected filters must match
    if (filters.dates?.length && !filters.dates.includes(formatDate(record.Date))) {
      return false;
    }
    if (filters.lanes?.length && !filters.lanes.includes(record.Lane)) {
      return false;
    }
    if (filters.kpiTitles?.length && !filters.kpiTitles.includes(record.KPI_Title)) {
      return false;
    }

    // Result range filter
    if (filters.actualResultRanges?.length) {
      const range = getResultRange(record.Actual_Result);
      if (!filters.actualResultRanges.includes(range)) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Parse numeric value from result string
 * Handles percentages, seconds, and other numeric formats
 */
export const parseNumericValue = (value: string): number => {
  if (!value || value === 'NO_DATA_AVAILABLE' || value === 'N/A') {
    return 0;
  }

  // Remove common suffixes
  let cleanValue = value
    .replace('%', '')
    .replace('sec', '')
    .replace('seconds', '')
    .trim();

  // Parse the numeric value
  const num = parseFloat(cleanValue);

  // Return 0 if not a valid number
  if (isNaN(num)) {
    return 0;
  }

  // Ensure percentage values are within 0-100
  if (num > 100) {
    return 100;
  }

  // Return negative numbers as 0 (sometimes we get negative values)
  if (num < 0) {
    return 0;
  }

  return num;
};

/**
 * Convert date format DDMMYYYY to readable format
 */
export const formatDate = (dateStr: string): string => {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  const day = dateStr.substring(0, 2);
  const month = dateStr.substring(2, 4);
  const year = dateStr.substring(4, 8);
  return `${day}/${month}/${year}`;
};

/**
 * Group data by KPI Title
 */
export const groupByKPITitle = (data: KPIRecord[]) => {
  const grouped: { [key: string]: KPIRecord[] } = {};
  data.forEach((record) => {
    if (!grouped[record.KPI_Title]) {
      grouped[record.KPI_Title] = [];
    }
    grouped[record.KPI_Title].push(record);
  });
  return grouped;
};

/**
 * Group data by Lane
 */
export const groupByLane = (data: KPIRecord[]) => {
  const grouped: { [key: string]: KPIRecord[] } = {};
  data.forEach((record) => {
    if (!grouped[record.Lane]) {
      grouped[record.Lane] = [];
    }
    grouped[record.Lane].push(record);
  });
  return grouped;
};

/**
 * Group data by Date
 */
export const groupByDate = (data: KPIRecord[]) => {
  const grouped: { [key: string]: KPIRecord[] } = {};
  data.forEach((record) => {
    if (!grouped[record.Date]) {
      grouped[record.Date] = [];
    }
    grouped[record.Date].push(record);
  });
  return grouped;
};
