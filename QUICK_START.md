# Quick Start Guide - KPI Analysis Dashboard

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

This installs all required packages:
- React 18
- TypeScript 5
- Chart.js 4
- Date manipulation utilities

### Step 2: Prepare CSV Data
Ensure your CSV file is in the correct location:
```
KPIs_Analysis_Website/
└── public/
    └── Input/
        └── complete_KPIs_Analysis.csv
```

The CSV should have columns:
- Date (DDMMYYYY format)
- Lane
- Batch
- KPI_ID
- KPI_Title
- Actual_Result
- Data_Source
- Confidence

### Step 3: Start Development Server
```bash
npm start
```

The application opens automatically at `http://localhost:3000`

### Step 4: Verify Data Loading
1. Check that the sidebar shows filter options
2. Verify 5 charts appear in the main area
3. Confirm statistics cards display values

## Essential Features

### Using Filters (AND Operator)

**Example Workflow**:
1. Select a Date in the "Dates" filter
2. Select a Lane in the "Lanes" filter
3. Select a Status in the "Status" filter
4. Charts update to show only records matching ALL three filters

**Result**: Shows KPIs from the selected date AND lane AND with the selected status

### Switching Views

**Charts View** (Default):
- 5 different chart types
- Responsive grid layout
- Real-time updates

**Table View**:
- Sortable columns
- Pagination
- Status indicators
- Detailed record view

Click the toggle buttons near the top of the main content area.

### Reading the Charts

1. **Time Series (Line Chart)**: Shows KPI trend over selected time period
2. **Status Distribution (Doughnut)**: Breakdown of Excellent/Good/Warning/Critical
3. **Lane Comparison (Bar)**: Performance comparison between lanes
4. **Category Distribution (Pie)**: Hardware/Software/Central/Compliance split
5. **KPI Performance (Bar)**: Individual KPI average scores

## Common Tasks

### Clear All Filters
Click the **"Clear All Filters"** button at the top of the filter panel

### Reset to Default View
Refresh the page (F5 or ⌘R)

### Export Data
1. Switch to Table View
2. Use browser's "Print to PDF" (Ctrl+P or ⌘P)
3. Or manually copy table data

### Find Specific Record
1. Use Date filter for date range
2. Use Lane filter for location
3. Use KPI Title filter for metric
4. Switch to Table View and sort by clicking column headers

## Troubleshooting

### Charts Not Showing
**Problem**: Empty chart area with "No data available"
**Solution**: 
1. Check CSV file exists at `public/Input/complete_KPIs_Analysis.csv`
2. Verify CSV format matches expected columns
3. Open browser console (F12) for error messages

### Filters Not Working
**Problem**: Selections don't update charts
**Solution**:
1. Ensure at least one value is selected in a filter
2. Try clearing and reselecting filters
3. Refresh the page

### Page Loading Slowly
**Problem**: Takes long to load or display charts
**Solution**:
1. Check CSV file size (if >5MB, may be slow)
2. Close other browser tabs/applications
3. Clear browser cache (Ctrl+Shift+Delete)

### CSV Not Loading
**Problem**: Error message about missing file
**Solution**:
1. Verify correct file path: `/public/Input/complete_KPIs_Analysis.csv`
2. Check file isn't corrupted (open in text editor)
3. Ensure no special characters in filename

## Development Mode Features

### Hot Reload
- Changes to code automatically reload (if running `npm start`)
- No need to manually refresh

### Error Overlay
- Compilation errors display in browser
- Provides helpful error messages

### React DevTools
- Install [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- Inspect component tree
- Debug component props and state

## Building for Production

### Create Optimized Build
```bash
npm run build
```

Creates a `dist/` folder with optimized files ready for deployment.

### Deploy to Web Server
1. Copy contents of `dist/` to web server
2. Ensure `public/Input/complete_KPIs_Analysis.csv` is accessible
3. Most services: Netlify, Vercel, GitHub Pages, AWS S3, etc. supported

## Performance Tips

### For Large Datasets (>10,000 records)
1. Use date filters to reduce data size
2. Use lane filters to scope analysis
3. Filter by status to focus on problematic areas

### For Better Performance
1. Clear browser cache occasionally
2. Close unused browser tabs
3. Use a modern browser (Chrome, Firefox, Safari, Edge)
4. Consider splitting data into time periods

## Next Steps

1. **Explore All Charts**: Click through each chart to understand data patterns
2. **Try Different Filters**: Combine filters to discover insights
3. **Switch Between Views**: Compare table and chart perspectives
4. **Check Documentation**: Read README.md for detailed feature information
5. **Review Code**: Check IMPLEMENTATION_GUIDE.md for technical details

## Support Resources

- **README.md**: Comprehensive feature documentation
- **IMPLEMENTATION_GUIDE.md**: Technical architecture and details
- **PROJECT_STRUCTURE.md**: File organization and dependencies
- **Browser Console**: Press F12 for error messages and debugging

## Key Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Developer Tools | F12 |
| Print / Save PDF | Ctrl+P (Cmd+P on Mac) |
| Search on Page | Ctrl+F (Cmd+F on Mac) |
| Refresh Page | F5 or Ctrl+R |
| Clear Cache & Reload | Ctrl+Shift+R |
| Select All | Ctrl+A |
| Copy | Ctrl+C |

## Common Questions

**Q: Can I modify the CSV data?**
A: Yes, edit the CSV file and refresh the browser page.

**Q: Are filters saved when I refresh?**
A: No, filters reset on page refresh. (Future feature: saving preferences)

**Q: Can multiple users access simultaneously?**
A: Yes, it's a static web app - no server limits on concurrent users.

**Q: What if I have 100+ lanes?**
A: All appear in filter, but scrollable. Consider data segmentation.

**Q: Can I export data?**
A: Not built-in, but you can use "Print to PDF" or copy table data.

**Q: Is my data secure?**
A: Data stays in browser, never sent to servers. 100% private.

**Q: Can I use this offline?**
A: After loading page once, minimal cache allows offline browsing.

---

**Ready to get started?** Run `npm install && npm start` and explore your KPI data!
