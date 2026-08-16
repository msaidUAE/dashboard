# Project Structure Overview

## Complete Directory Layout

```
KPIs_Analysis_Website/
│
├── 📁 Input/
│   └── complete_KPIs_Analysis.csv          # Source data file
│
├── 📁 public/
│   ├── index.html                          # Main HTML entry point
│   └── Input/
│       └── complete_KPIs_Analysis.csv      # CSV for serving
│
├── 📁 src/
│   │
│   ├── 📁 components/                      # React components
│   │   ├── FilterPanel.tsx                 # Multi-criteria filter UI
│   │   ├── ChartGrid.tsx                   # Chart rendering container
│   │   ├── DashboardStats.tsx              # Statistics cards
│   │   └── DataTable.tsx                   # Sortable data table
│   │
│   ├── 📁 utils/                           # Utility functions
│   │   ├── dataProcessor.ts                # CSV parsing & data manipulation
│   │   └── chartHelper.ts                  # Chart generation logic
│   │
│   ├── 📁 types/                           # TypeScript definitions
│   │   └── index.ts                        # All interfaces & enums
│   │
│   ├── 📁 styles/                          # Component styles
│   │   ├── index.css                       # Global styles
│   │   ├── App.css                         # Main layout
│   │   ├── FilterPanel.css                 # Filter UI
│   │   ├── ChartGrid.css                   # Chart grid
│   │   ├── DashboardStats.css              # Statistics
│   │   └── DataTable.css                   # Table styles
│   │
│   ├── App.tsx                             # Main component
│   └── index.tsx                           # React entry point
│
├── 📄 package.json                         # Dependencies & scripts
├── 📄 tsconfig.json                        # TypeScript config
├── 📄 tsconfig.node.json                   # TS config for tools
├── 📄 vite.config.ts                       # Build tool config
├── 📄 .gitignore                           # Git ignore rules
│
├── 📖 README.md                            # User documentation
├── 📖 IMPLEMENTATION_GUIDE.md              # Technical guide
└── 📖 PROJECT_STRUCTURE.md                 # This file


## Component Hierarchy

```
App (Main Container)
│
├── DashboardStats (KPI Overview Cards)
│   ├── Stat Card 1: Total Records
│   ├── Stat Card 2: Unique Lanes
│   ├── Stat Card 3: KPI Indicators
│   ├── Stat Card 4: Date Range
│   └── Filter Info Banner
│
├── View Toggle (Charts ↔ Table)
│
├── Sidebar
│   └── FilterPanel
│       ├── Dates Filter
│       ├── Lanes Filter
│       ├── KPI Titles Filter
│       ├── Status Filter
│       ├── Results Filter
│       └── Filter Info Note
│
└── Main Content
    ├── ChartGrid (Rendered based on view toggle)
    │   ├── Line Chart: Time Series Trend
    │   ├── Doughnut Chart: Status Distribution
    │   ├── Bar Chart: Lane Comparison
    │   ├── Pie Chart: Category Distribution
    │   └── Bar Chart: KPI Performance
    │
    └── DataTable (Alternative view)
        ├── Table Header
        ├── Sortable Column Headers
        ├── Data Rows with Status
        └── Pagination Controls
```

## Data Processing Pipeline

```
CSV File
   ↓
parseCSV()
   ↓ (KPIRecord[])
extractFilterOptions()
   ↓ (FilterOptions)
   ├→ filterData()
   │    ├ AND operator logic
   │    └ Status determination
   │       ↓
   │    Filtered Records
   │       ↓
   │    ├→ createTimeSeriesChart()
   │    ├→ createStatusDistributionChart()
   │    ├→ createLaneComparisonChart()
   │    ├→ createKPICategoryChart()
   │    └→ createKPIPerformanceChart()
   │       ↓
   │    ChartConfig[]
   │       ↓
   │    ChartGrid Rendering
   │
   ├→ DashboardStats calculation
   └→ DataTable display
