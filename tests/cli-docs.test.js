'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
function run(file, args) {
  return spawnSync(process.execPath, [path.join(root, file), ...args], { cwd: root, encoding: 'utf8' });
}

test('Persona Lab help documents supported commands and profile-count limits', () => {
  const result = run('qa/cli.js', ['--help']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /node qa\/cli\.js plan/);
  assert.match(result.stdout, /node qa\/cli\.js run/);
  assert.match(result.stdout, /100 profiles != 100 real users != 100 LLM agents != 100 simultaneous browsers/);
  assert.doesNotMatch(result.stdout, /node qa\/cli\.js (discover|reason|validate-decision)/);
});

test('README and command guide advertise only Persona Lab commands exposed by --help', () => {
  const help = run('qa/cli.js', ['--help']);
  assert.equal(help.status, 0, help.stderr);
  const docs = fs.readFileSync(path.join(root, 'README.md'), 'utf8') + '\n' + fs.readFileSync(path.join(root, 'docs/COMMANDS.md'), 'utf8');
  for (const command of ['plan', 'run']) {
    assert.match(help.stdout, new RegExp('node qa/cli\\.js ' + command + '\\b'));
    assert.match(docs, new RegExp('node qa/cli\\.js ' + command + '\\b'));
  }
  for (const unsupported of ['discover', 'reason', 'validate-decision']) {
    assert.doesNotMatch(help.stdout, new RegExp('node qa/cli\\.js ' + unsupported + '\\b'));
  }
});

test('Installer help and README command names stay aligned', () => {
  const help = run('bin/nexora.js', ['--help']);
  assert.equal(help.status, 0, help.stderr);
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  for (const command of ['init', 'doctor', 'list', 'version', 'qa plan', 'qa run']) {
    assert.ok(help.stdout.includes(command), 'Installer help missing documented command: ' + command);
    assert.ok(readme.includes(command), 'README missing command: ' + command);
  }
});
