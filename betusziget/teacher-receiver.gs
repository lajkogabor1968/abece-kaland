// Betűsziget – az aranymajsás fiókban futtatandó Google Apps Script.
const BANK_URL = 'https://raw.githubusercontent.com/lajkogabor1968/abece-kaland/62eff15dffac882586c3f681a5b353011a52357c/betusziget/bank.js';
function setup() {
  const props=PropertiesService.getScriptProperties();
  if(props.getProperty('SHEET_ID')) { Logger.log(SpreadsheetApp.openById(props.getProperty('SHEET_ID')).getUrl()); return; }
  const ss=SpreadsheetApp.create('Betűsziget – dolgozatok és eredmények');
  const s=ss.getSheets()[0]; s.setName('Eredmények');
  s.appendRow(['Dolgozatazonosító','Szerveridő','Név','Osztály','Pont','Maximum','Százalék','Oldalelhagyások']);
  const d=ss.insertSheet('Részletes válaszok');
  d.appendRow(['Dolgozatazonosító','Szerveridő','Név','Sorszám','Feladatazonosító','Évfolyam','Kérdés','Tanuló válasza','Helyes válasz','Kihagyva','Pont']);
  [s,d].forEach(t=>{t.setFrozenRows(1);t.getRange(1,1,1,t.getLastColumn()).setFontWeight('bold').setBackground('#d9ead3');});
  s.getRange('G2:G').setNumberFormat('0.0%');
  props.setProperty('SHEET_ID',ss.getId()); Logger.log(ss.getUrl());
}
function normalize(s){return String(s==null?'':s).normalize('NFC').replace(/[\u2010\u2011]/g,'-').replace(/\s+/g,' ').trim();}
function literal(s){return "'"+String(s==null?'':s);}
function doPost(e){
  let p;
  try {
    p=JSON.parse(e.parameter.payload||'{}');
    if(!/^[a-zA-Z0-9-]{16,80}$/.test(p.id)||typeof p.name!=='string'||!p.name.trim()||p.name.length>80||!Array.isArray(p.answers)||p.answers.length!==40)throw Error('Érvénytelen dolgozat.');
    const source=UrlFetchApp.fetch(BANK_URL).getContentText();
    const bank=JSON.parse(source.match(/const BANK = (.*?);\n/s)[1]);
    const topics=JSON.parse(source.match(/const TOPICS = (.*?);\n/s)[1]).filter(t=>t.grade<=6);
    const map=new Map(bank.filter(q=>q.grade<=6&&q.type!=='dictation').map(q=>[q.id,q]));
    const ids=new Set(),covered=new Set(),now=new Date();
    const details=p.answers.map((a,i)=>{
      const q=map.get(a.id);
      if(!q||ids.has(a.id)||typeof a.raw!=='string'||a.raw.length>500||typeof a.skipped!=='boolean')throw Error('Érvénytelen válasz.');
      ids.add(a.id);covered.add(q.topic);
      const point=scoreAnswer(q,a);
      return [p.id,now,literal(p.name),i+1,q.id,q.grade,literal(q.prompt),literal(a.raw),literal(q.answer),a.skipped?'Igen':'Nem',point];
    });
    if(topics.some(t=>!covered.has(t.id)))throw Error('Hiányzó témakör.');
    const score=details.reduce((n,r)=>n+r[10],0);
    const lock=LockService.getScriptLock();lock.waitLock(20000);
    try {
      const ss=SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'));
      const s=ss.getSheetByName('Eredmények'),d=ss.getSheetByName('Részletes válaszok');
      const found=s.getRange('A:A').createTextFinder(p.id).matchEntireCell(true).findNext();
      if(found){const old=s.getRange(found.getRow(),5).getValue();return reply({id:p.id,ok:true,score:old});}
      const orphan=d.getRange('A:A').createTextFinder(p.id).matchEntireCell(true).findAll().map(x=>x.getRow()).sort((a,b)=>b-a);
      orphan.forEach(row=>d.deleteRow(row));
      d.getRange(d.getLastRow()+1,1,40,11).setValues(details);
      s.appendRow([p.id,now,literal(p.name),'7.',score,40,score/40,Math.max(0,Math.min(10000,Math.floor(Number(p.away)||0)))]);
      SpreadsheetApp.flush();
      return reply({id:p.id,ok:true,score});
    } finally {lock.releaseLock();}
  }catch(err){return reply({id:p&&p.id||'',ok:false});}
}
function reply(obj){
  const json=JSON.stringify(obj).replace(/</g,'\\u003c');
  return HtmlService.createHtmlOutput('<script>window.top.postMessage('+json+',"https://lajkogabor1968.github.io");</script>').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function scoreAnswer(q,a){
  if(a.skipped)return 0;
  const actual=normalize(a.raw);
  const sentence=q.type==='fix'||q.type==='dictation'||['date-009','date-010','sim7-001'].includes(q.id);
  return [q.answer,...(q.accepted||[])].map(normalize).some(m=>m===actual||(sentence&&m.endsWith('.')&&!m.endsWith('...')&&actual===m.slice(0,-1)))?1:0;
}
