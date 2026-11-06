import { describe, expect, it } from '@jest/globals';
import { KPIRecord, KPIStatus } from '../types';
import {
  aggregateRecords,
  determineStatus,
  extractFilterOptions,
  filterData,
  formatResultValue,
  groupByKPITitle,
  getResultRange,
  isRatioPercentageKPI,
  isSecondsValue,
  parseCSV,
  parseNumericValue,
} from './dataProcessor';
import { createKPICategoryChart } from './chartHelper';

const record = (Actual_Result: string): KPIRecord => ({
  Date: '04112026',
  Lane: 'Al_Dhead_Lane_1_Daily',
  Batch: 'Production daily snapshot',
  KPI_ID: 'SW-07',
  KPI_Title: 'Elapsed time',
  Actual_Result,
  Data_Source: 'MASAR API - Production',
  Confidence: 'HIGH',
  Target: '',
  Pass_Fail: '',
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

  describe('SQL-aligned KPI identity', () => {
    const duplicateTitles: KPIRecord[] = [
      { ...record('1%'), KPI_ID: 'SW-00', KPI_Title: 'Invalid Transaction Rate' },
      { ...record('2%'), KPI_ID: 'SW-12', KPI_Title: 'Invalid Transaction Rate' },
      { ...record('95%'), KPI_ID: 'KPI-D-11', KPI_Title: 'Device Availability' },
    ];

    it('keeps same-titled KPIs distinct in charts and filters', () => {
      const groups = groupByKPITitle(duplicateTitles);
      const options = extractFilterOptions(duplicateTitles).kpiTitles;

      expect(Object.keys(groups)).toContain('SW-00: Invalid Transaction Rate');
      expect(Object.keys(groups)).toContain('SW-12: Invalid Transaction Rate');
      expect(options).toContain('SW-00: Invalid Transaction Rate');
      expect(filterData(duplicateTitles, {
        kpiTitles: ['SW-00: Invalid Transaction Rate'],
      })).toEqual([duplicateTitles[0]]);
    });

    it('classifies hardware SQL IDs independently of their prefixes', () => {
      const chart = createKPICategoryChart(duplicateTitles);

      expect(chart.data.labels).toEqual(['Hardware', 'Software']);
      expect(chart.data.datasets[0].data).toEqual([2, 1]);
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

  it('orders date filter options from newest to oldest chronologically', () => {
    const records = [
      { ...record('1%'), Date: '31102026' },
      { ...record('2%'), Date: '04112026' },
      { ...record('3%'), Date: '05112026' },
    ];

    expect(extractFilterOptions(records).dates).toEqual([
      '05/11/2026',
      '04/11/2026',
      '31/10/2026',
    ]);
  });

  it('parses target and SQL pass/fail fields while remaining compatible with old CSV rows', () => {
    const records = parseCSV([
      'Date,Lane,Batch,KPI_ID,KPI_Title,Actual_Result,Data_Source,Confidence,Target,Pass_Fail',
      '04112026,Lane 1,Daily,HW-01,ANPR Detection Rate,95.01%,API,HIGH,> 95%,PASS',
      '03112026,Lane 1,Old,HW-01,ANPR Detection Rate,95%,API,HIGH',
    ].join('\n'));

    expect(records[0].Target).toBe('> 95%');
    expect(records[0].Pass_Fail).toBe('PASS');
    expect(records[1].Target).toBe('');
    expect(records[1].Pass_Fail).toBe('');
  });

  describe('ratio-only chart eligibility', () => {
    it('includes percentage ratios, including numeric values from percentage KPI IDs', () => {
      expect(isRatioPercentageKPI({
        ...record('97.56'),
        KPI_ID: 'SW-02',
      })).toBe(true);
      expect(isRatioPercentageKPI({
        ...record('85%'),
        KPI_ID: 'LEGACY-RATE',
      })).toBe(true);
    });

    it('excludes time, count, status, and unavailable metrics', () => {
      expect(isRatioPercentageKPI({
        ...record('15.472 sec'),
        KPI_ID: 'SW-13',
        KPI_Title: 'Plaza Processing Time',
      })).toBe(false);
      expect(isRatioPercentageKPI({
        ...record('15.472'),
        KPI_ID: 'SW-13',
        KPI_Title: 'Plaza Processing Time',
      })).toBe(false);
      expect(isRatioPercentageKPI({
        ...record('42'),
        KPI_ID: 'COUNT-01',
      })).toBe(false);
      expect(isRatioPercentageKPI({
        ...record('SUCCESS'),
        KPI_ID: 'CT-01',
      })).toBe(false);
      expect(isRatioPercentageKPI({
        ...record('N/A'),
        KPI_ID: 'SW-02',
      })).toBe(false);
    });
  });
});
