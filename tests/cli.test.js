const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pkg = require('../package.json');

test('package exposes nexora CLI and supported Node version', () => {
  assert.equal(pkg.bin.nexora, 'bin/nexora.js');
  assert.equal(pkg.bin['nexora-agent-cli'], 'bin/nexora.js');
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


test('engineering council skill and prompt are registered in the installer', () => {
  const cli = fs.readFileSync(path.join(root, 'bin/nexora.js'), 'utf8');
  const config = JSON.parse(fs.readFileSync(path.join(root, '.agent/config/skills.json'), 'utf8'));
  assert.equal(config.skills['engineering-council'], 'ask-first');
  assert.ok(cli.includes('.agents/skills/engineering-council/SKILL.md'));
  assert.ok(cli.includes('.github/prompts/engineeringcouncil.prompt.md'));
});

test('CLI paint function emits ANSI escape sequences', () => {
  const cli = fs.readFileSync(path.join(root, 'bin/nexora.js'), 'utf8');
  assert.ok(cli.includes(String.raw`return '\x1b['`), 'paint() should use ANSI escape sequences');
});

test('pro engineering master skill and Kilo workflow are registered and installable', () => {
  const cli = fs.readFileSync(path.join(root, 'bin/nexora.js'), 'utf8');
  const config = JSON.parse(fs.readFileSync(path.join(root, '.agent/config/skills.json'), 'utf8'));
  const masterSkill = '.agents/skills/pro-eng-scalable/SKILL.md';
  const cleanCodeSkill = '.agents/skills/clean-code-architecture/SKILL.md';
  const kiloCommand = '.kilo/commands/pro-eng-scalable.md';

  assert.equal(config.skills['pro-eng-scalable'], 'ask-first');
  assert.equal(config.skills['clean-code-architecture'], 'ask-first');
  for (const file of [masterSkill, cleanCodeSkill, kiloCommand]) {
    assert.ok(cli.includes(file), 'Installer manifest should include ' + file);
    assert.ok(fs.existsSync(path.join(root, file)), 'Missing workflow file: ' + file);
  }
  const command = fs.readFileSync(path.join(root, kiloCommand), 'utf8');
  assert.match(command, /description:/);
  assert.match(command, /\$ARGUMENTS/);
  assert.match(command, /audit-only/);
  assert.match(command, /full-improvement/);
});


test('product QA swarm skill, Kilo command and report template are installable', () => {
  const cli = fs.readFileSync(path.join(root, 'bin/nexora.js'), 'utf8');
  const config = JSON.parse(fs.readFileSync(path.join(root, '.agent/config/skills.json'), 'utf8'));
  const skill = '.agents/skills/product-qa-swarm/SKILL.md';
  const command = '.kilo/commands/product-qa-swarm.md';
  const report = 'docs/PRODUCT-QA-REPORT-TEMPLATE.md';
  assert.equal(config.skills['product-qa-swarm'], 'ask-first');
  for (const file of [skill, command, report]) {
    assert.ok(cli.includes(file), 'Installer manifest should include ' + file);
    assert.ok(fs.existsSync(path.join(root, file)), 'Missing QA file: ' + file);
  }
  const instructions = fs.readFileSync(path.join(root, skill), 'utf8');
  assert.match(instructions, /real browser/i);
  assert.match(instructions, /virtual-user load test/i);
  assert.match(instructions, /Never claim/);
  const kilo = fs.readFileSync(path.join(root, command), 'utf8');
  assert.match(kilo, /agent: code/);
  assert.match(kilo, /exact target URL/);
});


test('single-command MiroFish product QA workflow is installed and registered', () => {
  const cli = fs.readFileSync(path.join(root, 'bin/nexora.js'), 'utf8');
  const config = JSON.parse(fs.readFileSync(path.join(root, '.agent/config/skills.json'), 'utf8'));
  const command = '.kilo/commands/test-my-product.md';
  const adapter = '.agents/skills/mirofish-product-simulation/SKILL.md';
  assert.equal(config.skills['mirofish-product-simulation'], 'ask-first');
  for (const file of [command, adapter]) {
    assert.ok(cli.includes(file), 'Installer manifest should include ' + file);
    assert.ok(fs.existsSync(path.join(root, file)), 'Missing MiroFish workflow file: ' + file);
  }
  const instructions = fs.readFileSync(path.join(root, command), 'utf8');
  assert.match(instructions, /MiroFish/i);
  assert.match(instructions, /real browser/i);
  assert.match(instructions, /virtual users/i);
  assert.match(instructions, /simulated personas/i);
});


test('MiroFish operator guide is included in the installer manifest', () => {
  const cli = fs.readFileSync(path.join(root, 'bin/nexora.js'), 'utf8');
  const guide = 'docs/MIROFISH-INTEGRATION.md';
  assert.ok(cli.includes(guide));
  assert.ok(fs.existsSync(path.join(root, guide)));
});


test('Caldo untangle skill and unified Nexora command are registered and installable', () => {
  const cli = fs.readFileSync(path.join(root, 'bin/nexora.js'), 'utf8');
  const config = JSON.parse(fs.readFileSync(path.join(root, '.agent/config/skills.json'), 'utf8'));
  const skill = '.agents/skills/untangle-codebase/SKILL.md';
  const license = '.agents/skills/untangle-codebase/LICENSE';
  const orchestrator = '.agents/skills/nexora-orchestrator/SKILL.md';
  const command = '.kilo/commands/nexora.md';
  const notices = 'THIRD-PARTY-NOTICES.md';
  const guide = 'docs/UNTANGLE-CODEBASE.md';

  assert.equal(config.skills['untangle-codebase'], 'ask-first');
  assert.equal(config.skills['nexora-orchestrator'], 'enabled');
  for (const file of [skill, license, orchestrator, command, notices, guide]) {
    assert.ok(cli.includes(file), 'Installer manifest should include ' + file);
    assert.ok(fs.existsSync(path.join(root, file)), 'Missing Nexora workflow file: ' + file);
  }
  const upstream = fs.readFileSync(path.join(root, skill), 'utf8');
  assert.match(upstream, /disable-model-invocation: true/);
  assert.match(upstream, /Hidden links/);
  assert.match(upstream, /Needless links/);
  assert.match(upstream, /special case/i);
  const kilo = fs.readFileSync(path.join(root, command), 'utf8');
  assert.match(kilo, /agent: code/);
  assert.match(kilo, /\/nexora test/);
  assert.match(kilo, /\/nexora untangle/);
  assert.match(kilo, /\/nexora improve/);
  assert.match(kilo, /real-browser/i);
});
