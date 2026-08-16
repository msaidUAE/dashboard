# Professional KPI Dashboard Implementation Prompt

## SITUATION
You are a Senior Frontend Developer tasked with implementing a professional KPI Analysis Dashboard in React 18 + TypeScript. The application must load and visualize real data from `Input/complete_KPIs_Analysis.csv` containing 1403+ transportation KPI records across 6 lanes, 23 metrics, and 21 dates.

## CORE OBJECTIVES

### 1. Dynamic Filter System (AND Logic)
Extract unique values from CSV and populate 4 filter dimensions:
- **Lanes**: 6 unique values (Al_Dhead_Lane_1_Daily, Al_Dhead_Lane_2_Daily, Al_Dhead_Lane_3_Daily, Al_Madam_Lane_3, Al_Zubair_Lane_3, Al_Zubair_Lane_4)
- **KPI Titles**: 23 unique metrics (ANPR Detection Rate, System Availability, etc.)
- **Dates**: 21 unique dates (formatted DD/MM/YYYY from DDMMYYYY)
- **Result Ranges**: 6 auto-categorized ranges (95-100%, 90-95%, 80-90%, 70-80%, 50-70%, <50%)

Filters use AND operator logic: only records matching ALL selected criteria display.

### 2. Three Tab-Based Visualization Views

**View 1: "By Lane" (Default)**
- Display 6 vertical bar charts (one per lane)
- X-axis: All 23 KPI titles
- Y-axis: Actual result values (0-100%)
- Real data, color-coded by performance

**View 2: "By KPI Heatmap"**
- Display 23 heatmap cards in responsive grid (one per KPI)
- Each card: 6 lanes × 21 dates grid
- Color-coded: Dark Green (95-100%) → Red (<50%)
- Hover tooltips showing exact values

**View 3: "By Date Trends"**
- Display 23 line charts stacked vertically (one per KPI)
- Each chart: 6 multi-line trends (one per lane)
- X-axis: Dates (chronological)
- Y-axis: Performance 0-100%
- Hover tooltips with lane/date/value

## CRITICAL PROBLEMS TO SOLVE

### Problem 1: Charts Show No Real Data ❌
**Current State**: Charts render empty with no actual values from CSV  
**Required**: All 52 charts must display real data from 1403+ records  
**Fix**: Verify complete data pipeline: CSV → parse → state → components → Chart.js

### Problem 2: Filters Not Showing Real Data ❌
**Current State**: Filter sections don't populate with CSV unique values  
**Required**: All 4 filter dimensions must show real data extracted from CSV  
**Fix**: Implement extractFilterOptions() function, dynamically populate filter UI

### Problem 3: Filters Don't Control Charts ❌
**Current State**: Selecting filters doesn't update visualizations  
**Required**: Charts must update in real-time when filters change (AND logic)  
**Fix**: Implement filterData() function, connect filter state to chart data

### Problem 4: Wrong Visualization Implementation ❌
**Current State**: Existing charts don't match specifications  
**Required**: Implement exactly 3 views (Lane, KPI, Date) with specified layouts  
**Fix**: Build correct chart components with proper data grouping

### Problem 5: Labels/Values Not Professional ❌
**Current State**: Chart labels show CSS classes or raw values  
**Required**: Display real lane names, KPI titles, formatted values with units  
**Fix**: Add proper label formatting, tooltips, and professional styling

## IMPLEMENTATION REQUIREMENTS

**Data Processing**:
- Parse CSV with proper quote handling
- Extract numeric values (handle "%, sec" suffixes)
- Auto-categorize result ranges
- NO hardcoded data—all from CSV dynamically

**Chart Configuration**:
- Professional color scheme: Green (high) → Red (low)
- Responsive layout on all screen sizes
- Real-time updates on filter changes
- Hover tooltips with formatted values

**Success Criteria**:
1. CSV loads: 1403+ records display in charts
2. Filters show 6 lanes, 23 KPIs, 21 dates, 6 ranges
3. AND logic: Only matching records visible
4. By Lane view: 6 bar charts with real data
5. By KPI view: 23 heatmaps with real data
6. By Date view: 23 line charts with real data
7. Charts update when filters change
8. Professional labels (no CSS classes)
9. Values formatted with units (%)
10. No console errors

## DELIVERABLE
A complete, fully-functional KPI dashboard meeting all criteria above with production-ready code, professional UI/UX, and real data visualization.
