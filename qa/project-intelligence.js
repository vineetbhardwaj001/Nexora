'use strict';
const fs = require('node:fs');
const path = require('node:path');
const IGNORED = new Set(['.git','node_modules','dist','build','coverage','.next','.nuxt','.output','vendor','reports','playwright-report','test-results']);
const MAX_FILES = 5000, MAX_DEPTH = 9;
function readJson(file){try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch{return null;}}
function walk(root,current=root,depth=0,out=[]){
 if(depth>MAX_DEPTH||out.length>=MAX_FILES)return out;
 let entries;try{entries=fs.readdirSync(current,{withFileTypes:true});}catch{return out;}
 for(const entry of entries){if(entry.name.startsWith('.')&&entry.name!=='.github')continue;if(IGNORED.has(entry.name))continue;
  const abs=path.join(current,entry.name);if(entry.isSymbolicLink())continue;
  if(entry.isDirectory())walk(root,abs,depth+1,out);else if(entry.isFile())out.push(path.relative(root,abs).split(path.sep).join('/'));
  if(out.length>=MAX_FILES)break;
 }return out;
}
function classifyDomain(files,meta){
 const corpus=[meta.name||'',meta.description||'',...files.slice(0,1500)].join(' ').toLowerCase();
 const rules=[
 ['ecommerce',/\b(shop|store|cart|checkout|product|catalog|inventory|order|payment|commerce)\b/g],
 ['healthcare',/\b(patient|clinic|hospital|doctor|medical|health|appointment|reception)\b/g],
 ['booking',/\b(booking|reservation|schedule|availability|slot|ticket|event)\b/g],
 ['education',/\b(course|student|teacher|lesson|learning|classroom|exam|school)\b/g],
 ['finance',/\b(invoice|billing|wallet|bank|transaction|subscription|finance|accounting)\b/g],
 ['saas',/\b(workspace|organization|tenant|dashboard|admin|team|project|workflow)\b/g],
 ['content',/\b(blog|article|cms|editor|publication|media|content)\b/g]];
 const scores=rules.map(([domain,re])=>({domain,score:(corpus.match(re)||[]).length})).sort((a,b)=>b.score-a.score);
 return !scores[0]||!scores[0].score?{domain:'general-web-app',confidence:'low',candidates:scores.slice(0,3)}:{domain:scores[0].domain,confidence:scores[0].score>=8?'medium':'low',candidates:scores.slice(0,3)};
}
function detectFramework(pkg,files){
 const deps={...(pkg.dependencies||{}),...(pkg.devDependencies||{})};
 const checks=[['Next.js',['next']],['React',['react']],['Vue',['vue']],['Nuxt',['nuxt']],['Angular',['@angular/core']],['SvelteKit',['@sveltejs/kit']],['Svelte',['svelte']],['Astro',['astro']],['Express',['express']],['NestJS',['@nestjs/core']],['Fastify',['fastify']],['Django',[]],['Flask',[]],['Laravel',[]]];
 const found=checks.filter(([name,keys])=>keys.some(k=>deps[k])||(name==='Django'&&files.some(f=>/(^|\/)manage\.py$/.test(f)))||(name==='Flask'&&files.some(f=>/(^|\/)(app|wsgi)\.py$/.test(f)))||(name==='Laravel'&&files.includes('artisan'))).map(([name])=>name);
 return found.length?found:['Unknown / framework not inferred'];
}
function detectRoutes(files){return files.filter(f=>/(^|\/)(app|pages|routes|router|views)(\/|$)/i.test(f)&&/\.(tsx?|jsx?|vue|svelte|py|php)$/.test(f)).slice(0,250).map(file=>({file,routeHint:file.replace(/\.(tsx?|jsx?|vue|svelte|py|php)$/,'').replace(/(^|\/)(page|index|route|view)$/i,'').replace(/(^|\/)(app|pages|routes|router|views)\//i,'/')}));}
function discoverRoles(domain,corpus){
 const map={
 ecommerce:[['first-time shopper','Understand the store, discover a product and assess trust.'],['price-conscious shopper','Compare price, discounts, delivery charges and total cost.'],['careful buyer','Inspect product details, availability and policies.'],['returning customer','Find account controls and repeat-purchase paths.'],['mobile impulse shopper','Discover products on a narrow touch screen.']],
 healthcare:[['first-time patient','Understand services and find an appointment path.'],['returning patient','Find existing appointment information.'],['time-constrained patient','Find suitable availability efficiently.'],['accessibility-focused patient','Navigate forms with accessible controls.'],['reception staff member','Inspect authorized appointment-management workflows.']],
 booking:[['first-time booker','Understand options, availability, fees and confirmation.'],['comparison-focused customer','Compare times, cancellation rules and total price.'],['last-minute customer','Find near-term availability.'],['returning customer','Review or manage a reservation.'],['mobile booking customer','Complete discovery on a small screen.']],
 education:[['prospective learner','Understand course value and enrollment.'],['active student','Find materials and continue a lesson.'],['busy learner','Resume progress efficiently.'],['instructor','Inspect class-management workflows.'],['guardian or sponsor','Find relevant progress information if supported.']],
 finance:[['new account holder','Understand onboarding, fees and account controls.'],['careful transaction user','Review amounts and confirmations.'],['small-business operator','Find billing and reporting workflows.'],['returning account holder','Review history and settings.'],['accessibility-focused user','Navigate financial information clearly.']],
 saas:[['new workspace member','Complete a first meaningful task.'],['team administrator','Discover member and role settings.'],['power user','Find advanced workflows.'],['busy team member','Complete a common task efficiently.'],['returning user','Resume work and locate saved state.']],
 content:[['first-time reader','Find relevant content and understand navigation.'],['research-focused reader','Search, filter and verify content context.'],['returning subscriber','Resume reading and saved content.'],['content author','Inspect authoring and preview workflow.'],['mobile reader','Read comfortably on a small screen.']],
 'general-web-app':[['first-time visitor','Understand the product and find its primary action.'],['returning user','Resume a task and locate information.'],['mobile-first user','Complete a key task on a narrow viewport.'],['accessibility-focused user','Navigate with keyboard and semantic structure.'],['power user','Explore advanced controls and efficient paths.']]};
 const rows=map[domain]||map['general-web-app'];
 const roles=rows.map(([name,goal],i)=>({id:'SEG-'+String(i+1).padStart(2,'0'),name,goal,evidenceBasis:'domain-and-repository-structure heuristic',confidence:'hypothesis-not-market-research'}));
 if(/admin|staff|role|permission|tenant|organization/i.test(corpus))roles.push({id:'SEG-ADMIN',name:'authorized administrator',goal:'Inspect admin workflows using an approved test account.',evidenceBasis:'admin/role-related repository signals',confidence:'hypothesis-not-market-research'});
 return roles;
}
function analyzeProject(projectPath=process.cwd()){
 const root=path.resolve(projectPath);if(!fs.existsSync(root)||!fs.statSync(root).isDirectory())throw new Error('Project directory does not exist: '+root);
 const files=walk(root),pkg=readJson(path.join(root,'package.json'))||{};
 const readmePath=['README.md','readme.md','README.MD'].map(n=>path.join(root,n)).find(fs.existsSync);
 const readme=readmePath?fs.readFileSync(readmePath,'utf8').slice(0,20000):'';
 const product={name:pkg.name||path.basename(root),description:pkg.description||''};
 const domain=classifyDomain(files,product),corpus=[product.name,product.description,readme,files.join(' ')].join(' ');
 const routeFiles=detectRoutes(files),extensions=[...new Set(files.map(f=>path.extname(f).toLowerCase()).filter(Boolean))].sort();
 const features=[
 ['authentication',/\b(auth|login|signup|register|session|password)\b/i],
 ['payments-or-billing',/\b(payment|checkout|billing|invoice|stripe|razorpay)\b/i],
 ['forms-and-validation',/\b(form|validation|schema|zod|yup)\b/i],
 ['administration-and-roles',/\b(admin|staff|role|permission|tenant)\b/i],
 ['search-and-discovery',/\b(search|filter|catalog|product)\b/i],
 ['appointments-or-booking',/\b(appointment|booking|reservation|availability|schedule)\b/i],
 ['notifications',/\b(notification|email|sms|whatsapp|webhook)\b/i],
 ['uploads-and-media',/\b(upload|storage|media|image|file)\b/i]
 ].filter(([,re])=>re.test(corpus)).map(([feature])=>feature);
 return {schemaVersion:1,generatedAt:new Date().toISOString(),projectRoot:root,executionStatus:'static-project-inspection-only',product,domain,frameworks:detectFramework(pkg,files),languages:extensions,scripts:pkg.scripts||{},features,routeFiles,routeDiscoveryLimit:'File-path heuristics only; verify routes against the running application.',customerSegments:discoverRoles(domain.domain,corpus),evidence:[{source:'project-root',detail:path.basename(root),kind:'observed'},{source:'package.json',detail:product.name,kind:pkg.name?'observed':'inferred'},{source:'file-inventory',detail:files.length+' files inspected (cap '+MAX_FILES+')',kind:'observed'},{source:'route-file-inventory',detail:routeFiles.length+' route-like files found',kind:'observed'},{source:'domain-classifier',detail:domain.domain+' ('+domain.confidence+' confidence)',kind:'inferred'}],inventory:{filesInspected:files.length,truncatedAtCap:files.length>=MAX_FILES},limitations:['Static inspection only; not a live browser test.','Customer segments are hypotheses, not validated market research or real customer data.','Route hints come from filenames and must be verified.','No AI model, browser, network request, test account or external service was invoked.']};
}
module.exports={analyzeProject,walk,detectRoutes,classifyDomain,discoverRoles};
