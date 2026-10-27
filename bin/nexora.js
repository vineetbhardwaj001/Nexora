#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline/promises');
const { execFile } = require('node:child_process');
const { stdin, stdout } = require('node:process');

const VERSION = require('../package.json').version;
const GITHUB_PROFILE = 'https://github.com/vineetbhardwaj001';
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
  '.agents/skills/exact-same-uiux/SKILL.md',
  '.agents/skills/project-intelligence-audit/SKILL.md',
  '.agents/skills/frontend-architecture/SKILL.md',
  '.agents/skills/backend-api-audit/SKILL.md',
  '.kilo/rules/nexora.md',
  'kilo.jsonc',
  '.github/copilot-instructions.md',
  '.github/prompts/frontend-only.prompt.md',
  '.github/prompts/design-ui.prompt.md',
  '.github/prompts/exactsameuiux.prompt.md',
  '.github/prompts/projectintelligence.prompt.md',
  '.github/prompts/frontendarchitecture.prompt.md',
  '.github/prompts/backendapi.prompt.md',
  '.github/prompts/professionalerrors.prompt.md',
  '.github/prompts/smartvalidation.prompt.md',
  '.github/prompts/meaningfulmessages.prompt.md',
  '.gitignore'
];

const THEME = {
  ink: [35, 31, 25],
  cream: [255, 244, 222],
  panel: [255, 249, 236],
  yellow: [255, 221, 58],
  orange: [255, 105, 38],
  peach: [255, 216, 181],
  muted: [112, 104, 92],
  green: [44, 122, 83],
  white: [255, 255, 255]
};

function paint(text, fg = THEME.ink, bg, bold = false) {
  if (!stdout.isTTY || process.env.NO_COLOR) return String(text);
  const codes = [];
  if (bold) codes.push('1');
  if (fg) codes.push('38;2;' + fg.join(';'));
  if (bg) codes.push('48;2;' + bg.join(';'));
  return '\\x1b[' + codes.join(';') + 'm' + String(text) + '\\x1b[0m';
}

function fit(text, width) {
  const value = String(text ?? '');
  if (value.length > width) return value.slice(0, Math.max(0, width - 1)) + '…';
  return value.padEnd(width, ' ');
}

function banner() {
  const width = 76;
  const line = '─'.repeat(width - 2);
  console.log(paint('╭' + line + '╮', THEME.ink, THEME.cream));
  console.log(paint('│' + fit('  N E X O R A     /     AI ENGINEERING TOOLKIT', width - 2) + '│', THEME.ink, THEME.yellow, true));
  console.log(paint('│' + fit('  From Idea to Production  ·  UI/UX  ·  CODE  ·  TEST  ·  SHIP', width - 2) + '│', THEME.ink, THEME.cream));
  console.log(paint('│' + fit('  Developed by Vineet Bhardwaj  ·  github.com/vineetbhardwaj001', width - 2) + '│', THEME.ink, THEME.panel));
  console.log(paint('╰' + line + '╯', THEME.ink, THEME.cream));
}

function help() {
  banner();
  console.log(`
${color(C.bold, 'USAGE')}
  npx nexora-agent-cli         Open interactive terminal menu
  npx nexora-agent-cli init    Install Nexora in the current project
  npx nexora-agent-cli doctor  Check an existing installation
  npx nexora-agent-cli list    List included files
  npx nexora-agent-cli --version Print version

${color(C.bold, 'INSTALL OPTIONS')}
  --yes                            Install missing files; skip conflicts
  --force                          Back up conflicting files, then replace
  --path <directory>               Select a target project directory

${color(C.gray, 'Safety: existing files are not overwritten by default.')}
`);
}

