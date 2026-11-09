const test = require('node:test');
const assert = require('node:assert/strict');
const { buildDecisionRequest, validateDecision, createExecutionRecord } = require('../qa/mission-engine');

const analysis = { product:{name:'Clinic Portal'}, domain:{domain:'healthcare'}, features:['appointments-or-booking'] };
const persona = { id:'NX-P-0001', role:'first-time patient', goal:'Find an appointment', personality:'cautious', nature:'checks details', technicalConfidence:'beginner', device:'mobile-390', contextConstraint:'slow-network', assignedSkillIds:['NX-BOOK-01'] };
const mission = { id:'MISSION-1', title:'Find appointment', goal:persona.goal, startUrl:'https://staging.example.test', preconditions:[], allowedActions:['Read-only navigation'], prohibitedActions:['Real payments'], expectedOutcome:'Find available slots' };

function decision(overrides = {}) {
  return { intent:'Inspect available appointment options', reasoning:'The page shows an appointment entry point.', action:'inspect', target:null, value:null, evidenceToCapture:['Visible appointment options'], successCriteria:['Options are observable'], abortIf:['Unexpected production environment'], ...overrides };
}

test('builds a host-agent decision request without calling an external provider',()=>{
 const request=buildDecisionRequest({analysis,persona,mission});
 assert.equal(request.modelProvider,'host-agent-model');
 assert.equal(request.executionStatus,'DECISION_REQUEST_ONLY');
 assert.equal(request.persona.id,persona.id);
 assert.equal(request.safety.planningIsNotExecution,true);
 assert.ok(request.decisionContract.actionEnum.includes('ask_user'));
});

test('validates a safe inspect proposal but never marks it executed',()=>{
 const validated=validateDecision(decision());
 assert.equal(validated.validationStatus,'VALIDATED_PROPOSAL_NOT_EXECUTED');
 assert.equal(validated.executionStatus,'NOT_EXECUTED');
 const record=createExecutionRecord(validated);
 assert.equal(record.status,'PLANNED_NOT_EXECUTED');
 assert.equal(record.outcome,'UNVERIFIED');
});

test('rejects malformed decisions and unsupported actions',()=>{
 assert.throws(()=>validateDecision({}),/Missing required field/);
 assert.throws(()=>validateDecision(decision({action:'purchase'})),/Unsupported action/);
});

test('requires absolute HTTP(S) URLs and enforces optional origin allowlist',()=>{
 assert.throws(()=>validateDecision(decision({action:'navigate',target:'/appointments'})),/absolute URL/);
 assert.throws(()=>validateDecision(decision({action:'navigate',target:'https://evil.example'}),{allowedOrigins:['https://staging.example.test']}),/allowlist/);
 assert.equal(validateDecision(decision({action:'navigate',target:'https://staging.example.test/appointments'}),{allowedOrigins:['https://staging.example.test']}).action,'navigate');
});

test('blocks risky state-changing UI targets under the default read-only policy',()=>{
 assert.throws(()=>validateDecision(decision({action:'click',target:'button: Pay now'})),/read-only policy/);
 assert.throws(()=>validateDecision(decision({action:'click',target:'button: Delete account'}),{environment:'production',allowStateChanges:true}),/prohibited in production/);
});

test('state-changing proposals require explicit approval and executed records require evidence',()=>{
 const approved=validateDecision(decision({action:'click',target:'button: Confirm appointment'}),{allowStateChanges:true,environment:'staging'});
 assert.equal(approved.safety.policy,'explicitly-approved-state-change');
 assert.throws(()=>createExecutionRecord(approved,{executed:true,tool:'browser'}),/evidence/);
 const record=createExecutionRecord(approved,{executed:true,tool:'Playwright',executedAt:'2026-11-09T12:00:00.000Z',evidence:['screenshot: appointment-confirmation.png']});
 assert.equal(record.status,'ACTION_EXECUTED_EVIDENCE_PENDING_ASSERTION');
 assert.equal(record.outcome,'UNVERIFIED');
});
