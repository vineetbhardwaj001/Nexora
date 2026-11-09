'use strict';

const crypto = require('node:crypto');

const ACTIONS = new Set(['navigate','click','fill','press_key','scroll','inspect','wait','ask_user','stop']);
const MUTATING_WORDS = /\\b(pay|purchase|checkout|submit|send|delete|remove|cancel|book|confirm|create|update|save|upload|invite|refund|transfer)\\b/i;

function fail(message) {
  const error = new Error(message);
  error.code = 'NEXORA_DECISION_INVALID';
  throw error;
}

function buildDecisionRequest({ analysis, persona, mission, observations = [], previousActions = [] }) {
  if (!analysis || !persona || !mission) fail('analysis, persona and mission are required.');
  return {
    schemaVersion: 1,
    requestId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    modelProvider: 'host-agent-model',
    executionStatus: 'DECISION_REQUEST_ONLY',
    project: {
      name: analysis.product && analysis.product.name || 'Unknown project',
      domainHypothesis: analysis.domain && analysis.domain.domain || 'general-web-app',
      features: Array.isArray(analysis.features) ? analysis.features : []
    },
    persona: {
      id: persona.id,
      role: persona.role,
      goal: persona.goal,
      personality: persona.personality,
      nature: persona.nature,
      technicalConfidence: persona.technicalConfidence,
      device: persona.device,
      contextConstraint: persona.contextConstraint,
      assignedSkillIds: persona.assignedSkillIds || []
    },
    mission: {
      id: mission.id || mission.personaId,
      title: mission.title,
      goal: mission.goal,
      startUrl: mission.startUrl || null,
      preconditions: mission.preconditions || [],
      allowedActions: mission.allowedActions || [],
      prohibitedActions: mission.prohibitedActions || [],
      expectedOutcome: mission.expectedOutcome
    },
    observations: observations.slice(-30),
    previousActions: previousActions.slice(-20),
    decisionContract: {
      requiredFields: ['intent','reasoning','action','target','value','evidenceToCapture','successCriteria','abortIf'],
      actionEnum: [...ACTIONS],
      responseShape: {
        intent: 'one sentence describing the persona goal for this step',
        reasoning: 'brief evidence-based reason for this next step',
        action: 'one action from actionEnum',
        target: 'visible UI locator or URL; null for inspect/ask_user/stop',
        value: 'string or null; never include secrets or real personal data',
        evidenceToCapture: ['observable evidence'],
        successCriteria: ['verifiable condition'],
        abortIf: ['condition that must stop the mission']
      }
    },
    safety: {
      mode: 'read-only-by-default',
      environment: 'unknown-until-verified',
      neverAssumeUrlOrCredentials: true,
      noRealPaymentsMessagesDeletionOrProductionMutations: true,
      requireExplicitApprovalForStateChanges: true,
      noSecretsInDecisionPayload: true,
      planningIsNotExecution: true
    },
    instructions: [
      'Act as this synthetic persona, not as a QA engineer optimizing for passing tests.',
      'Choose one realistic next step based only on supplied observations and mission context.',
      'Do not invent UI elements, routes, page state, browser results or user feedback.',
      'If required information is missing, choose ask_user or stop rather than guessing.',
      'Prefer the smallest safe action that advances the persona goal.',
      'A proposed decision is not an executed action and cannot be reported as a pass.'
    ]
  };
}

function validateDecision(decision, options = {}) {
  if (!decision || typeof decision !== 'object' || Array.isArray(decision)) fail('Decision must be a JSON object.');
  const required = ['intent','reasoning','action','target','value','evidenceToCapture','successCriteria','abortIf'];
  for (const key of required) if (!(key in decision)) fail('Missing required field: ' + key);
  for (const key of ['intent','reasoning']) {
    if (typeof decision[key] !== 'string' || !decision[key].trim()) fail(key + ' must be a non-empty string.');
  }
  if (!ACTIONS.has(decision.action)) fail('Unsupported action: ' + decision.action);
  if (decision.target !== null && typeof decision.target !== 'string') fail('target must be a string or null.');
  if (decision.value !== null && typeof decision.value !== 'string') fail('value must be a string or null.');
  for (const key of ['evidenceToCapture','successCriteria','abortIf']) {
    if (!Array.isArray(decision[key]) || decision[key].some(item => typeof item !== 'string' || !item.trim())) {
      fail(key + ' must be an array of non-empty strings.');
    }
  }
  if (decision.action === 'navigate') {
    if (!decision.target) fail('navigate requires an explicit target URL.');
    let url;
    try { url = new URL(decision.target); } catch { fail('navigate target must be an absolute URL.'); }
    if (!['http:','https:'].includes(url.protocol)) fail('Only HTTP(S) navigation is allowed.');
    if (options.allowedOrigins && !options.allowedOrigins.includes(url.origin)) fail('Navigation origin is outside the approved allowlist.');
  }
  if (['click','fill','press_key','scroll'].includes(decision.action) && !decision.target) {
    fail(decision.action + ' requires a visible UI target.');
  }
  if (decision.action === 'fill' && decision.value === null) fail('fill requires a value.');
  if (decision.action === 'ask_user' && decision.target !== null) fail('ask_user target must be null.');
  if (decision.action === 'stop' && decision.target !== null) fail('stop target must be null.');
  const targetAndValue = [decision.target || '', decision.value || ''].join(' ');
  const potentiallyMutating = ['click','fill','press_key'].includes(decision.action) && MUTATING_WORDS.test(targetAndValue);
  if (potentiallyMutating && options.allowStateChanges !== true) {
    fail('Potential state-changing action blocked by read-only policy; require explicit approval and disposable test data.');
  }
  if (options.environment === 'production' && potentiallyMutating) fail('State-changing actions are prohibited in production.');
  if (decision.action === 'stop' && !decision.abortIf.length) fail('stop requires an abort reason in abortIf.');
  return {
    schemaVersion: 1,
    validationStatus: 'VALIDATED_PROPOSAL_NOT_EXECUTED',
    validatedAt: new Date().toISOString(),
    action: decision.action,
    intent: decision.intent,
    reasoning: decision.reasoning,
    target: decision.target,
    value: decision.value,
    evidenceToCapture: decision.evidenceToCapture,
    successCriteria: decision.successCriteria,
    abortIf: decision.abortIf,
    executionStatus: 'NOT_EXECUTED',
    safety: { policy: options.allowStateChanges === true ? 'explicitly-approved-state-change' : 'read-only' }
  };
}

function createExecutionRecord(validatedDecision, execution = {}) {
  if (!validatedDecision || validatedDecision.validationStatus !== 'VALIDATED_PROPOSAL_NOT_EXECUTED') {
    fail('A validated decision proposal is required.');
  }
  const executed = execution.executed === true;
  if (executed && (!execution.tool || !execution.executedAt || !Array.isArray(execution.evidence) || execution.evidence.length === 0)) {
    fail('Executed records require tool, executedAt and at least one evidence item.');
  }
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    action: validatedDecision.action,
    target: validatedDecision.target,
    status: executed ? 'ACTION_EXECUTED_EVIDENCE_PENDING_ASSERTION' : 'PLANNED_NOT_EXECUTED',
    execution: executed ? {
      tool: execution.tool,
      executedAt: execution.executedAt,
      evidence: execution.evidence
    } : null,
    outcome: 'UNVERIFIED',
    note: executed ? 'Action evidence exists, but success criteria still require verification.' : 'No browser/tool action was executed.'
  };
}

module.exports = { ACTIONS, buildDecisionRequest, validateDecision, createExecutionRecord };
