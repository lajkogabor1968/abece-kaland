const fs=require('fs'),vm=require('vm'),assert=require('assert');
const base=__dirname+'/';
const source=fs.readFileSync(base+'bank.js','utf8')+'\n'+fs.readFileSync(base+'app.js','utf8').replace(/render\(\);\s*$/,'')+'\nthis.api={BANK,DICTATIONS,PASSAGES,TOPICS,assess,makeQueue,customQueue,summaryQueue,schoolCompatible,correctDiff,norm,mastered,profile,db,begin,submit,next,finish,setUI:(x)=>{ui=x},getSession:()=>session};';
const nodes=new Map();const node=sel=>{if(!nodes.has(sel))nodes.set(sel,{innerHTML:'',textContent:'',value:'',classList:{add(){},remove(){}},focus(){},select(){}});return nodes.get(sel);};
const ctx={console,Intl,Date,Math,Map,Set,JSON,URLSearchParams,location:{search:''},localStorage:{getItem(){return null},setItem(){}},document:{querySelector:node,querySelectorAll:()=>[],addEventListener(){},body:{appendChild(){}}},window:{addEventListener(){},scrollTo(){}},matchMedia:()=>({matches:true}),setTimeout(){}};
vm.createContext(ctx);vm.runInContext(source,ctx);const a=ctx.api;
assert(a.BANK.length>=1314);assert.equal(a.DICTATIONS.length,156);assert.equal(new Set([...a.BANK,...a.DICTATIONS].map(x=>x.id)).size,a.BANK.length+a.DICTATIONS.length);for(const t of a.TOPICS)assert(a.BANK.filter(q=>q.topic===t.id).length>=50,t.id);assert.equal(a.BANK.filter(a.schoolCompatible).length,777);
for(const q of [...a.BANK,...a.DICTATIONS]){
 assert(q.prompt&&q.answer&&q.why&&q.hint,q.id);assert(a.TOPICS.some(t=>t.id===q.topic),q.id);
 assert(a.assess(q,q.answer).exact,q.id+' canonical');
 assert(a.assess(q,'  '+q.answer+'  ').exact,q.id+' trim');
 assert(a.assess(q,q.answer.normalize('NFD')).exact,q.id+' Unicode');
 assert(!a.assess(q,'').exact,q.id+' empty');
 assert(!a.assess(q,q.answer+'X').exact,q.id+' extra');
 if(q.type!=='choice')assert.equal(q.wrong.length,0,q.id+' no misspelled distractors');
 if(q.type==='choice')assert.equal(new Set([q.answer,...q.wrong]).size,1+q.wrong.length);
 for(const alt of q.accepted||[])assert(a.assess(q,alt).exact,q.id+' alt');
 const unaccent=q.answer.normalize('NFD').replace(/[\u0300-\u036f]/g,'');if(unaccent!==q.answer)assert(!a.assess(q,unaccent).exact,q.id+' accent matters');
 if(q.answer.toLowerCase()!==q.answer&&!(q.accepted||[]).includes(q.answer.toLowerCase()))assert(!a.assess(q,q.answer.toLowerCase()).exact,q.id+' case matters');
}
for(let trial=0;trial<100;trial++)for(const grade of [5,6,7,8]){
 a.profile().grade=grade;
 for(const mode of ['practice','exam','dictation'])for(const count of [5,10,20,30]){
 const q=a.makeQueue(mode,'all',count);assert.equal(q.length,Math.min(count,mode==='dictation'?({5:18,6:36,7:48,8:60}[grade]):a.BANK.filter(x=>x.grade<=grade).length));assert.equal(new Set(q.map(x=>x.id)).size,q.length);assert(q.every(x=>x.grade<=grade));
 if(mode==='exam'&&grade>=6&&count>=5){for(let g=5;g<=grade;g++)assert(q.some(x=>x.grade===g),'cumulative coverage '+grade);assert(q.some(x=>x.topic==='geo'));}
 }
}
a.profile().grade=7;
assert.equal(a.makeQueue('practice','geo',50).length,50);
assert.equal(a.makeQueue('dictation','geo',10).length,6);
assert.equal(a.assess(a.DICTATIONS[0],a.DICTATIONS[0].answer.replace('.','')).wordErrors,0);
assert.equal(a.assess(a.DICTATIONS[0],a.DICTATIONS[0].answer.replace('.','')).exact,false);
assert(a.correctDiff('aranypataki','arany-pataki').includes('<mark>-</mark>'));
assert.equal(a.mastered({dates:['1','2','3'],lastOK:true}),true);
assert.equal(a.mastered({dates:['1','2'],lastOK:true}),false);
assert.equal(a.mastered({dates:['1','2','3'],lastOK:false}),false);
// A felület nélküli munkamenet-teszt valódi pontozási utakat futtat.
const q=a.BANK.find(x=>x.id==='geo-007');a.begin([q],'exam','teszt',true);node('#answer').value=q.answer;a.submit();assert.equal(a.getSession().results.length,1);const xp=a.profile().xp;a.submit();assert.equal(a.getSession().results.length,1);assert.equal(a.profile().xp,xp);a.next();assert.equal(a.getSession().finished,true);assert.equal(a.profile().history[0].ok,1);
a.begin([q],'exam','ismétlés',true);node('#answer').value=q.answer;a.submit();assert.equal(a.profile().xp,xp,'no same-day XP farming');a.next();
a.begin([q],'practice','hibás',true);node('#answer').value='Bükki';a.submit();assert(a.profile().wrong[q.id]);a.next();assert.equal(a.getSession().finished,false,'practice needs repair');

assert.equal(a.PASSAGES.length,8);
for(const p of a.PASSAGES){assert.equal(p.sentences.length,12);for(const id of p.sentences){const q=a.DICTATIONS.find(x=>x.id===id);assert(q&&q.passage===p.id);assert.equal(q.grade,p.grade);}}
const oq=a.BANK.find(x=>x.type==='order');a.begin([oq],'exam','rendezés',true);const os=a.getSession();os.ordered=oq.words.map(w=>os.options.indexOf(w));a.submit();assert(os.results[0].exact);a.next();
const text=a.PASSAGES[0],tq=text.sentences.map(id=>a.DICTATIONS.find(q=>q.id===id));a.begin(tq,'dictation',text.title,false,{passage:text,blind:true});const blindBefore=JSON.stringify(a.profile().stats);
for(let i=0;i<tq.length;i++){a.getSession().heard=true;node('#answer').value=tq[i].answer;a.submit();if(i===0){assert.equal(JSON.stringify(a.profile().stats),blindBefore,'blind dictation hides score until completion');assert(!node('#app').innerHTML.includes(tq[i].why),'no early model feedback');}a.next();}
assert(a.getSession().finished);assert.equal(a.profile().history[0].total,12);assert.equal(a.profile().history[0].ok,12);
for(const grade of [5,6,7,8]){a.profile().grade=grade;const groups=a.TOPICS.filter(t=>t.grade<=grade).map(t=>({t,items:a.BANK.filter(q=>q.topic===t.id&&q.grade<=grade)}));for(const g of groups){const q=a.customQueue([g],50);assert.equal(q.length,50);assert.equal(new Set(q.map(x=>x.id)).size,50);}const q=a.customQueue(groups,50);assert.equal(q.length,50);assert.equal(new Set(q.map(x=>x.topic)).size,groups.length);const school=a.summaryQueue(grade);assert.equal(school.length,40);assert(school.every(a.schoolCompatible));}
console.log('PASS: '+(a.BANK.length+a.DICTATIONS.length)+' answer items, four grades, custom tests, official tests, dictation, normalization, scoring, XP and repair.');

