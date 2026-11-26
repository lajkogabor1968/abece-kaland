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
async function start() {
  try {await auth();} catch(e){status.textContent=e.message;}
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
