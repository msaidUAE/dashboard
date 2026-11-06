# Dashboard Deployment Runbook

The dashboard supports both company-LAN hosting and public GitHub Pages hosting. It is a client-side React application built into static files; the LAN Node.js server is a separate optional process. GitHub Pages receives the latest published CSV through the hourly workflow described below.

## Build and start

From `Professional-KPI-Analysis-Dashboard`:

```powershell
npm ci
npm run deploy:lan
```

The command builds the static site and starts its HTTP server on `0.0.0.0:4173`. Keep the terminal and host computer running. The dashboard home page is `http://192.168.6.115:4173/`; its health check is `http://192.168.6.115:4173/healthz`.

## Windows Firewall

On the host, run PowerShell as Administrator and allow the server only from the local subnet on the Private profile:

```powershell
New-NetFirewallRule -DisplayName "KPI Dashboard (Company LAN)" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 4173 -Profile Private -RemoteAddress LocalSubnet
```

Verify the host has the expected IPv4 address and test the dashboard from a second device on the company network. Reserve the host address in DHCP if it is dynamically assigned.

## Teams alert link

The **View Dashboard** alert action defaults to `http://192.168.6.115:4173/`. To override it, set `KPI_DASHBOARD_URL` in the environment that starts the automation supervisor.

## GitHub Pages setup

The production dashboard and its CSV are public on the internet. Anyone can view or download the published KPI data. Public release has been approved for this deployment; do not add credentials or other sensitive information to either CSV.

The GitHub repository is `msaidUAE/dashboard`. Its Pages URL is:

```text
https://msaiduae.github.io/dashboard/
```

The Pages build uses `/dashboard/` as its Vite base path; LAN and local builds retain `/`.

### One-time repository setup

1. Configure the repository Actions variable `KPI_CSV_SOURCE_ROOT` as the absolute path to the live dashboard working directory on the runner machine. For example:

   ```text
   C:\Projects\Plaza-Manager\KPIs_TEST_framework\Professional-KPI-Analysis-Dashboard
   ```

   The runner account must be able to read `Input\complete_KPIs_Analysis.csv` and `public\Input\complete_KPIs_Analysis.csv` under this directory.
2. Register a **Windows x64 self-hosted Actions runner** for this repository on the same always-on machine where Production writes the dashboard CSV. Keep it online and use GitHub's default `self-hosted`, `Windows`, and `X64` labels.
3. Push the dashboard source into the repository's `main` branch. The repository must contain this workflow before Actions can run it.
4. In **Settings → Pages**, choose **GitHub Actions** as the build and deployment source.

The workflow runs hourly and on pushes to `main` or manual dispatch. It validates that the source and served CSV copies are identical, stages and commits **only** those two CSV files when they have changed, pushes the commit to `main`, builds with the Pages base path, and deploys the static site. It never stages or pushes other runner-workspace changes. The workflow can also deploy the existing committed CSV when there is no new data.

The runner must remain powered on and connected for hourly CSV synchronization. If it is offline, scheduled runs will wait or fail; LAN hosting remains independent and continues to serve the local CSV.

The workflow pushes CSV-only commits to `main` using `GITHUB_TOKEN`. If branch rules block these pushes, configure the repository ruleset to permit the Actions bot to update the two CSV paths; otherwise the hourly run will fail before deployment.

## Security

GitHub Pages is public for this repository. Do not publish the dashboard or CSV if they contain restricted operational or personal information. The LAN server has no user authentication or TLS and is intended only for the trusted company LAN; do not expose it through port forwarding.

## Verification

```powershell
npm run build
npm run build:pages
npm run test:lan-server
```
