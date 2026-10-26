const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pkg = require('../package.json');

test('package exposes nexora CLI and supported Node version', () => {
  assert.equal(pkg.bin.nexora, 'bin/nexora.js');
  assert.equal(pkg.bin['nexora-agent-vineetbhardwaj'], 'bin/nexora.js');
  assert.equal(pkg.engines.node, '>=18');
  assert.ok(fs.existsSync(path.join(root, pkg.bin.nexora)));
});

test('CLI contains safe installation flags and commands', () => {
  const cli = fs.readFileSync(path.join(root, 'bin/nexora.js'), 'utf8');
  for (const expected of ['init', 'doctor', '--force', '--yes', 'nexora-backup-']) {
    assert.ok(cli.includes(expected), 'Expected CLI to include ' + expected);
  }
});

test('all installer source files exist', () => {
  const cli = fs.readFileSync(path.join(root, 'bin/nexora.js'), 'utf8');
  const match = cli.match(/const FILES = \[([\s\S]*?)\n\];/);
  assert.ok(match, 'FILES list must exist');
  const files = [...match[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
  assert.ok(files.length >= 15);
  for (const file of files) {
    assert.ok(fs.existsSync(path.join(root, file)), 'Missing installer file: ' + file);
  }
});
