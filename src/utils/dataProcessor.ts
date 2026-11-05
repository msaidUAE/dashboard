import { KPIRecord, FilterState, KPIStatus } from '../types';

/**
 * Lane names are normalized so that the raw `Al_Zubair_Lane_3_h` record
 * (a single-day duplicate of `Al_Zubair_Lane_3` in the source CSV) maps onto
 * the canonical lane. This keeps the dashboard at the 6 defined lanes while
 * preserving all 1403 source records.
 */
const normalizeLane = (lane: string): string => {
  return lane.replace(/_h$/, '');
};

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
      Lane: normalizeLane(values[1]?.trim() || ''),
      Batch: values[2]?.trim() || '',
      KPI_ID: values[3]?.trim() || '',
      KPI_Title: values[4]?.trim() || '',
      Actual_Result: values[5]?.trim() || '',
      Data_Source: values[6]?.trim() || '',
      Confidence: values[7]?.trim() || '',
    };
  });

  return records.filter((r) => r.Date && r.Lane && r.KPI_Title);
};

export const getKPIKey = (record: KPIRecord): string =>
  record.KPI_ID ? `${record.KPI_ID}: ${record.KPI_Title}` : record.KPI_Title;

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

/** The six result-range buckets, ordered high → low. */
export const RESULT_RANGES: string[] = [
  '95-100%',
  '90-95%',
  '80-90%',
  '70-80%',
  '50-70%',
  '<50%',
];

/**
 * Extract unique values from dataset for filter options
 */
export const extractFilterOptions = (data: KPIRecord[]) => {
  return {
    dates: sortDatesChronologically(
      Array.from(new Set(data.map((r) => r.Date)))
    ).map((d) => formatDate(d)),
    lanes: Array.from(new Set(data.map((r) => r.Lane))).sort(),
    kpiTitles: Array.from(new Set(data.map(getKPIKey)))
      .filter((k) => k && k !== 'NO_DATA_AVAILABLE')
      .sort(),
    actualResultRanges: RESULT_RANGES,
  };
};

/**
 * Determine whether a raw result string represents "no data".
 */
export const isNoData = (value: string): boolean => {
  if (!value) return true;
  const v = value.trim().toUpperCase();
  return (
    v === '' ||
    v === 'N/A' ||
    v === 'NA' ||
    v === 'NO_DATA' ||
    v === 'NO_DATA_AVAILABLE' ||
    v === 'NOT_AVAILABLE'
  );
};

/** Detect numeric results explicitly reported in seconds. */
export const isSecondsValue = (value: string): boolean =>
  /^\s*[-+]?(?:(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d*)?|\.\d+)\s*(?:s|sec(?:onds)?)\s*$/i.test(value);

/**
 * Parse the numeric portion of a result while preserving elapsed seconds.
 */
export const parseNumericValue = (value: string): number => {
  if (isNoData(value)) {
    return 0;
  }

  const trimmed = value.trim();

  // Status strings: a "SUCCESS" state is treated as fully achieved (100%).
  if (trimmed.toUpperCase() === 'SUCCESS') {
    return 100;
  }

  // Remove common suffixes and thousands separators.
  const isSeconds = isSecondsValue(trimmed);
  const cleanValue = trimmed
    .replace(/%/g, '')
    .replace(/(?:seconds?|sec|s)\s*$/i, '')
    .replace(/,/g, '')
    .trim();

  const num = parseFloat(cleanValue);

  if (isNaN(num)) {
    return 0;
  }

  // Percent-style metrics use a 0-100 scale; elapsed time does not.
  if (!isSeconds && num > 100) {
    return 100;
  }

  if (!isSeconds && num < 0) {
    return 0;
  }

  return num;
};

/**
 * Format a number with up to two decimals, trimming trailing zeros.
 */
const formatNumber = (value: number): string => {
  if (Number.isInteger(value)) return String(value);
  const rounded = Math.round(value * 100) / 100;
  return String(rounded);
};

/**
 * Return a professional, unit-aware display string for a raw result.
 */
