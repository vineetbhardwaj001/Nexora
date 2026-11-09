#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { generatePersonas } = require('./personas');
const { runBrowserAudit, validateTarget } = require('./runner');
const { analyzeProject } = require('./project-intelligence');
const skillLibrary = require('./skill-library.json');
const { buildDecisionRequest, validateDecision, createExecutionRecord } = require('./mission-engine');

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
  if (!['plan', 'run', 'discover', 'reason', 'validate-decision'].includes(command)) {
    console.log('Nexora Persona Lab\n\nUsage:\n  node qa/cli.js discover --project . --personas 8\n  node qa/cli.js reason --report <directory> --persona NX-P-0001\n  node qa/cli.js validate-decision --file decision.json\n  node qa/cli.js plan --url https://your-preview.example --personas 100\n  node qa/cli.js run --url https://your-preview.example --personas 100 --browser-personas 100 --workers 2\n\nOptions: --url, --personas (1-10000), --browser-personas (1-100), --workers (1-3), --max-pages (1-20), --seed, --out');
    if (command) process.exitCode = 1;
    return;
  }
  const options = parseArgs(rest);
  if (command === 'reason') {
    if (!options.report || !options.persona) throw new Error('reason requires --report <discovery-directory> and --persona <persona-id>.');
    const report = path.resolve(options.report);
    if (options.url) validateTarget(options.url);
    const read = name => JSON.parse(fs.readFileSync(path.join(report, name), 'utf8'));
    const analysis = read('project-analysis.json');
    const personaBundle = read('personas.json');
    const persona = personaBundle.personas.find(item => item.id === options.persona);
    if (!persona) throw new Error('Persona not found in discovery report: ' + options.persona);
    const mission = { id: 'MISSION-' + persona.id, personaId: persona.id, title: 'Explore the primary ' + analysis.domain.domain + ' journey as a ' + persona.role, goal: persona.goal, startUrl: options.url || null, preconditions: ['Verify the exact target URL and environment before browser access','Use an approved test account and synthetic data if authentication is required'], allowedActions: ['Read-only navigation','Inspect visible UI','Capture screenshots and observable errors'], prohibitedActions: ['Real payments','Real customer messages','Deletion or destructive actions','Production record mutations'], expectedOutcome: 'Advance the persona goal only when observable evidence supports each step.' };
    const request = buildDecisionRequest({ analysis, persona, mission });
    const out = path.resolve(options.out || path.join(report, 'decision-request-' + persona.id + '.json'));
    fs.writeFileSync(out, JSON.stringify(request, null, 2) + '\n', { flag: 'wx' });
    console.log('Host-model decision request created: ' + out);
    console.log('Provider: coding agent own model; decision status: DECISION_REQUEST_ONLY; browser actions executed: 0.');
    return;
  }
  if (command === 'validate-decision') {
    if (!options.file) throw new Error('validate-decision requires --file <decision.json>.');
    const file = path.resolve(options.file);
    const decision = JSON.parse(fs.readFileSync(file, 'utf8'));
    const validated = validateDecision(decision, { allowStateChanges: options['allow-state-changes'] === 'true', environment: options.environment || 'unknown', allowedOrigins: options['allowed-origin'] ? [new URL(options['allowed-origin']).origin] : undefined });
    const record = createExecutionRecord(validated);
    const out = path.resolve(options.out || file.replace(/\.json$/i, '.validated.json'));
    fs.writeFileSync(out, JSON.stringify({ decision: validated, executionRecord: record }, null, 2) + '\n', { flag: 'wx' });
    console.log('Decision schema and safety checks passed: ' + out);
    console.log('This validates a proposal only. No browser action was executed and no outcome was verified.');
    return;
  }
  if (command === 'discover') {
    const project = path.resolve(options.project || process.cwd());
    const analysis = analyzeProject(project);
    const count = Number(options.personas || 8);
    if (!Number.isInteger(count) || count < 1 || count > 1000) throw new RangeError('Discovery persona count must be 1-1000.');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const out = path.resolve(options.out || path.join(project, 'reports', 'qa', 'discovery-' + stamp));
    fs.mkdirSync(out, { recursive: true });
    const writeNew = (name, value) => fs.writeFileSync(path.join(out, name), value, { flag: 'wx' });
    const segments = analysis.customerSegments;
    const categoryMap = {
      ecommerce: ['discovery','onboarding','ecommerce','forms','usability','mobile','accessibility','reliability'],
      healthcare: ['discovery','onboarding','booking','forms','usability','mobile','accessibility','security','reliability'],
      booking: ['discovery','booking','forms','usability','mobile','accessibility','reliability'],
      education: ['discovery','onboarding','forms','usability','mobile','accessibility','reliability'],
      finance: ['discovery','onboarding','forms','usability','accessibility','security','reliability'],
      saas: ['discovery','onboarding','forms','usability','mobile','accessibility','security','reliability'],
      content: ['discovery','usability','mobile','accessibility','reliability'],
      'general-web-app': ['discovery','onboarding','forms','usability','mobile','accessibility','reliability']
    };
    const relevant = new Set(categoryMap[analysis.domain.domain] || categoryMap['general-web-app']);
    if (analysis.features.includes('payments-or-billing')) relevant.add('ecommerce');
    if (analysis.features.includes('appointments-or-booking')) relevant.add('booking');
    const candidates = skillLibrary.skills.filter(skill => relevant.has(skill.category));
    const styles = [
      { personality:'curious and exploratory', nature:'understands the whole experience before acting', patience:'medium', technicalConfidence:'beginner' },
      { personality:'cautious and skeptical', nature:'checks details and trust signals', patience:'high', technicalConfidence:'intermediate' },
      { personality:'impatient and goal-focused', nature:'prefers the shortest clear path', patience:'low', technicalConfidence:'intermediate' },
      { personality:'methodical and detail-oriented', nature:'checks labels, validation and edge conditions', patience:'high', technicalConfidence:'advanced' },
      { personality:'pragmatic and independent', nature:'uses familiar patterns and self-service help', patience:'medium', technicalConfidence:'intermediate' },
      { personality:'social-proof seeker', nature:'looks for reviews, trust indicators and reassurance', patience:'medium', technicalConfidence:'beginner' },
      { personality:'skeptical verifier', nature:'checks consistency and challenges unclear claims', patience:'high', technicalConfidence:'advanced' },
      { personality:'anxious first-timer', nature:'needs predictable steps and clear recovery options', patience:'low', technicalConfidence:'beginner' },
      { personality:'budget optimizer', nature:'compares value, fees and hidden costs before acting', patience:'medium', technicalConfidence:'intermediate' },
      { personality:'keyboard-centric minimalist', nature:'prefers direct navigation and low-friction controls', patience:'medium', technicalConfidence:'advanced' }
    ];
    const interests = {
      ecommerce:['product research','style discovery','deal comparison'],
      healthcare:['wellness reading','health-service research','family scheduling'],
      booking:['travel planning','event discovery','calendar organization'],
      education:['reading','skill development','study planning'],
      finance:['budget planning','small-business operations','record keeping'],
      saas:['productivity systems','team collaboration','workflow optimization'],
      content:['reading','research','writing'],
      'general-web-app':['digital organization','learning new tools','online research']
    };
    const personas = Array.from({length:count},(_,index)=>{
      const segment=segments[index%segments.length], style=styles[index%styles.length];
      const categoryOrder=Array.from(relevant);
      const assigned=categoryOrder.map((category,categoryIndex)=>{
        const pool=candidates.filter(skill=>skill.category===category);
        return pool.length?pool[(index+categoryIndex)%pool.length]:null;
      }).filter(Boolean).slice(0,8);
      const interestList=interests[analysis.domain.domain]||interests['general-web-app'];
      return {id:'NX-P-'+String(index+1).padStart(4,'0'),segmentId:segment.id,role:segment.name,goal:segment.goal,...style,device:['mobile-390','desktop-1440','laptop-1280','tablet-768','mobile-360'][index%5],technologyFamiliarity:style.technicalConfidence,contextConstraint:['slow-network','short-attention-window','keyboard-first','large-text-preference','interrupted-session'][index%5],hobbyOrInterest:interestList[index%interestList.length],assignedSkillIds:assigned.map(s=>s.id),status:'PLANNED_NOT_EXECUTED',synthetic:true};
    });
    const assignments=personas.map(p=>({personaId:p.id,skillIds:p.assignedSkillIds,selectionReason:'Matched to inferred domain, persona goal and relevant skill categories.',status:'PLANNED_NOT_EXECUTED'}));
    const missions=personas.map(p=>({personaId:p.id,title:'Explore the primary '+analysis.domain.domain+' journey as a '+p.role,goal:p.goal,startUrl:null,preconditions:['Exact target URL verified','Approved test account and synthetic data if authentication is required'],allowedActions:['Read-only navigation','Inspect visible UI','Capture screenshots and errors'],prohibitedActions:['Real payments','Real customer messages','Production record mutations','Deletion or destructive actions'],expectedOutcome:'Complete the relevant journey without an evidenced blocking issue.',status:'PLANNED_NOT_EXECUTED'}));
    writeNew('project-analysis.json',JSON.stringify(analysis,null,2)+'\n');
    writeNew('customer-hypotheses.json',JSON.stringify({generatedAt:analysis.generatedAt,status:'HYPOTHESES_NOT_VALIDATED',domain:analysis.domain,segments,evidence:analysis.evidence},null,2)+'\n');
    writeNew('personas.json',JSON.stringify({generatedAt:analysis.generatedAt,status:'PLANNED_NOT_EXECUTED',synthetic:true,count:personas.length,personas},null,2)+'\n');
    writeNew('skill-assignments.json',JSON.stringify({catalogCount:skillLibrary.count,selectedSkillCount:candidates.length,assignments},null,2)+'\n');
    const lines=['# Project-aware mission plan','','- Project: '+analysis.product.name,'- Domain hypothesis: '+analysis.domain.domain+' ('+analysis.domain.confidence+' confidence)','- Synthetic personas: '+personas.length,'- Skills in catalog: '+skillLibrary.count,'- Missions planned: '+missions.length,'- Missions executed: 0','','Planning artifact only. No browser was opened and no test was executed. All missions are PLANNED_NOT_EXECUTED.',''];
    for(const m of missions) lines.push('## '+m.personaId+' — '+m.title,'','- Goal: '+m.goal,'- Status: '+m.status,'- Preconditions: '+m.preconditions.join('; '),'');
    writeNew('mission-plan.md',lines.join('\n')+'\n');
    console.log('Project discovery complete (static inspection only).');
    console.log('Domain hypothesis: '+analysis.domain.domain+' ('+analysis.domain.confidence+' confidence)');
    console.log('Synthetic personas planned: '+personas.length+'; missions executed: 0; browser sessions: 0; HTTP VUs: 0.');
    console.log('Planning artifacts: '+out);
    console.log('No browser, LLM, external API or live customer data was used.');
    return;
  }
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
