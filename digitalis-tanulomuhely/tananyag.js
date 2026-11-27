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

function addResultsDashboard(){
  const host=document.querySelector('.teacher');
  if(!host||document.querySelector('#nk5-dashboard'))return;
  const panel=el('details','');panel.id='nk5-dashboard';panel.style.cssText='margin:16px 0;padding:12px;border:1px solid #b9d2cf;border-radius:10px;background:white;color:#183e52';
  panel.append(el('summary','NyelvtanKaland 5. – központi tanári eredménytábla'));
  const explain=el('p','A beküldött tudáspróbák és játékok eredményei. A tanulók megadott neve vagy azonosítója nem hitelesített; ezek gyakorlási adatok, nem automatikus érdemjegyek. Az oldalelhagyások száma lap- és ablakváltást jelez, önmagában nem bizonyít szabálytalanságot. A régi beküldéseknél nem mért érték látható.');panel.append(explain);
  const filters=el('div','');filters.style.cssText='display:flex;gap:8px;flex-wrap:wrap;align-items:end';
  function field(label,type){const wrap=el('label',label+' '),input=el('input','');input.type=type;input.style.cssText='display:block;max-width:180px;padding:7px;border:1px solid #8da9a6;border-radius:6px;font:inherit';wrap.append(input);filters.append(wrap);return input;}
  const cls=field('Osztály (pontos egyezés)','text'), pupil=field('Név / azonosító (pontos egyezés)','text'),lesson=field('Lecke száma (1–50)','number');lesson.min=1;lesson.max=50;
  const kind=el('select','');for(const [v,l] of [['','Minden tevékenység'],['tudasproba','Tudáspróba'],['jatek','Játék']]){const o=el('option',l);o.value=v;kind.append(o);}kind.setAttribute('aria-label','Tevékenység típusa');filters.append(kind);
  const refresh=el('button','Szűrés / frissítés'),prev=el('button','Előző oldal'),next=el('button','Következő oldal'),csv=el('button','CSV – látható oldal');[refresh,prev,next,csv].forEach(x=>{x.type='button';filters.append(x);});panel.append(filters);
  const message=el('p','Nyisd meg a táblát az adatok betöltéséhez.');message.setAttribute('role','status');panel.append(message);
  const wrap=el('div','');wrap.style.overflowX='auto';panel.append(wrap);host.append(panel);
  let offset=0,rows=[],busy=false,loaded=false;const size=100;prev.disabled=true;next.disabled=true;csv.disabled=true;
  const display=r=>[new Date(r.submitted_at).toLocaleString('hu-HU'),r.student_label,r.class_label,r.lesson_no,r.activity==='jatek'?'Játék':'Tudáspróba',r.score,r.total,Math.round(100*r.score/r.total)+'%',r.page_leaves==null?'Nem mért':r.page_leaves];
  async function load(reset=false){if(!teacher||!token||busy)return;if(reset)offset=0;if(lesson.value&&(Number(lesson.value)<1||Number(lesson.value)>50||!Number.isInteger(Number(lesson.value)))){message.textContent='1 és 50 közötti leckeszámot adj meg.';return;}busy=true;refresh.disabled=prev.disabled=next.disabled=csv.disabled=true;wrap.replaceChildren();message.textContent='Betöltés…';try{
    const q=new URLSearchParams({select:'submitted_at,student_label,class_label,lesson_no,activity,score,total,page_leaves',order:'submitted_at.desc,id.desc',limit:String(size+1),offset:String(offset)});
    if(cls.value.trim())q.set('class_label','eq.'+cls.value.trim());if(pupil.value.trim())q.set('student_label','eq.'+pupil.value.trim());if(lesson.value)q.set('lesson_no','eq.'+lesson.value);if(kind.value)q.set('activity','eq.'+kind.value);
    const data=await call('/rest/v1/nyelvtan5_results?'+q);rows=data.slice(0,size);const table=el('table','');table.style.cssText='width:100%;border-collapse:collapse;text-align:left;font-size:15px';const labels=['Dátum','Név / azonosító','Osztály','Lecke','Tevékenység','Pont','Maximum','Százalék','Oldalelhagyások'];const head=el('thead',''),tr=el('tr','');labels.forEach(x=>{const th=el('th',x);th.scope='col';th.style.cssText='padding:8px;border-bottom:2px solid #b9d2cf';tr.append(th);});head.append(tr);table.append(head);const body=el('tbody','');for(const r of rows){const tr=el('tr','');display(r).forEach(x=>{const td=el('td',String(x));td.style.cssText='padding:8px;border-bottom:1px solid #dce7e5';tr.append(td);});body.append(tr);}table.append(body);wrap.append(table);message.textContent=rows.length?((offset+1)+'–'+(offset+rows.length)+'. beküldés; '+Math.round(rows.reduce((a,r)=>a+100*r.score/r.total,0)/rows.length)+'% az ezen az oldalon látható eredmények átlaga.'):'Nincs találat.';prev.disabled=offset===0;next.disabled=data.length<=size;csv.disabled=!rows.length;loaded=true;
  }catch(err){rows=[];message.textContent='Nem sikerült betölteni: '+err.message+' Jelentkezz be újra, ha a munkamenet lejárt.';}finally{busy=false;refresh.disabled=false;}}
  refresh.onclick=()=>load(true);prev.onclick=()=>{offset=Math.max(0,offset-size);load();};next.onclick=()=>{offset+=size;load();};
  function safeCsv(v){let s=String(v);if(/^[\s]*[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
  csv.onclick=()=>{if(!teacher||!rows.length)return;const lines=[['Dátum','Név / azonosító','Osztály','Lecke','Tevékenység','Pont','Maximum','Százalék','Oldalelhagyások'],...rows.map(display)];const blob=new Blob(['\uFEFF'+lines.map(r=>r.map(safeCsv).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob),a=el('a','');a.href=url;a.download='nyelvtankaland-5-eredmenyek.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  panel.ontoggle=()=>{if(panel.open&&!loaded)load(true);};
  if(sessionStorage.getItem('nk5-open-results')==='1'){sessionStorage.removeItem('nk5-open-results');panel.open=true;load(true);}
}

async function start() {
  try {await auth();} catch(e){status.textContent=e.message;}
  const resultLink=el('button','NyelvtanKaland 5. – tanári eredmények');resultLink.type='button';document.querySelector('.teacher').append(resultLink);
  resultLink.onclick=()=>{if(teacher){const panel=document.querySelector('#nk5-dashboard');if(panel){panel.open=true;panel.scrollIntoView({block:'start'});}}else{sessionStorage.setItem('nk5-open-results','1');signIn().catch(e=>status.textContent=e.message);}};
  if(teacher)addResultsDashboard();
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
