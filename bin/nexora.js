#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');

const VERSION = require('../package.json').version;
const ROOT = path.resolve(__dirname, '..');
const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  cyan: '\x1b[36m', blue: '\x1b[34m', purple: '\x1b[35m',
  green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m',
  white: '\x1b[97m', gray: '\x1b[90m'
};
const color = (code, text) => process.env.NO_COLOR || !stdout.isTTY ? String(text) : code + text + C.reset;
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

function banner() {
  const lines = [
    '╭──────────────────────────────────────────────────────────────╮',
    '│  N E X O R A                                        v' + VERSION.padEnd(22) + '│',
    '│  From Idea to Production                                     │',
    '├──────────────────────────────────────────────────────────────┤',
    '│  Skill-driven workflows for your AI coding environment       │',
    '│  UI/UX  ·  Frontend  ·  Validation  ·  Error handling         │',
    '╰──────────────────────────────────────────────────────────────╯'
  ];
  console.log(color(C.cyan, lines.join('\n')));
}

function help() {
  banner();
  console.log(`
${color(C.bold, 'USAGE')}
  npx nexora-agent                 Open interactive terminal menu
  npx nexora-agent init            Install Nexora in the current project
  npx nexora-agent doctor          Check an existing installation
  npx nexora-agent list            List files included in the installer
  npx nexora-agent --version       Print version

${color(C.bold, 'INSTALL OPTIONS')}
  --yes                            Install missing files; skip conflicts
  --force                          Back up conflicting files, then replace
  --path <directory>               Select a target project directory

${color(C.gray, 'Safety: existing files are not overwritten by default.')}
`);
}

function parseArgs(args) {
  const result = { command: args[0] || (stdin.isTTY && stdout.isTTY ? 'menu' : 'help'), yes: false, force: false, target: process.cwd() };
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
          const backup = dest + '.nexora-backup-' + stamp;
          fs.mkdirSync(path.dirname(backup), { recursive: true });
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

  banner();
  console.log(color(C.green, '  ✓ Installation finished'));
  console.log('  Target:    ' + opts.target);
  console.log('  Installed: ' + color(C.green, installed.length));
  console.log('  Skipped:   ' + color(C.yellow, skipped.length));
  console.log('  Backups:   ' + backedUp.length);
  if (skipped.length) console.log('\nSkipped existing files:\n' + skipped.map(x => '  • ' + x).join('\n'));
  if (backedUp.length) console.log('\nBackups created:\n' + backedUp.map(x => '  • ' + x).join('\n'));
  console.log('\nNext: open this folder in your coding agent and ask it to read AGENTS.md and .agent/CORE.md.');
  console.log(color(C.gray, 'IDE discovery differs by tool/version; verify skill loading in your environment.'));
}

function doctor(opts) {
  banner();
  let missing = 0;
  for (const relative of FILES) {
    const dest = safeDestination(opts.target, relative);
    const ok = fs.existsSync(dest) && fs.statSync(dest).isFile();
    console.log((ok ? color(C.green, '  ✓ OK     ') : color(C.red, '  ✗ MISSING ')) + relative);
    if (!ok) missing++;
  }
  console.log(`\nChecked ${FILES.length} files. Missing: ${missing}.`);
  if (missing) process.exitCode = 1;
  else console.log(color(C.green, 'Nexora files are present. IDE loading still needs a separate check.'));
}

function list() {
  banner();
  console.log(FILES.map(file => color(C.gray, '  • ') + file).join('\n'));
  console.log(`\n${FILES.length} files in the installer manifest.`);
}

async function menu() {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    while (true) {
      console.clear();
      banner();
      console.log('\n' + color(C.bold, '  QUICK ACTIONS'));
      console.log('  ' + color(C.cyan, '[1]') + ' Install Nexora into current folder');
      console.log('  ' + color(C.cyan, '[2]') + ' Check Nexora installation');
      console.log('  ' + color(C.cyan, '[3]') + ' Browse included files');
      console.log('  ' + color(C.cyan, '[4]') + ' Show CLI help');
      console.log('  ' + color(C.cyan, '[5]') + ' Exit');
      console.log('\n  Project: ' + color(C.gray, process.cwd()));
      const choice = (await rl.question('\n  Choose an option [1-5]: ')).trim();
      if (choice === '1') {
        rl.close();
        await init({ target: process.cwd(), yes: false, force: false });
        return;
      }
      if (choice === '2') {
        doctor({ target: process.cwd() });
        await readline.createInterface({ input: stdin, output: stdout }).question('\nPress Enter to return to menu…').catch(() => {});
        continue;
      }
      if (choice === '3') {
        list();
        await rl.question('\nPress Enter to return to menu…');
        continue;
      }
      if (choice === '4') {
        help();
        await rl.question('\nPress Enter to return to menu…');
        continue;
      }
      if (choice === '5' || choice.toLowerCase() === 'q') {
        console.log('\n  See you soon. Build something meaningful.\n');
        return;
      }
      console.log(color(C.yellow, '\n  Please choose 1, 2, 3, 4, or 5.'));
      await rl.question('  Press Enter to continue…');
    }
  } finally {
    try { rl.close(); } catch {}
  }
}

(async () => {
  try {
    const opts = parseArgs(process.argv.slice(2));
    switch (opts.command) {
      case 'menu': await menu(); break;
      case 'init': await init(opts); break;
      case 'doctor': doctor(opts); break;
      case 'list': list(); break;
      case 'version': console.log(VERSION); break;
      case 'help': help(); break;
      default: help(); process.exitCode = 1;
    }
  } catch (error) {
    console.error(color(C.red, 'Nexora error: ') + error.message);
    process.exitCode = 1;
  }
})();
