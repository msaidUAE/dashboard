'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { pipeline } = require('node:stream');

const MIME_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.csv', 'text/csv; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

function isWithinDirectory(root, candidate) {
  const relativePath = path.relative(root, candidate);
  return relativePath === '' ||
    (!relativePath.startsWith(`..${path.sep}`) &&
      relativePath !== '..' &&
      !path.isAbsolute(relativePath));
}

function createDashboardServer(distDirectory) {
  const root = path.resolve(distDirectory);
  const indexPath = path.join(root, 'index.html');
  const liveCsvPath = path.resolve(
    root,
    '..',
    'public',
    'Input',
    'complete_KPIs_Analysis.csv',
  );

  return http.createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
      response.writeHead(400).end('Bad Request');
      return;
    }

    if (pathname === '/healthz') {
      response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json; charset=utf-8',
      });
      response.end(request.method === 'HEAD' ? undefined : JSON.stringify({ status: 'ok' }));
      return;
    }

    const isKpiCsv = pathname.toLowerCase() === '/input/complete_kpis_analysis.csv';
    let filePath = isKpiCsv ? liveCsvPath : path.resolve(root, `.${pathname}`);
    if (!isKpiCsv && !isWithinDirectory(root, filePath)) {
      response.writeHead(400).end('Bad Request');
      return;
    }

    try {
      let stat = await fs.promises.stat(filePath);
      if (stat.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
        stat = await fs.promises.stat(filePath);
      }
      if (!stat.isFile()) {
        response.writeHead(404).end('Not Found');
        return;
      }
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') {
        response.writeHead(500).end('Internal Server Error');
        return;
      }

      const acceptsHtml = request.headers.accept?.includes('text/html');
      if (acceptsHtml && path.extname(pathname) === '') {
        filePath = indexPath;
      } else {
        response.writeHead(404).end('Not Found');
        return;
      }
    }

    let stat;
    try {
      stat = await fs.promises.stat(filePath);
      if (!stat.isFile()) {
        response.writeHead(404).end('Not Found');
        return;
      }
    } catch {
      response.writeHead(500).end('Internal Server Error');
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const isHashedAsset = pathname.startsWith('/assets/') &&
      /\.[a-f0-9]{8,}\./i.test(path.basename(pathname));
    response.writeHead(200, {
      'Cache-Control': isKpiCsv
        ? 'no-store'
        : isHashedAsset
          ? 'public, max-age=31536000, immutable'
          : 'no-cache',
      'Content-Length': stat.size,
      'Content-Type': MIME_TYPES.get(extension) || 'application/octet-stream',
    });

    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    pipeline(fs.createReadStream(filePath), response, (error) => {
      if (error && !response.headersSent) {
        response.writeHead(500).end('Internal Server Error');
      } else if (error) {
        response.destroy(error);
      }
    });
  });
}

function main() {
  const distDirectory = path.resolve(__dirname, '..', 'dist');
  if (!fs.existsSync(path.join(distDirectory, 'index.html'))) {
    console.error('Dashboard build is missing. Run "npm run build" before starting the LAN server.');
    process.exitCode = 1;
    return;
  }
  const liveCsvPath = path.resolve(
    __dirname,
    '..',
    'public',
    'Input',
    'complete_KPIs_Analysis.csv',
  );
  if (!fs.existsSync(liveCsvPath)) {
    console.error(`Published KPI CSV is missing: ${liveCsvPath}`);
    process.exitCode = 1;
    return;
  }

  const rawPort = process.env.DASHBOARD_PORT || '4173';
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error('DASHBOARD_PORT must be an integer between 1 and 65535.');
    process.exitCode = 1;
    return;
  }
  const host = process.env.DASHBOARD_HOST || '0.0.0.0';
  const server = createDashboardServer(distDirectory);
  server.on('error', (error) => {
    console.error(`Dashboard server failed: ${error.message}`);
    process.exitCode = 1;
  });
  server.listen(port, host, () => {
    console.log(`Dashboard available at http://192.168.6.115:${port}/`);
    console.log(`Listening on ${host}:${port}; press Ctrl+C to stop.`);
  });

  const shutdown = () => server.close(() => process.exit(0));
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

if (require.main === module) {
  main();
}

module.exports = { createDashboardServer };
