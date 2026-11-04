import { describe, expect, it } from '@jest/globals';
import { KPIRecord, KPIStatus } from '../types';
import {
  aggregateRecords,
  determineStatus,
  formatResultValue,
  getResultRange,
  isSecondsValue,
  parseNumericValue,
} from './dataProcessor';

const record = (Actual_Result: string): KPIRecord => ({
  Date: '04112026',
  Lane: 'Al_Dhead_Lane_1_Daily',
  Batch: 'Production daily snapshot',
  KPI_ID: 'SW-07',
  KPI_Title: 'Elapsed time',
  Actual_Result,
  Data_Source: 'MASAR API - Production',
  Confidence: 'HIGH',
});

describe('elapsed-time KPI handling', () => {
  it('recognizes seconds suffixes and preserves values above 100', () => {
    expect(isSecondsValue('125.5s')).toBe(true);
    expect(isSecondsValue('1,250 seconds')).toBe(true);
    expect(isSecondsValue('98%')).toBe(false);
    expect(parseNumericValue('125.5s')).toBe(125.5);
    expect(parseNumericValue('1,250 seconds')).toBe(1250);
  });

  it('formats and aggregates elapsed-time values with seconds units', () => {
    expect(formatResultValue('125.5s')).toBe('125.5 sec');
    expect(aggregateRecords([record('120s'), record('140s')])).toEqual({
      value: 130,
      display: '130 sec',
      unit: 'seconds',
    });
  });

  it('does not classify seconds as percentage performance', () => {
    expect(getResultRange('125s')).toBe('NOT_APPLICABLE');
    expect(determineStatus('125s')).toBe(KPIStatus.UNSCORED);
  });

  it('preserves percentage scoring behavior', () => {
    expect(formatResultValue('95.50')).toBe('95.5%');
    expect(parseNumericValue('125%')).toBe(100);
    expect(determineStatus('95%')).toBe(KPIStatus.EXCELLENT);
  });
});
