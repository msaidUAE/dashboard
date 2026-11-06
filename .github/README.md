# GitHub Actions and Pages

The dashboard supports both company-LAN hosting and public GitHub Pages deployment. GitHub Pages serves the built static site and the most recently synchronized KPI CSV; it does not read the LAN server's filesystem directly.

## Hourly Pages deployment

Workflow: [deploy-pages.yml](./workflows/deploy-pages.yml)

- Runs hourly, on pushes to `main`, and when manually dispatched.
- Uses a Windows x64 self-hosted runner on the machine that produces the current KPI CSV.
- Reads `Input\complete_KPIs_Analysis.csv` and `public\Input\complete_KPIs_Analysis.csv` from the repository variable `KPI_CSV_SOURCE_ROOT`.
- Verifies the two CSV files match, stages and commits only those files when changed, pushes the update to `main`, then builds and deploys Pages.
- Builds with `/Professional-KPI-Analysis-Dashboard/` as the Vite base path; LAN builds keep `/`.

The target repository is `msaidUAE/dashboard`; its Pages URL is `https://msaiduae.github.io/dashboard/`. The repository and deployed KPI data are public.

## One-time setup

1. Add the Actions repository variable `KPI_CSV_SOURCE_ROOT` with the absolute path to the live dashboard working directory on the runner machine.
2. Register and start a Windows x64 self-hosted runner for the repository using the default labels `self-hosted`, `Windows`, and `X64`.
3. Push the dashboard source to the repository's `main` branch.
4. In repository **Settings → Pages**, select **GitHub Actions** as the deployment source.
5. Review the **Actions** tab and verify the hourly workflow completes successfully.

Keep the runner online for hourly CSV synchronization. Public Pages exposes every published CSV row; do not include sensitive data.

## Validation workflow

[validate.yml](./workflows/validate.yml) checks pull requests targeting `main` or `master` and pushes to `develop`.

For local checks:

```powershell
npm test -- --runTestsByPath src/utils/dataProcessor.test.ts
npm run build
npm run build:pages
npm run test:lan-server
```

See the [deployment runbook](./DEPLOYMENT_RUNBOOK.md) for LAN hosting and Pages setup details.
