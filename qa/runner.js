'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

function validateTarget(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('Provide a valid absolute --url (http:// or https://).'); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only http:// and https:// targets are supported.');
  if (url.username || url.password) throw new Error('Do not put credentials in the target URL.');
  return url;
}

function safeName(value) {
  return value.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').slice(0, 70) || 'page';
}

async function runBrowserAudit(options) {
  const target = validateTarget(options.url);
  const workers = Math.max(1, Math.min(3, Number(options.workers) || 2));
  const browserPersonaCount = Math.max(1, Math.min(100, Number(options.browserPersonas) || 3));
  const maxPages = Math.max(1, Math.min(20, Number(options.maxPages) || 10));
  const outputDir = path.resolve(options.output || path.join('reports', 'qa', new Date().toISOString().replace(/[:.]/g, '-')));
  fs.mkdirSync(path.join(outputDir, 'evidence'), { recursive: true });

  let playwright;
  try {
    const projectRequire = createRequire(path.join(process.cwd(), 'package.json'));
    playwright = projectRequire('playwright');
  } catch {
    throw new Error('Playwright is not installed in the target project. Install it with: npm install -D playwright && npx playwright install chromium');
  }

  const browser = await playwright.chromium.launch({ headless: true });
  const results = [];
  const profiles = Array.isArray(options.personas) ? options.personas : [];
  const consoleErrors = [];
  const pageErrors = [];
  const networkFailures = [];
  let discovered = [];
  try {
    const discovery = await browser.newPage();
    discovery.on('console', message => { if (message.type() === 'error') consoleErrors.push({ url: discovery.url(), message: message.text() }); });
    discovery.on('pageerror', error => pageErrors.push({ url: discovery.url(), message: error.message }));
    discovery.on('requestfailed', request => networkFailures.push({ url: request.url(), error: request.failure()?.errorText || 'request failed' }));
    const response = await discovery.goto(target.href, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const rootStatus = response?.status() ?? null;
    const rootTitle = await discovery.title().catch(() => '');
    const links = await discovery.locator('a[href]').evaluateAll(nodes => nodes.map(node => node.href));
    const sameOrigin = [...new Set(links.filter(href => {
      try { return new URL(href).origin === location.origin; } catch { return false; }
    }))];
    discovered = [target.href, ...sameOrigin].slice(0, maxPages);
    await discovery.screenshot({ path: path.join(outputDir, 'evidence', 'discovery-home.png'), fullPage: true }).catch(() => {});
    results.push({ id: 'DISCOVERY', url: target.href, status: rootStatus, title: rootTitle, outcome: rootStatus && rootStatus < 400 ? 'pass' : 'fail', note: 'Initial page and same-origin links discovered' });
    await discovery.close();

    let next = 0;
    async function worker(workerId) {
      while (true) {
        const index = next++;
        if (index >= browserPersonaCount) return;
        const persona = profiles[index] || { id: 'BROWSER-' + String(index + 1).padStart(3, '0'), role: 'exploratory visitor', goal: 'explore visible pages', device: 'desktop-1440', constraint: 'none', journey: 'explore then act' };
        const personaId = persona.id || 'BROWSER-' + String(index + 1).padStart(3, '0');
        const viewports = {
          'desktop-1440': { width: 1440, height: 900 },
          'laptop-1280': { width: 1280, height: 800 },
          'tablet-768': { width: 768, height: 1024 },
          'mobile-390': { width: 390, height: 844 },
          'mobile-360': { width: 360, height: 800 }
        };
        const context = await browser.newContext({
          viewport: viewports[persona.device] || viewports['desktop-1440'],
          reducedMotion: persona.constraint === 'keyboard only' ? 'reduce' : 'no-preference'
        });
        const page = await context.newPage();
        page.on('console', message => { if (message.type() === 'error') consoleErrors.push({ url: page.url(), message: message.text() }); });
        page.on('pageerror', error => pageErrors.push({ url: page.url(), message: error.message }));
        page.on('requestfailed', request => networkFailures.push({ url: request.url(), error: request.failure()?.errorText || 'request failed' }));
        for (let routeIndex = 0; routeIndex < discovered.length; routeIndex++) {
          const url = discovered[(index + routeIndex) % discovered.length];
          const started = Date.now();
          try {
            const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            const status = response?.status() ?? null;
            const title = await page.title().catch(() => '');
            const pageName = safeName(new URL(url).pathname || 'home');
            const screenshot = path.join(outputDir, 'evidence', personaId.toLowerCase() + '-' + pageName + '.png');
            await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
            results.push({ id: personaId, role: persona.role, goal: persona.goal, device: persona.device, constraint: persona.constraint, journey: persona.journey, worker: workerId, url, status, title, durationMs: Date.now() - started, outcome: status && status < 400 ? 'pass' : 'fail', screenshot: path.relative(outputDir, screenshot) });
          } catch (error) {
            results.push({ id: personaId, role: persona.role, goal: persona.goal, device: persona.device, worker: workerId, url, durationMs: Date.now() - started, outcome: 'fail', error: error.message });
          }
        }
        await context.close();
      }
    }
    await Promise.all(Array.from({ length: Math.min(workers, browserPersonaCount) }, (_, index) => worker(index + 1)));
  } finally {
    await browser.close();
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    target: target.origin,
    pagesDiscovered: discovered.length,
    browserPersonasExecuted: browserPersonaCount,
    browserWorkers: workers,
    maxPages,
    results,
    consoleErrors,
    pageErrors,
    networkFailures,
    counts: {
      pass: results.filter(item => item.outcome === 'pass').length,
      fail: results.filter(item => item.outcome === 'fail').length
    },
    note: 'This is a bounded read-only browser crawl, not a 100-user load test or human usability study.'
  };
  fs.writeFileSync(path.join(outputDir, 'browser-results.json'), JSON.stringify(summary, null, 2) + '\n');
  return { outputDir, summary };
}

module.exports = { runBrowserAudit, validateTarget };
