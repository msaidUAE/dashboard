# Company LAN Deployment Runbook

The dashboard is intended for access on the company network, not public hosting.

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

## Security and existing GitHub Pages site

The LAN server has no user authentication or TLS. It is not intended for public internet exposure; do not configure port forwarding. The GitHub Pages deployment workflow has been removed to prevent future automatic public deployments. This code change does not remove a site that may already be published: disable GitHub Pages in the repository settings and remove any existing public site/data there if internal-only access is required.

## Verification

```powershell
npm run build
npm run test:lan-server
```
