'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const markdownFiles = ['README.md', 'docs/COMMANDS.md', 'docs/ARCHITECTURE.md', 'docs/SAFETY.md', 'docs/ROADMAP.md', 'docs/PERSONA-LAB.md', 'docs/STRUCTURE.md', 'docs/NOTION-PAGE.md'];
const htmlFiles = ['docs/index.html', 'docs/guide.html'];

test('technical Markdown documents have no broken local links', () => {
  const broken = [];
  for (const relativeFile of markdownFiles) {
    const source = fs.readFileSync(path.join(root, relativeFile), 'utf8');
    for (const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const href = match[1].trim();
      if (!href || /^(https?:|mailto:|#|data:)/i.test(href)) continue;
      const target = href.split('#')[0].split('?')[0];
      if (!target) continue;
      const resolved = path.resolve(root, path.dirname(relativeFile), decodeURIComponent(target));
      if (!resolved.startsWith(root + path.sep) || !fs.existsSync(resolved)) broken.push(relativeFile + ' -> ' + href);
    }
  }
  assert.deepEqual(broken, [], 'Broken local Markdown links:\n' + broken.join('\n'));
});

test('documentation HTML local links and asset references resolve', () => {
  const broken = [];
  for (const relativeFile of htmlFiles) {
    const source = fs.readFileSync(path.join(root, relativeFile), 'utf8');
    const ids = new Set([...source.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]));
    for (const match of source.matchAll(/\bhref=["']([^"']+)["']/g)) {
      const href = match[1];
      if (/^(https?:|mailto:|javascript:|data:)/i.test(href)) continue;
      if (href.startsWith('#')) {
        if (!ids.has(href.slice(1))) broken.push(relativeFile + ' -> missing anchor ' + href);
        continue;
      }
      const target = href.split('#')[0].split('?')[0];
      if (!target) continue;
      const resolved = path.resolve(root, path.dirname(relativeFile), decodeURIComponent(target));
      if (!resolved.startsWith(root + path.sep) || !fs.existsSync(resolved)) {
        broken.push(relativeFile + ' -> ' + href);
      } else if (href.includes('#')) {
        const linked = fs.readFileSync(resolved, 'utf8');
        const anchor = href.split('#')[1];
        if (!linked.includes('id="' + anchor + '"') && !linked.includes("id='" + anchor + "'")) {
          broken.push(relativeFile + ' -> missing linked anchor ' + href);
        }
      }
    }
  }
  assert.deepEqual(broken, [], 'Broken local HTML links:\n' + broken.join('\n'));
});
