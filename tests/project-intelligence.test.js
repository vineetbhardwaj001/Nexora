const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {analyzeProject}=require('../qa/project-intelligence');
const library=require('../qa/skill-library.json');

test('project discovery infers healthcare signals and labels the result as static inspection',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'nexora-discovery-'));
 try{
  fs.mkdirSync(path.join(root,'src','appointments'),{recursive:true});
  fs.writeFileSync(path.join(root,'package.json'),JSON.stringify({name:'clinic-appointments',dependencies:{react:'18'}}));
  fs.writeFileSync(path.join(root,'src','appointments','page.tsx'),'export default function Page(){}');
  fs.writeFileSync(path.join(root,'README.md'),'A clinic appointment booking application for patients and doctors.');
  const result=analyzeProject(root);
  assert.equal(result.executionStatus,'static-project-inspection-only');
  assert.equal(result.domain.domain,'healthcare');
  assert.ok(result.customerSegments.some(s=>s.name.includes('patient')));
  assert.ok(result.frameworks.includes('React'));
  assert.ok(result.limitations.some(s=>s.includes('not a live browser test')));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('project discovery skips dependency and build directories',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'nexora-discovery-ignore-'));
 try{
  fs.mkdirSync(path.join(root,'node_modules','secret-package'),{recursive:true});
  fs.mkdirSync(path.join(root,'src'),{recursive:true});
  fs.writeFileSync(path.join(root,'node_modules','secret-package','index.js'),'');
  fs.writeFileSync(path.join(root,'src','app.js'),'');
  assert.equal(analyzeProject(root).inventory.filesInspected,1);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('skill library has 100 unique reusable definitions',()=>{
 assert.equal(library.count,100);
 assert.equal(library.skills.length,100);
 assert.equal(new Set(library.skills.map(s=>s.id)).size,100);
 assert.ok(library.skills.every(s=>s.instruction&&s.evidenceRequired.length));
});
test('installer manifest includes project-aware assets',()=>{
 const cli=fs.readFileSync(path.join(__dirname,'..','bin','nexora.js'),'utf8');
 for(const file of ['qa/project-intelligence.js','qa/skill-library.json','.agents/skills/nexora-project-aware-testing/SKILL.md','.kilo/commands/nexora-test.md','.github/prompts/nexora-test.prompt.md'])assert.ok(cli.includes(file),'Missing installer entry: '+file);
});
