#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');

const VERSION = require('../package.json').version;
const ROOT = path.resolve(__dirname, '..');
const FILES = [
  'AGENTS.md',
  '.agent/CORE.md',
  '.agent/config/skills.json',
  '.agent/repo-catalog.md',
  '.agent/workflows/setup.md',
  '.agent/workflows/uiux-reference-analysis.md',
  '.agent/workflows/backend-preserving-frontend.md',
  '.agent/workflows/frontend-structure.md',
  '.agents/rules/nexora.md',
  '.agents/skills/ux-ui-design/SKILL.md',
  '.agents/skills/backend-preserving-frontend/SKILL.md',
  '.agents/skills/error-handling/SKILL.md',
  '.agents/skills/validation/SKILL.md',
  '.agents/skills/meaningful-product-messages/SKILL.md',
  '.agents/skills/idea-product-strategy/SKILL.md',
  '.kilo/rules/nexora.md',
  'kilo.jsonc',
  '.github/copilot-instructions.md',
  '.github/prompts/frontend-only.prompt.md',
  '.github/prompts/design-ui.prompt.md',
  '.gitignore'
];

function help() {
  console.log(`
Nexora ${VERSION} — From Idea to Production

Usage:
  npx nexora-agent init [--yes | --force] [--path <directory>]
  npx nexora-agent doctor [--path <directory>]
  npx nexora-agent list
  npx nexora-agent --version

Commands:
  init      Install Nexora instructions, workflows and skills in a project.
  doctor    Check whether expected Nexora files exist in a project.
  list      List files included in the installer.

Options:
  --yes     Install missing files and skip existing files.
  --force   Back up conflicting files, then replace them.
  --path    Target project directory (defaults to current directory).

Safety:
  Existing files are never overwritten by default.
  --force creates timestamped backups before replacing files.
  The installer does not install dependencies or modify application source code.
`);
}

function parseArgs(args) {
  const result = { command: args[0] || 'help', yes: false, force: false, target: process.cwd() };
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--yes' || arg === '-y') result.yes = true;
    else if (arg === '--force') result.force = true;
    else if (arg === '--path') {
      if (!args[i + 1]) throw new Error('--path requires a directory');
      result.target = path.resolve(args[++i]);
    } else if (arg === '--version' || arg === '-v') result.command = 'version';
    else if (arg === '--help' || arg === '-h') result.command = 'help';
    else throw new Error('Unknown option: ' + arg);
  }
  if (result.yes && result.force) throw new Error('Use either --yes or --force, not both.');
  return result;
}

function safeDestination(root, relative) {
  const dest = path.resolve(root, relative);
  if (dest !== root && !dest.startsWith(root + path.sep)) {
    throw new Error('Refusing to write outside target directory: ' + relative);
  }
  return dest;
}

async function askOverwrite(rl, relative) {
  const answer = await rl.question(`Replace existing ${relative}? [y/N] `);
  return /^y(es)?$/i.test(answer.trim());
}

async function init(opts) {
  if (!fs.existsSync(opts.target) || !fs.statSync(opts.target).isDirectory()) {
    throw new Error('Target directory does not exist: ' + opts.target);
  }
  const rl = (!opts.yes && !opts.force && stdin.isTTY)
    ? readline.createInterface({ input: stdin, output: stdout })
    : null;
  const installed = [];
  const skipped = [];
  const backedUp = [];
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');

  try {
    for (const relative of FILES) {
      const source = safeDestination(ROOT, relative);
      const dest = safeDestination(opts.target, relative);
      if (!fs.existsSync(source) || !fs.statSync(source).isFile()) {
        throw new Error('Package is missing expected file: ' + relative);
      }

      if (fs.existsSync(dest)) {
        if (opts.force) {
          const backup = dest + '.nexora-backup-' + stamp;
          fs.mkdirSync(path.dirname(backup), { recursive: true });
          fs.copyFileSync(dest, backup);
          backedUp.push(path.relative(opts.target, backup));
        } else if (opts.yes) {
          skipped.push(relative);
          continue;
        } else if (rl && await askOverwrite(rl, relative)) {
          // Interactive overwrite is explicit; keep a backup too.
          const backup = dest + '.nexora-backup-' + stamp;
          fs.copyFileSync(dest, backup);
          backedUp.push(path.relative(opts.target, backup));
        } else {
          skipped.push(relative);
          continue;
        }
      }

      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(source, dest);
      installed.push(relative);
    }
  } finally {
    if (rl) rl.close();
  }

  console.log('\nNexora installation summary');
  console.log('Target:    ' + opts.target);
  console.log('Installed: ' + installed.length);
  console.log('Skipped:   ' + skipped.length);
  console.log('Backups:   ' + backedUp.length);
  if (skipped.length) console.log('\nSkipped existing files (not overwritten):\n' + skipped.map(x => '  - ' + x).join('\n'));
  if (backedUp.length) console.log('\nBackups created:\n' + backedUp.map(x => '  - ' + x).join('\n'));
  console.log('\nNext: open this folder in your coding agent and ask it to read AGENTS.md and .agent/CORE.md.');
  console.log('Note: IDEs differ; this installs instructions and skills but cannot guarantee automatic discovery in every IDE/version.');
}

function doctor(opts) {
  let missing = 0;
  for (const relative of FILES) {
    const dest = safeDestination(opts.target, relative);
    const ok = fs.existsSync(dest) && fs.statSync(dest).isFile();
    console.log((ok ? 'OK      ' : 'MISSING ') + relative);
    if (!ok) missing++;
  }
  console.log(`\nChecked ${FILES.length} files. Missing: ${missing}.`);
  if (missing) process.exitCode = 1;
}

function list() {
  console.log(FILES.join('\n'));
}

(async () => {
  try {
    const opts = parseArgs(process.argv.slice(2));
    switch (opts.command) {
      case 'init': await init(opts); break;
      case 'doctor': doctor(opts); break;
      case 'list': list(); break;
      case 'version': console.log(VERSION); break;
      case 'help': help(); break;
      default: help(); process.exitCode = 1;
    }
  } catch (error) {
    console.error('Nexora error: ' + error.message);
    process.exitCode = 1;
  }
})();