```

## File Dependencies

### App.tsx Dependencies
- React
- Types (KPIRecord, FilterState, ChartConfig)
- Components (FilterPanel, ChartGrid, DashboardStats, DataTable)
- Utils (dataProcessor, chartHelper)

### FilterPanel.tsx Dependencies
- React
- Types (FilterState, KPIRecord)
- Styles (FilterPanel.css)

### ChartGrid.tsx Dependencies
- React
- chart.js and react-chartjs-2
- Types (ChartConfig)
- Styles (ChartGrid.css)

### DataTable.tsx Dependencies
- React
- Types (KPIRecord, KPIStatus)
- Utils (dataProcessor)
- Styles (DataTable.css)

### dataProcessor.ts Dependencies
- Types (KPIRecord, FilterState, KPIStatus)
- No external dependencies (pure functions)

### chartHelper.ts Dependencies
- Types (KPIRecord, ChartConfig)
- dataProcessor utilities
- No external dependencies

## State Management Flow

```
App.tsx (Main State Container)
│
├── allData: KPIRecord[]              (All loaded records)
├── filteredData: KPIRecord[]         (After filter application)
├── filters: Partial<FilterState>    (Current filter selections)
├── filterOptions: FilterOptions     (Available filter values)
├── stats: DashboardStats            (Calculated metrics)
├── charts: ChartConfig[]            (Generated charts)
├── isLoading: boolean               (Loading state)
└── showTable: boolean               (View mode)

↓ (Props passed down)

FilterPanel
├── filterOptions (read-only)
├── onFilterChange (callback)
└── currentFilters (read-only)

ChartGrid
├── charts (read-only)
└── isLoading (read-only)

DashboardStats
├── stats (read-only)
├── filteredCount (read-only)
└── totalCount (read-only)

DataTable
└── data (read-only)
```

## Key Features Location Map

| Feature | Component | Utility |
|---------|-----------|---------|
| CSV Parsing | - | dataProcessor.ts |
| AND Filter Logic | FilterPanel.tsx | dataProcessor.ts |
| Status Determination | - | dataProcessor.ts |
| Chart Selection | ChartGrid.tsx | chartHelper.ts |
| Time Series | - | chartHelper.ts |
| Status Distribution | - | chartHelper.ts |
| Lane Comparison | - | chartHelper.ts |
| Category Distribution | - | chartHelper.ts |
| Performance Matrix | - | chartHelper.ts |
| Responsive Design | All | *.css |
| Sorting | DataTable.tsx | - |
| Pagination | DataTable.tsx | - |
| Date Formatting | - | dataProcessor.ts |
| Numeric Parsing | - | dataProcessor.ts |
| Data Grouping | - | dataProcessor.ts |

## Styling Architecture

```
Global Styles (index.css)
├── CSS Reset & Variables
├── Animations (@keyframes)
├── Scrollbar Styling
└── Utility Classes

Component Styles
├── App.css
│   ├── Header styling
│   ├── Layout grid
│   ├── View toggle
│   └── Footer
├── FilterPanel.css
│   ├── Filter sections
│   ├── Checkbox styling
│   └── Responsive
├── ChartGrid.css
│   ├── Grid layout
│   ├── Chart containers
│   └── Loading/Empty states
├── DashboardStats.css
│   ├── Stat cards
│   ├── Gradients
│   └── Animations
└── DataTable.css
    ├── Table styling
    ├── Status badges
    ├── Pagination
    └── Scrolling

Responsive Breakpoints
├── Desktop: 1024px+
├── Tablet: 768px - 1023px
└── Mobile: < 768px
```

## Configuration Files

### package.json
- Project metadata
- Dependencies (React, Chart.js, etc.)
- Dev dependencies (TypeScript, React Scripts)
- Scripts (start, build, test)

### tsconfig.json
- TypeScript compiler options
- Target: ES2020
- Module: ESNext
- Strict mode enabled

### vite.config.ts
- Build tool configuration
- Dev server settings
- Production optimization

### .gitignore
- Excludes node_modules
- Excludes build artifacts
- Excludes IDE files
- Excludes environment files

## Build & Deployment

### Development
```bash
npm install
npm start
# Opens on http://localhost:3000
```

### Production Build
```bash
npm run build
# Creates optimized build in dist/
```

### Serving Built App
- Copy dist/ contents to web server
- Place CSV in public/Input/
- No backend required (static hosting)

## Performance Considerations

### Optimizations
- Efficient data filtering with early exit
- Memoized chart generation
- Responsive CSS with media queries
- Lazy-loaded chart rendering
- CSS Grid vs Flexbox optimization

### Scalability
- Handles datasets with 1000+ records
- Pagination limits UI rendering
- Grouping functions for aggregation
- Memory-efficient filtering

## Security Considerations

- Client-side only processing (no backend exposure)
- CSV file served as static asset
- No sensitive data transmission
- Input validation in parser
- Type safety with TypeScript

---

**Version**: 1.0.0  
**Last Updated**: August 2026  
**Total Files**: 30+  
**Lines of Code**: ~3000+
