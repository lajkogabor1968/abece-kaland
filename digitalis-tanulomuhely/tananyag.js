const api = 'https://gxsszmcsqqbyvspcqrvl.supabase.co';
const key = 'sb_publishable_FMQmuakxQorQMwsybj1Xvg_ItXuYkxQ';
const login = document.querySelector('#teacher-login');
const status = document.querySelector('#teacher-status');
let token = '', teacher = false;
const params = new URLSearchParams(location.search);
const material = params.get('tananyag') || (params.has('code') ? sessionStorage.getItem('dtm-return-material') : null);
const allowed = catalog.flatMap(g => g.grades.flatMap(gr => gr[2]))
  .some(a => a[3] && new URL(a[3], base).href === material && new URL(material).origin === location.origin);
const app = 'dtm-text:' + material;
let frame, editButton, editing = false;
const edits = new Map();
const original = new WeakMap();
function el(tag, text) {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
}
async function call(path, options = {}) {
  const response = await fetch(api + path, {...options, headers: {
    apikey: key, ...(token ? {Authorization:'Bearer ' + token} : {}),
    'Content-Type':'application/json', ...options.headers
  }});
  if (!response.ok) throw Error('A művelet sikertelen (' + response.status + ').');
  return response.status === 204 ? null : response.text().then(t => t ? JSON.parse(t) : null);
}
function b64(data) {
  return btoa(String.fromCharCode(...data)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
}
async function signIn() {
  const verifier = b64(crypto.getRandomValues(new Uint8Array(40)));
  const challenge = b64(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier))));
  sessionStorage.setItem('dtm-verifier',verifier);
  const redirect = new URL(location.href);
  redirect.search = '';
  if (allowed) sessionStorage.setItem('dtm-return-material', material);
  else sessionStorage.removeItem('dtm-return-material');
  redirect.hash = '';
  location.assign(api + '/auth/v1/authorize?' + new URLSearchParams({provider:'google',redirect_to:redirect.href,code_challenge:challenge,code_challenge_method:'s256'}));
}
login.onclick = () => {
  if(teacher) { token=''; teacher=false; location.reload(); }
  else signIn().catch(e => status.textContent=e.message);
};
async function auth() {
  const code = params.get('code'), verifier=sessionStorage.getItem('dtm-verifier');
  if (!code || !verifier) return;
  const clean=new URL(location.href); clean.searchParams.delete('code'); if (allowed) clean.searchParams.set('tananyag', material); sessionStorage.removeItem('dtm-return-material'); history.replaceState(null,'',clean);
  sessionStorage.removeItem('dtm-verifier');
  const result=await call('/auth/v1/token?grant_type=pkce',{method:'POST',body:JSON.stringify({auth_code:code,code_verifier:verifier})});
  token=result.access_token;
  teacher=await call('/rest/v1/rpc/is_workshop_teacher',{method:'POST',body:'{}'});
  if (!teacher) { token=''; throw Error('Ez a fiók csak tanulói nézetet használhat.'); }
  login.textContent='Kilépés'; status.textContent='Tanári szerkesztés engedélyezve.';
}
function itemFor(doc, node, source) {
  const url=new URL(doc.URL);
  return JSON.stringify([url.pathname,url.search,url.hash,node.tagName,source]);
}
function attach() {
  let doc;
  try { doc=frame.contentDocument; if (!doc?.body) return; } catch { return; }
  const selector='p,li,span,h1,h2,h3,h4,label,button,td,th,strong,em,option,summary,div';
  function apply(node) {
    if(!node || !node.matches(selector) || node.childNodes.length!==1 || node.firstChild.nodeType!==3) return;
    const current=node.textContent;
    if(!current.trim()) return;
    let record=original.get(node);
    if(!record || (current!==record.shown && current!==record.source)) record={source:current};
    const id=itemFor(doc,node,record.source);
    record.shown=edits.get(id) ?? record.source;
    original.set(node,record);
    if(current!==record.shown) node.firstChild.data=record.shown;
  }
  function scan(n) { if(n.nodeType!==1)return; apply(n); n.querySelectorAll(selector).forEach(apply); }
  scan(doc.body);
  const observer=new MutationObserver(records=>{
    for(const r of records) {
      if(r.type==='characterData') apply(r.target.parentElement);
      else { if(r.target.nodeType===1) apply(r.target); r.addedNodes.forEach(scan); }
    }
  });
  observer.observe(doc.body,{subtree:true,childList:true,characterData:true});
  doc.defaultView.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
  doc.addEventListener('click', async e=>{
    if(!teacher || !editing) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const node=e.target.closest(selector), record=node && original.get(node);
    if(!record) { status.textContent='Válassz egy önálló szövegrészt.'; return; }
    const value=prompt('Szöveg javítása. Ezen a leckeoldalon az azonos szövegű, azonos típusú elemek együtt változnak.',node.textContent);
    if(value===null || !value.trim() || value===node.textContent)return;
    const item=itemFor(doc,node,record.source);
    try {
      await call('/rest/v1/lesson_edits?on_conflict=app,item',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({app,item,content:{text:value}})});
      edits.set(item,value); scan(doc.body); status.textContent='A javítás közzétéve.';
    } catch(err){status.textContent=err.message+' A javítás nem került közzétételre.';}
  },true);
}