function renderDashboard(selected) {
  const width = Math.max(50, Math.min(116, stdout.columns || 100));
  const leftW = Math.max(14, Math.min(20, Math.floor(width * 0.21)));
  const rightW = Math.max(18, Math.min(28, Math.floor(width * 0.27)));
  const centerW = width - leftW - rightW - 4;
  const innerW = width - 2;
  const cwd = process.cwd();
  const existing = FILES.filter(file => {
    try { return fs.existsSync(path.join(cwd, file)) && fs.statSync(path.join(cwd, file)).isFile(); }
    catch { return false; }
  }).length;
  const actionDetails = {
    1: ['INSTALL KIT', 'Merge Nexora instructions', 'and skills into this project.'],
    2: ['SYSTEM CHECK', 'Find missing managed files', 'and review install health.'],
    3: ['BROWSE FILES', 'Review the files included', 'in the Nexora installer.'],
    4: ['HELP & COMMANDS', 'See command examples and', 'safe install options.'],
    5: ['GITHUB PROFILE', 'Open the maintainer page', 'in your default browser.'],
    6: ['EXIT', 'Close the interactive', 'terminal menu.']
  };
  const leftRows = [
    '  NAVIGATION',
    '',
    '  [1] Install kit',
    '  [2] System check',
    '  [3] Browse files',
    '  [4] Help & commands',
    '  [5] GitHub profile',
    '  [6] Exit',
    '',
    '  WORKSPACE',
    '  Safe defaults',
    '  Node.js >= 18',
    '  ' + FILES.length + ' managed files'
  ];
  const centerRows = [
    '  WORKSPACE OVERVIEW',
    '  Build with guardrails. Ship with confidence.',
    '',
    '  QUICK ACTIONS',
    '  [1] INSTALL KIT  - Add agent instructions safely',
    '  [2] SYSTEM CHECK - Audit files in this project',
    '  [3] BROWSE FILES - Review the installer manifest',
    '  [4] HELP         - Commands and install options',
    '  [5] GITHUB       - Open the maintainer profile',
    '  [6] EXIT         - Close the interactive menu',
    '',
    '  CURRENT PROJECT',
    '  ' + cwd
  ];
  const rightRows = [
    '  SELECTED ACTION',
    '  ' + actionDetails[selected][0],
    '  ' + actionDetails[selected][1],
    actionDetails[selected][2],
    '',
    '  PACKAGE',
    '  nexora-agent-cli',
    '  Version ' + VERSION,
    '  Node.js >= 18',
    '',
    '  INSTALL SAFETY',
    '  Existing files are preserved',
    '  --force creates backups',
    '',
    '  PROJECT CHECK',
    '  ' + existing + '/' + FILES.length + ' managed files found',
    '  Maintainer: Vineet Bhardwaj',
    '  github.com/vineetbhardwaj001'
  ];
  const bodyHeight = Math.max(leftRows.length, centerRows.length, rightRows.length);
  const border = '├' + '─'.repeat(leftW) + '┼' + '─'.repeat(centerW) + '┼' + '─'.repeat(rightW) + '┤';
  const outerTop = '╭' + '─'.repeat(width - 2) + '╮';
  const outerBottom = '╰' + '─'.repeat(width - 2) + '╯';
  const cell = (value, w, fg, bg, bold = false) => paint(fit(value, w), fg, bg, bold);
  const borderChar = value => paint(value, THEME.ink, THEME.cream);
  console.clear();
  console.log(borderChar(outerTop));
  console.log(borderChar('│') + cell('  N E X O R A   /   AI ENGINEERING TOOLKIT', innerW, THEME.ink, THEME.yellow, true) + borderChar('│'));
  console.log(borderChar('│') + cell('  From Idea to Production   ·   UI/UX   ·   CODE   ·   TEST   ·   SHIP', innerW, THEME.ink, THEME.cream) + borderChar('│'));
  console.log(borderChar(border));
  for (let row = 0; row < bodyHeight; row++) {
    const isSidebarSelection = row === selected + 1;
    const isCenterSelection = row === selected + 3;
    const leftBg = isSidebarSelection ? THEME.orange : THEME.cream;
    const centerBg = isCenterSelection ? THEME.peach : THEME.panel;
    const leftText = leftRows[row] || '';
    const centerText = centerRows[row] || '';
    const rightText = rightRows[row] || '';
    console.log(
      borderChar('│') +
      cell(leftText, leftW, isSidebarSelection ? THEME.white : THEME.ink, leftBg, isSidebarSelection) +
      borderChar('│') +
      cell(centerText, centerW, THEME.ink, centerBg, isCenterSelection) +
      borderChar('│') +
      cell(rightText, rightW, row === 1 ? THEME.orange : THEME.ink, row < 4 ? THEME.peach : THEME.cream, row === 1) +
      borderChar('│')
    );
  }
  console.log(borderChar(border));
  const footer = '  1-6 Select action   ·   q Exit   ·   Existing files stay safe by default';
  console.log(borderChar('│') + cell(footer, innerW, THEME.ink, THEME.yellow, true) + borderChar('│'));
  console.log(borderChar(outerBottom));
}

function parseArgs(args) {
  const firstArgIsOption = Boolean(args[0] && args[0].startsWith('-'));
  const result = {
    command: !args[0] || firstArgIsOption
      ? (stdin.isTTY && stdout.isTTY ? 'menu' : 'help')
      : args[0],
    yes: false,
    force: false,
    target: process.cwd()
  };
  for (let i = firstArgIsOption ? 0 : 1; i < args.length; i++) {
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

function openUrl(url) {
  const platform = process.platform;
  let command;
  let args;
  if (platform === 'win32') {
    command = 'cmd.exe';
    args = ['/c', 'start', '', url];
  } else if (platform === 'darwin') {
    command = 'open';
    args = [url];
  } else {
    command = 'xdg-open';
    args = [url];
  }
  execFile(command, args, error => {
    if (error) {
      console.log(color(C.yellow, 'Could not open the browser automatically.'));
      console.log('Open this URL manually: ' + url);
    }
  });
}

async function menu() {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  let selected = 1;
  try {
    while (true) {
      renderDashboard(selected);
      const choice = (await rl.question(
        '\n  Select 1-6, or q to quit: '
      )).trim().toLowerCase();
      if (choice === 'q' || choice === '6') {
        console.log('\n  See you soon. Build something meaningful.\n');
        return;
      }
      if (!['1', '2', '3', '4', '5'].includes(choice)) {
        console.log(color(C.yellow, '  Please enter a number from 1 to 6.'));
        await rl.question('  Press Enter to continue…');
        continue;
      }
      selected = Number(choice);
      if (choice === '1') {
        rl.close();
        await init({ target: process.cwd(), yes: false, force: false });
        return;
      }
      if (choice === '2') {
        console.clear();
        doctor({ target: process.cwd() });
        await rl.question('\n  Press Enter to return to dashboard…');
        continue;
      }
      if (choice === '3') {
        console.clear();
        list();
        await rl.question('\n  Press Enter to return to dashboard…');
        continue;
      }
      if (choice === '4') {
        console.clear();
        help();
        await rl.question('\n  Press Enter to return to dashboard…');
        continue;
      }
      if (choice === '5') {
        openUrl(GITHUB_PROFILE);
        console.log('\n  Opening maintainer profile: ' + GITHUB_PROFILE);
        await rl.question('\n  Press Enter to return to dashboard…');
      }
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
