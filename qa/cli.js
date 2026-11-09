#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { generatePersonas } = require('./personas');
const { runBrowserAudit, validateTarget } = require('./runner');

function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index++) {
    const key = args[index];
    if (!key.startsWith('--')) throw new Error('Unexpected argument: ' + key);
    const value = args[index + 1];
    if (!value || value.startsWith('--')) throw new Error(key + ' requires a value.');
    options[key.slice(2)] = value;
    index++;
  }
  return options;
}

function outputDirectory(options) {
  return path.resolve(options.out || path.join('reports', 'qa', new Date().toISOString().replace(/[:.]/g, '-')));
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (!['plan', 'run'].includes(command)) {
    console.log('Nexora Persona Lab\n\nUsage:\n  node qa/cli.js plan --url https://your-preview.example --personas 100\n  node qa/cli.js run --url https://your-preview.example --personas 100 --browser-personas 100 --workers 2\n\nOptions: --url, --personas (1-10000), --browser-personas (1-10), --workers (1-3), --max-pages (1-20), --seed, --out');
    if (command) process.exitCode = 1;
    return;
  }
  const options = parseArgs(rest);
  if (!options.url) throw new Error('Missing required --url. Do not test a guessed target.');
  validateTarget(options.url);
  const count = Number(options.personas || 100);
  const personas = generatePersonas(count, options.seed || 'nexora');
  const out = outputDirectory(options);
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'personas.json'), JSON.stringify({
    generatedAt: new Date().toISOString(),
    target: new URL(options.url).origin,
    count: personas.length,
    executionStatus: 'personas-generated-not-human-participants',
    personas
  }, null, 2) + '\n');
  console.log('Generated ' + personas.length + ' synthetic persona profiles: ' + path.join(out, 'personas.json'));
  if (command === 'plan') {
    console.log('Plan only: no browser sessions or HTTP virtual users were started.');
    return;
  }
  const browser = await runBrowserAudit({
    url: options.url,
    browserPersonas: options['browser-personas'] || 3,
    personas,
    workers: options.workers || 2,
    maxPages: options['max-pages'] || 10,
    output: out
  });
  const report = [
    '# Nexora Persona Lab — QA Report',
    '',
    '- Generated: ' + browser.summary.generatedAt,
    '- Target: ' + browser.summary.target,
    '- Synthetic personas generated: ' + personas.length + ' (not human participants)',
    '- Browser persona contexts executed: ' + browser.summary.browserPersonasExecuted,
    '- Browser workers: ' + browser.summary.browserWorkers,
    '- Pages discovered: ' + browser.summary.pagesDiscovered,
    '- Browser checks passed: ' + browser.summary.counts.pass,
    '- Browser checks failed: ' + browser.summary.counts.fail,
    '- HTTP virtual users: 0 (load test not run)',
    '',
    '## Browser findings',
    '',
    ...browser.summary.results.map(item => '- **' + item.outcome.toUpperCase() + '** ' + item.id + ' — ' + item.url + (item.status ? ' (HTTP ' + item.status + ')' : '') + (item.error ? ': ' + item.error : '')),
    '',
    '## Runtime errors',
    '',
    '- Console errors: ' + browser.summary.consoleErrors.length,
    '- Page errors: ' + browser.summary.pageErrors.length,
    '- Failed network requests: ' + browser.summary.networkFailures.length,
    '',
    '## Limitations',
    '',
    '- Persona profiles are deterministic synthetic scenarios, not autonomous LLM agents or real users.',
    '- Browser checks perform bounded read-only navigation and screenshots; they do not submit forms or mutate records.',
    '- Browser workers are capped at 3 to avoid exhausting a developer workstation.',
    '- This report is not an HTTP load test, security penetration test or full accessibility audit.'
  ].join('\n') + '\n';
  fs.writeFileSync(path.join(out, 'README.md'), report);
  console.log('QA report: ' + path.join(out, 'README.md'));
  console.log('Browser persona contexts: ' + browser.summary.browserPersonasExecuted + '; HTTP VUs: 0.');
}

main().catch(error => {
  console.error('Nexora Persona Lab error: ' + error.message);
  process.exitCode = 1;
});