function nkKnowledgeMatrix(rows){
 const pupils=new Map(),lessons=new Set();
 for(const r of rows){const n=Number(r.lesson_no),score=Number(r.score),total=Number(r.total);if(!Number.isInteger(n)||n<1||n>50||!Number.isFinite(score)||!Number.isFinite(total)||total<=0||score<0||score>total)continue;
 const key=JSON.stringify([r.class_label,r.student_label]);if(!pupils.has(key))pupils.set(key,{cls:r.class_label,name:r.student_label,cells:new Map()});const cells=pupils.get(key).cells;lessons.add(n);
 const old=cells.get(n),pct=100*score/total,stamp=String(r.submitted_at||''),id=String(r.id||'');
 if(!old)cells.set(n,{pct,stamp,id,attempts:1});
 else{old.attempts++;if(stamp>old.stamp||(stamp===old.stamp&&id>old.id)){old.pct=pct;old.stamp=stamp;old.id=id;}}
 }
 return {lessons:[...lessons].sort((a,b)=>a-b),pupils:[...pupils.values()].sort((a,b)=>String(a.cls).localeCompare(String(b.cls),'hu')||String(a.name).localeCompare(String(b.name),'hu'))};
}

function addResultsDashboard(){
  const host=document.querySelector('.teacher');
  if(!teacher||!token||!host||document.querySelector('#nk5-dashboard'))return;
  const panel=el('details','');panel.id='nk5-dashboard';panel.style.cssText='margin:16px 0;padding:12px;border:1px solid #b9d2cf;border-radius:10px;background:white;color:#183e52';
  panel.append(el('summary','Központi tanári eredménytábla – NyelvtanKaland 5.'));
  panel.append(el('p','A tudáspróbák és játékok gyakorlási eredményei, nem hitelesített érdemjegyek. A tanulókat az osztály és a pontosan megadott név/azonosító párosa különíti el. A tudáspróba és a játék statisztikája külön készül. Az oldalelhagyás nem bizonyít szabálytalanságot; a nem mért érték nem nulla.'));
  const filters=el('div','');filters.style.cssText='display:flex;gap:8px;flex-wrap:wrap;align-items:end';
  function field(label,type){const wrap=el('label',label+' '),input=el('input','');input.type=type;input.style.cssText='display:block;max-width:180px;width:100%;padding:7px;border:1px solid #8da9a6;border-radius:6px;font:inherit';wrap.append(input);filters.append(wrap);return input;}
  const cls=field('Osztály (pontos)','text'),pupil=field('Név / azonosító (pontos)','text'),lesson=field('Lecke (1–50)','number');
  cls.maxLength=20;pupil.maxLength=80;lesson.min=1;lesson.max=50;
  const from=field('Kezdőnap','date'),to=field('Zárónap (beleértve)','date');
  const kind=el('select','');for(const [v,l] of [['','Minden tevékenység'],['tudasproba','Tudáspróba'],['jatek','Játék']]){const o=el('option',l);o.value=v;kind.append(o);}kind.setAttribute('aria-label','Tevékenység típusa');filters.append(kind);
  const refresh=el('button','Szűrés / frissítés'),prev=el('button','Előző oldal'),next=el('button','Következő oldal'),csv=el('button','CSV – látható oldal'),fullCsv=el('button','CSV – összes szűrt eredmény');
  [refresh,prev,next,csv,fullCsv].forEach(x=>{x.type='button';filters.append(x);});panel.append(filters);
  const message=el('p','Nyisd meg a táblát az adatok betöltéséhez.');message.setAttribute('role','status');message.setAttribute('aria-live','polite');panel.append(message);
  const stats=el('div',''),wrap=el('div','');wrap.style.overflowX='auto';
  const knowledge=el('details','');knowledge.append(el('summary','Leckénkénti tanári tudástérkép'),el('p','Válassz egy osztályt vagy egy tanulót a fenti szűrőben, és külön a játékot vagy a tudáspróbát. A térkép a szűrt időszak legutóbbi beküldését mutatja leckénként. A hiányzó adat nem nulla. A játékok eltérő nehézségűek lehetnek; a szabadulószoba a fejezet utolsó leckéjénél jelenik meg, összefoglaló játékadatként.'));
  const matrixKind=el('select','');for(const [v,l] of [['tudasproba','Tudáspróbák'],['jatek','Játékok']]){const o=el('option',l);o.value=v;matrixKind.append(o);}matrixKind.setAttribute('aria-label','Tudástérkép tevékenysége');
  const matrixButton=el('button','Tudástérkép betöltése'),matrixStatus=el('p',''),matrixBody=el('div','');matrixButton.type='button';matrixStatus.setAttribute('role','status');matrixBody.style.overflowX='auto';knowledge.append(matrixKind,matrixButton,matrixStatus,matrixBody);
  panel.append(stats,knowledge,el('h3','Beküldések'),wrap);host.append(panel);
  let offset=0,rows=[],busy=false,loaded=false,applied=null,asof=null,total=0;const size=100;
  const labels=['Dátum','Név / azonosító','Osztály','Lecke','Tevékenység','Pont','Maximum','Százalék','Oldalelhagyások'];
  const fmt=n=>n==null?'Nem mért':Number(n).toLocaleString('hu-HU',{maximumFractionDigits:2});
  const pct=n=>n==null?'–':fmt(n)+'%';
  const activity=a=>a==='jatek'?'Játék':'Tudáspróba';
  const display=r=>[new Date(r.submitted_at).toLocaleString('hu-HU',{timeZone:'Europe/Budapest'}),r.student_label,r.class_label,r.lesson_no,activity(r.activity),r.score,r.total,pct(100*r.score/r.total),r.page_leaves==null?'Nem mért':r.page_leaves];
  function controls(){matrixButton.disabled=busy||!loaded;matrixKind.disabled=busy;refresh.disabled=busy;prev.disabled=busy||offset===0||!loaded;next.disabled=busy||!loaded||offset+size>=total;csv.disabled=fullCsv.disabled=busy||!loaded||!rows.length;[cls,pupil,lesson,from,to,kind].forEach(x=>x.disabled=busy);}
  function table(parent,headers,data){
    const scroll=el('div','');scroll.style.overflowX='auto';const t=el('table','');t.style.cssText='width:100%;border-collapse:collapse;text-align:left;font-size:15px';const head=el('thead',''),tr=el('tr','');
    headers.forEach(v=>{const h=el('th',v);h.scope='col';h.style.cssText='padding:8px;border-bottom:2px solid #b9d2cf';tr.append(h);});head.append(tr);t.append(head);
    const body=el('tbody','');for(const row of data){const tr=el('tr','');row.forEach(v=>{const td=el('td',String(v));td.style.cssText='padding:8px;border-bottom:1px solid #dce7e5';tr.append(td);});body.append(tr);}t.append(body);scroll.append(t);parent.append(scroll);
  }
  function drawStats(d){
    stats.replaceChildren();
    stats.append(el('h3','Összesített eredmények – teljes szűrt adathalmaz'),el('p',fmt(d.total)+' beküldés · '+fmt(d.measured)+' mért oldalelhagyás-adatú próba · összes oldalelhagyás: '+fmt(d.leaves)+' · mért próbánként: '+fmt(d.measured?Number(d.leaves)/Number(d.measured):null)));
    if(!d.total)return;
    stats.append(el('h3','Osztályonkénti statisztika'),el('p','Az osztályátlag a tanulók saját átlagainak átlaga, így a többször gyakorló tanuló nem kap nagyobb súlyt. Névsor nélkül a kitöltési arány nem számítható. Az eltérő nehézségű változatok a régi rekordokból nem különíthetők el.'));
    table(stats,['Osztály','Tevékenység','Egyedi név/azonosító','Beküldés','Átlag','Medián','Minimum','Maximum','Mért próba','Elhagyás összesen'],d.classes.map(c=>[c.class_label,activity(c.activity),fmt(c.pupils),fmt(c.attempts),pct(c.average),pct(c.median),pct(c.minimum),pct(c.maximum),fmt(c.measured),fmt(c.leaves)]));
    stats.append(el('h3','Tanulónkénti statisztika'),el('p','Az első és utolsó százalék a szűrt időszakban; különböző leckék esetén ez nem közvetlen fejlődési bizonyíték. Válassz egyetlen leckét az összehasonlításhoz.'));
    table(stats,['Osztály','Név / azonosító','Tevékenység','Próbák','Átlag','Legjobb','Első','Utolsó','Mért próba','Elhagyás összesen','Elhagyás / mért próba'],d.students.map(s=>[s.class_label,s.student_label,activity(s.activity),fmt(s.attempts),pct(s.average),pct(s.maximum),pct(s.first),pct(s.latest),fmt(s.measured),fmt(s.leaves),fmt(s.leave_average)]));
    if(d.student_count>d.students.length||d.class_count>d.classes.length)stats.append(el('p','A csoportlista legfeljebb 500 sort mutat típusonként. Szűkítsd a szűrést; az összesített beküldésszám ettől még teljes.'));
  }
  function readFilters(){
    if(lesson.value&&(!Number.isInteger(Number(lesson.value))||Number(lesson.value)<1||Number(lesson.value)>50))throw Error('1 és 50 közötti egész leckeszámot adj meg.');
    if(from.value&&to.value&&from.value>to.value)throw Error('A kezdőnap nem lehet későbbi a zárónapnál.');
    return {p_class:cls.value.trim()||null,p_student:pupil.value.trim()||null,p_lesson:lesson.value?Number(lesson.value):null,p_activity:kind.value||null,p_from:from.value||null,p_to:to.value||null};
  }
  async function query(filters,off,limit,snapshot,includeStats){
    if(!teacher||!token)throw Error('Tanári bejelentkezés szükséges.');
    return call('/rest/v1/rpc/nk5_teacher_dashboard',{method:'POST',body:JSON.stringify({...filters,p_offset:off,p_limit:limit,p_asof:snapshot,p_stats:includeStats})});
  }
  async function load(reset=false,target=0){
    if(!teacher||!token||busy)return;
    let f=applied;
    if(reset){try{f=readFilters();}catch(e){message.textContent=e.message;return;}}
    if(!f)return;
    busy=true;controls();message.textContent='Betöltés…';
    try{
      const d=await query(f,reset?0:target,size,reset?null:asof,true);
      if(!teacher||!token)return;
      if(!reset&&Number(d.total)!==total){message.textContent='Az adatok megváltoztak. Frissítsd a szűrést a következő lap előtt.';return;}
      if(reset){matrixBody.replaceChildren();matrixStatus.textContent='A szűrés frissült; töltsd be újra a tudástérképet.';}applied=f;asof=d.asof;total=Number(d.total);offset=reset?0:target;rows=d.rows;loaded=true;
      drawStats(d);wrap.replaceChildren();table(wrap,labels,rows.map(display));
      message.textContent=rows.length?fmt(offset+1)+'–'+fmt(offset+rows.length)+' / '+fmt(total)+' beküldés. Szűrés időpontja: '+new Date(asof).toLocaleString('hu-HU',{timeZone:'Europe/Budapest'}):'Nincs találat.';
    }catch(err){rows=[];loaded=false;applied=null;asof=null;stats.replaceChildren();wrap.replaceChildren();message.textContent='Nem sikerült betölteni: '+err.message+' Jelentkezz be újra, ha a munkamenet lejárt.';}
    finally{busy=false;controls();}
  }
  function safeCsv(v){let s=String(v);if(/^[\s]*[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
  function exportRows(data,name){
    if(!teacher||!token)return;
    const blob=new Blob(['\uFEFF'+[labels,...data.map(display)].map(r=>r.map(safeCsv).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob),a=el('a','');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  
  matrixKind.onchange=()=>{matrixBody.replaceChildren();matrixStatus.textContent='Töltsd be a kiválasztott tevékenységet.';};
  matrixButton.onclick=async()=>{
   if(busy||!teacher||!token||!applied)return;
   if(!applied.p_class&&!applied.p_student){matrixStatus.textContent='Először szűrj egy osztályra vagy tanulóra, majd frissítsd a táblát.';return;}
   const f={...applied,p_activity:matrixKind.value};busy=true;controls();matrixBody.replaceChildren();matrixStatus.textContent='Tudástérkép betöltése…';const all=[];
   try{
    const first=await query(f,0,500,asof,false),count=Number(first.total);
    if(!Number.isInteger(count)||count<0||count>10000)throw Error('Szűkítsd az időszakot: a tudástérkép legfeljebb 10 000 beküldést dolgoz fel.');
    all.push(...first.rows);for(let off=500;off<count;off+=500){const d=await query(f,off,500,asof,false);if(Number(d.total)!==count)throw Error('A találatok megváltoztak. Frissítsd a szűrést.');all.push(...d.rows);}
    if(all.length!==count||new Set(all.map(r=>r.id)).size!==count)throw Error('Hiányos vagy ismétlődő eredménylista.');
    if(!teacher||!token)return;const result=nkKnowledgeMatrix(all);const columns=result.lessons;
    const t=el('table','');t.style.cssText='border-collapse:collapse;white-space:nowrap;text-align:center';const head=el('thead',''),hr=el('tr','');for(const name of ['Osztály','Tanuló',...columns.map(n=>n+'. lecke')]){const th=el('th',name);th.scope='col';th.style.cssText='padding:8px;border-bottom:2px solid #b9d2cf';hr.append(th);}head.append(hr);t.append(head);const body=el('tbody','');
    for(const pupil of result.pupils){const tr=el('tr','');for(const name of [pupil.cls,pupil.name]){const td=el('td',name);td.style.cssText='text-align:left;padding:8px;border-bottom:1px solid #dce7e5';tr.append(td);}for(const n of columns){const c=pupil.cells.get(n),td=el('td',c?Math.round(c.pct)+'%':'–');td.style.cssText='padding:8px;border:1px solid #dce7e5;'+(!c?'background:#f3f5f6;color:#52606b':c.pct>=80?'background:#d9efdf;color:#245537':c.pct>=60?'background:#fff1cb;color:#694d16':'background:#f8dddd;color:#852f2f');if(c)td.title=c.attempts+' beküldés; legutóbbi eredmény: '+new Date(c.stamp).toLocaleString('hu-HU',{timeZone:'Europe/Budapest'});tr.append(td);}body.append(tr);}t.append(body);matrixBody.append(t);matrixStatus.textContent=result.pupils.length+' tanulói név/azonosító · '+columns.length+' lecke · '+count+' beküldés. Zöld: legalább 80%; sárga: 60–79%; piros: 60% alatt; –: nincs adat.';
   }catch(err){matrixStatus.textContent='Nem sikerült: '+err.message;}finally{all.length=0;busy=false;controls();}
  };
  refresh.onclick=()=>load(true);prev.onclick=()=>load(false,Math.max(0,offset-size));next.onclick=()=>load(false,offset+size);
  csv.onclick=()=>{if(!busy&&loaded)exportRows(rows,'nyelvtankaland-5-eredmenyek-oldal.csv');};
  fullCsv.onclick=async()=>{
    if(!teacher||!token||busy||!loaded||!applied)return;
    if(!confirm('A teljes szűrt eredménylista tanulói adatokat tartalmazhat. Csak zárt intézményi tárolóba mentsd. Folytatod?'))return;
    if(total>20000){message.textContent='A biztonságos export felső határa 20 000 sor. Szűkítsd az időszakot.';return;}
    busy=true;controls();const all=[],ids=new Set();
    try{
      for(let off=0;off<total;off+=500){
        message.textContent='Export előkészítése: '+fmt(off)+' / '+fmt(total);
        const d=await query(applied,off,500,asof,false);
        if(Number(d.total)!==total||d.rows.length!==Math.min(500,total-off))throw Error('A találati halmaz megváltozott. Frissítsd a szűrést.');
        for(const row of d.rows){if(ids.has(row.id))throw Error('Ismétlődő rekord – frissítsd a szűrést.');ids.add(row.id);all.push(row);}
      }
      if(all.length!==total)throw Error('Hiányos export.');
      exportRows(all,'nyelvtankaland-5-eredmenyek-teljes.csv');message.textContent='Export előkészítve: '+fmt(all.length)+' sor.';
    }catch(err){message.textContent='Export nem készült: '+err.message;}finally{all.length=0;ids.clear();busy=false;controls();}
  };
  controls();
  panel.ontoggle=()=>{if(panel.open&&!loaded)load(true);};
  window.addEventListener('pagehide',e=>{if(e.persisted){rows=[];loaded=false;stats.replaceChildren();wrap.replaceChildren();matrixBody.replaceChildren();}});
  window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
  if(sessionStorage.getItem('nk5-open-results')==='1'){sessionStorage.removeItem('nk5-open-results');panel.open=true;load(true);}
}


function addMissionBuilder(){
 const host=document.querySelector('.teacher');if(!teacher||!token||!host||document.querySelector('#nk5-missions'))return;
 const topics=["Tanulni tanulunk","A jelek világa","Az emberi kommunikáció fogalma, tényezői és célja","A kommunikáció nem nyelvi jelei","A kommunikációs kapcsolat","Beszélgetés, telefonálás, témaválasztás","Kommunikáció szóban és írásban","Ellenőrizd a tudásodat!","A magyar helyesírás jellemzői","Az írás kialakulása","A magyar ábécé és a betűrend","Szótagolás és elválasztás","A levél és a keltezés","A kiejtés szerinti írásmód","Szövegszerkesztés","Szóelemző írásmód","A hagyomány szerinti és az egyszerűsítő írásmód","Nyelvhelyesség, szövegalkotás/szövegértés","Összefoglalás","Szólások, közmondások, szállóigék","Könyvtárhasználat","Gyakoroljunk!","Az elbeszélés","A leírás","Összefoglalás","A nyelvi szintek","Hangképzés, fonéma","A magánhangzók","Magánhangzótörvények","Mássalhangzók","Szövegértés, szövegalkotás","Mássalhangzók hangkapcsolódási szabályszerűségei I.","Mássalhangzók hangkapcsolódási szabályszerűségei II.","Mássalhangzók hangkapcsolódási szabályszerűségei III.","Részösszefoglalás I.","Részösszefoglalás II.","A szavak szerkezete","A toldalékok: a képzők","A toldalékok: a jelek és a ragok","Összefoglalás","Hangalak és jelentés","Egyjelentésű és többjelentésű szavak","Az azonos alakú és hasonló alakú szavak","A rokon értelmű és ellentétes jelentésű szavak","Hangutánzó és hangulatfestő szavak","Jelentésmező","Szövegalkotás és összefoglalás","Ellenőrizd a tudásodat!","Összefoglalás – rendszerezés I.","Összefoglalás – rendszerezés II."],games={"3":"Kommunikációs üzenetküldő műhely","11":"Betűrendvonat","12":"Szótaghíd","14":"Kiejtés szerinti helyesírási nyomozók","17":"J–LY helyesírási nyomozóiroda","20":"Közmondásépítő","26":"Nyelvi szintek építőtornya","28":"Magánhangzó-válogató","29":"Hangrendi állatmentők","30":"Mássalhangzó-labor","37":"Szóelemgyár – összetett szavak","38":"Képzőműhely","39":"Toldalékvonat","42":"Többjelentésű szavak kincstára","43":"Jelentésnyomozó","44":"Jelentéspárosító","45":"Hangutánzó és hangulatfestő szóvadász","46":"Jelentésmező-szigetek"};
 const panel=el('details','');panel.id='nk5-missions';panel.style.cssText='margin:16px 0;padding:14px;border:1px solid #b9d2cf;border-radius:12px;background:white;color:#183e52';
 panel.append(el('summary','Szócska – tanári küldetéskiosztás'),el('p','Válaszd ki a leckét, a tevékenységet és az ajánlott tanulási utat. Az elkészült linket oszd meg a gyerekekkel, például a KRÉTA-ban vagy az osztály csoportjában. Nem kér belépést vagy külön kódot.'));
 const form=el('div','');form.style.cssText='display:grid;gap:10px;max-width:650px';
 function select(label,opts){const wrap=el('label',label),x=el('select','');x.style.cssText='display:block;width:100%;padding:9px;font:inherit;border-radius:8px;border:1px solid #9cb6b4';for(const [value,name] of opts){const o=el('option',name);o.value=String(value);x.append(o);}wrap.append(x);form.append(wrap);return x;}
 const type=select('Küldetés típusa',[['jatek','Nyelvtani játék'],['tudasproba','Önálló tudáspróba'],['tanulas','Tanulás és gyakorlás']]);
 const lesson=select('Lecke / játék',[]);const mode=select('Ajánlott tanulási út',[['normal','Mester – önálló'],['btmn','Kalandor – támogatott'],['sni','Felfedező – segített']]);
 const out=el('input','');out.type='url';out.readOnly=true;out.setAttribute('aria-label','Megosztható küldetéslink');out.style.cssText='width:100%;padding:10px;border:1px solid #9cb6b4;border-radius:8px;font:inherit';form.append(out);
 const actions=el('div',''),copy=el('button','Link másolása'),preview=el('a','Küldetés előnézete');copy.type='button';preview.target='_blank';preview.rel='noopener noreferrer';preview.style.marginLeft='12px';actions.append(copy,preview);form.append(actions);
 const status=el('p','');status.setAttribute('role','status');form.append(status);panel.append(form,el('p','A link nem tartalmaz tanulói nevet vagy osztályt. A tanulási út ajánlás, a gyermek módosíthatja. A beküldött játék és tudáspróba a meglévő eredménytáblában jelenik meg a leckeszám és tevékenységtípus alapján. Ez még nem névsoros vagy egyedi feladata­zonosítós kiosztás; egy link önmagában nem igazolja, hogy minden tanuló teljesítette a küldetést.'));host.append(panel);
 function update(){const u=new URL('nyelvtankaland-5.html',location.href);u.searchParams.set('lecke',lesson.value);u.searchParams.set('kuldetes',type.value);u.searchParams.set('mode',mode.value);out.value=u.href;preview.href=u.href;status.textContent='';}
 function rebuild(){const last=lesson.value;lesson.replaceChildren();topics.forEach((t,i)=>{const n=i+1;if(type.value==='jatek'&&!games[n])return;const o=el('option',n+'. '+(type.value==='jatek'?games[n]:t));o.value=String(n);lesson.append(o);});if([...lesson.options].some(o=>o.value===last))lesson.value=last;update();}
 type.onchange=rebuild;lesson.onchange=mode.onchange=update;copy.onclick=async()=>{try{await navigator.clipboard.writeText(out.value);status.textContent='A küldetéslink másolva.';}catch(e){out.focus();out.select();status.textContent='A link kijelölve; másold a vágólapra.';}};rebuild();
}

async function start() {
  try {await auth();} catch(e){status.textContent=e.message;}
  const resultLink=el('button','Központi tanári eredménytábla');resultLink.type='button';document.querySelector('.teacher').append(resultLink);
  resultLink.onclick=()=>{if(teacher){const panel=document.querySelector('#nk5-dashboard');if(panel){panel.open=true;panel.scrollIntoView({block:'start'});}}else{sessionStorage.setItem('nk5-open-results','1');signIn().catch(e=>status.textContent=e.message);}};
  if(teacher){addResultsDashboard();addMissionBuilder();}
  if(!allowed)return;
  const panel=document.querySelector('.teacher');
  document.querySelector('main').prepend(panel);
  const back=el('a','Vissza a tananyagokhoz'); back.href=location.pathname; panel.prepend(back);
  if(teacher) {
    editButton=el('button','Szöveg javítása'); panel.append(editButton);
    editButton.onclick=()=>{editing=!editing;editButton.textContent=editing?'Javítás befejezése':'Szöveg javítása';status.textContent=editing?'Kattints a javítandó szövegre.':'';};
  }
  const rows=await call('/rest/v1/lesson_edits?'+new URLSearchParams({app:'eq.'+app,select:'item,content'}));
  rows.forEach(r=>{if(typeof r.content?.text==='string') edits.set(r.item,r.content.text);});
  frame=el('iframe',''); frame.title='Megnyitott tananyag';frame.style.cssText='width:100%;height:80vh;border:0';
  frame.onload=attach;frame.src=material;panel.after(frame);
}
start().catch(e=>status.textContent=e.message);
