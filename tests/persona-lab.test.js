const test = require('node:test');
const assert = require('node:assert/strict');
const { generatePersonas } = require('../qa/personas');
const { validateTarget } = require('../qa/runner');

test('persona generator creates requested number of uniquely identified profiles', () => {
  const personas = generatePersonas(100, 'avr-demo');
  assert.equal(personas.length, 100);
  assert.equal(new Set(personas.map(persona => persona.id)).size, 100);
  assert.ok(personas.every(persona => persona.status === 'planned-not-executed'));
  assert.ok(personas.every(persona => persona.role && persona.goal && persona.device && persona.constraint));
});

test('persona generator rejects invalid population sizes', () => {
  assert.throws(() => generatePersonas(0), /between 1 and 10000/);
  assert.throws(() => generatePersonas(10001), /between 1 and 10000/);
  assert.throws(() => generatePersonas(1.5), /between 1 and 10000/);
});

test('browser runner accepts only credential-free HTTP(S) URLs', () => {
  assert.equal(validateTarget('https://example.com').hostname, 'example.com');
  assert.throws(() => validateTarget('file:///C:/secret'), /Only http/);
  assert.throws(() => validateTarget('https://user:pass@example.com'), /credentials/);
});

test('Persona Lab files are part of the Nexora installer manifest', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const cli = fs.readFileSync(path.join(__dirname, '..', 'bin', 'nexora.js'), 'utf8');
  for (const file of ['qa/personas.js', 'qa/runner.js', 'qa/cli.js', 'load/k6-smoke.js', 'docs/PERSONA-LAB.md']) {
    assert.ok(cli.includes(file), 'Missing installer manifest entry: ' + file);
    assert.ok(fs.existsSync(path.join(__dirname, '..', file)), 'Missing file: ' + file);
  }
});
