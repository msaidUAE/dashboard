'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { after, before, test } = require('node:test');
const { createDashboardServer } = require('./serve-dashboard');

const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'kpi-dashboard-test-'));
const distDirectory = path.join(temporaryDirectory, 'dist');
const liveCsvPath = path.join(
  temporaryDirectory,
  'public',
  'Input',
  'complete_KPIs_Analysis.csv',
);
const server = createDashboardServer(distDirectory);
let baseUrl;

before(async () => {
  fs.mkdirSync(distDirectory, { recursive: true });
  fs.mkdirSync(path.dirname(liveCsvPath), { recursive: true });
  fs.writeFileSync(path.join(distDirectory, 'index.html'), '<main>dashboard</main>');
  fs.writeFileSync(liveCsvPath, 'Date,Lane\n');
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server.listening) {
    await new Promise((resolve, reject) => server.close((error) =>
      error ? reject(error) : resolve(),
    ));
  }
  fs.rmSync(temporaryDirectory, { recursive: true, force: true });
});

test('serves the dashboard home page and SPA routes', async () => {
  const home = await fetch(`${baseUrl}/`);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /dashboard/);

  const route = await fetch(`${baseUrl}/analytics`, {
    headers: { Accept: 'text/html' },
  });
  assert.equal(route.status, 200);
  assert.match(await route.text(), /dashboard/);
});

test('serves fresh KPI snapshots without browser caching', async () => {
  const response = await fetch(`${baseUrl}/Input/complete_KPIs_Analysis.csv`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(await response.text(), 'Date,Lane\n');

  fs.writeFileSync(liveCsvPath, 'Date,Lane\n2026-11-05,Al_Zubair_Lane_3\n');
  const refreshed = await fetch(`${baseUrl}/Input/complete_KPIs_Analysis.csv`);
  assert.equal(await refreshed.text(), 'Date,Lane\n2026-11-05,Al_Zubair_Lane_3\n');
});

test('provides a health check and rejects unsupported methods', async () => {
  const health = await fetch(`${baseUrl}/healthz`);
  assert.deepEqual(await health.json(), { status: 'ok' });

  const post = await fetch(baseUrl, { method: 'POST' });
  assert.equal(post.status, 405);
});

test('returns 404 for missing assets rather than the SPA page', async () => {
  const response = await fetch(`${baseUrl}/assets/missing.js`);
  assert.equal(response.status, 404);
});