export const formatResultValue = (value: string): string => {
  if (isNoData(value)) return 'N/A';

  const trimmed = value.trim();
  if (trimmed.toUpperCase() === 'SUCCESS') return 'SUCCESS';

  const hasSeconds = isSecondsValue(trimmed);

  const clean = trimmed
    .replace(/%/g, '')
    .replace(/(?:seconds?|sec|s)\s*$/i, '')
    .replace(/,/g, '')
    .trim();
  const num = parseFloat(clean);

  if (isNaN(num)) return trimmed;

  if (hasSeconds) return `${formatNumber(num)} sec`;
  // Percentages (with or without an explicit "%" suffix) use "%".
  return `${formatNumber(num)}%`;
};

/**
 * Aggregate a set of records (same lane + KPI + date) into a single
 * value/display pair. Multiple batches are averaged; no-data is represented
 * as null so it can be rendered distinctly from a genuine 0%.
 */
export const aggregateRecords = (
  records: KPIRecord[]
): { value: number | null; display: string; unit: 'seconds' | 'percentage' | 'status' | 'none' } => {
  const valid = records.filter((r) => !isNoData(r.Actual_Result));

  if (valid.length === 0) {
    return { value: null, display: 'N/A', unit: 'none' };
  }

  const sum = valid.reduce(
    (acc, r) => acc + parseNumericValue(r.Actual_Result),
    0
  );
  const average = sum / valid.length;

  // Pick a representative unit from the first valid record.
  const sample = valid[0].Actual_Result;
  const hasSeconds = isSecondsValue(sample);
  const isSuccess = sample.trim().toUpperCase() === 'SUCCESS';

  let display: string;
  let unit: 'seconds' | 'percentage' | 'status';
  if (isSuccess) {
    display = 'SUCCESS';
    unit = 'status';
  } else if (hasSeconds) {
    display = `${formatNumber(average)} sec`;
    unit = 'seconds';
  } else {
    display = `${formatNumber(average)}%`;
    unit = 'percentage';
  }

  return { value: average, display, unit };
};

/**
 * Get result range category
 */
export const getResultRange = (value: string): string => {
  if (isNoData(value)) return 'NO_DATA';
  if (isSecondsValue(value)) return 'NOT_APPLICABLE';

  const num = parseNumericValue(value);
  if (num >= 95) return '95-100%';
  if (num >= 90) return '90-95%';
  if (num >= 80) return '80-90%';
  if (num >= 70) return '70-80%';
  if (num >= 50) return '50-70%';
  return '<50%';
};

/**
 * Determine KPI status based on actual result
 */
export const determineStatus = (actualResult: string): KPIStatus => {
  if (isNoData(actualResult)) {
    return KPIStatus.NO_DATA;
  }
  if (isSecondsValue(actualResult)) {
    return KPIStatus.UNSCORED;
  }

  const numValue = parseNumericValue(actualResult);

  if (numValue >= 90) return KPIStatus.EXCELLENT;
  if (numValue >= 75) return KPIStatus.GOOD;
  if (numValue >= 50) return KPIStatus.WARNING;
  return KPIStatus.CRITICAL;
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
    if (filters.kpiTitles?.length && !filters.kpiTitles.includes(getKPIKey(record))) {
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
 * Sort DDMMYYYY date strings in true chronological order
 * (string sort breaks across month boundaries).
 */
export const sortDatesChronologically = (dates: string[]): string[] => {
  return [...dates].sort((a, b) => {
    const key = (d: string) =>
      d.length === 8 ? `${d.substring(4, 8)}${d.substring(2, 4)}${d.substring(0, 2)}` : d;
    return key(a).localeCompare(key(b));
  });
};

/**
 * Group data by KPI ID and title so same-titled KPIs remain distinct.
 */
export const groupByKPITitle = (data: KPIRecord[]) => {
  const grouped: { [key: string]: KPIRecord[] } = {};
  data.forEach((record) => {
    const key = getKPIKey(record);
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(record);
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
