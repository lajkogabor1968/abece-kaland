'use strict';
// Student submissions are practice results, not authenticated grades.
const nkCloudApi='https://gxsszmcsqqbyvspcqrvl.supabase.co';
const nkCloudKey='sb_publishable_FMQmuakxQorQMwsybj1Xvg_ItXuYkxQ';
let nkActiveLeave=null;
function nkBeginLeave(panel){
  if(nkActiveLeave)nkActiveLeave.stop();
  let count=0,stopped=false,away=false;
  const status=document.createElement('p');status.setAttribute('role','status');status.textContent='Oldalelhagyások: 0';panel.append(status);
  const note=document.createElement('p');note.textContent='A feladat alatt az alkalmazás rögzíti a lap- és ablakváltások számát. A pontszámod ettől nem változik.';panel.append(note);
  function update(){
    if(stopped)return;
    if(!panel.isConnected){stop();return;}
    const now=!!document.hidden||!document.hasFocus();
    if(now&&!away){count++;status.textContent='Oldalelhagyások: '+count;}
    away=now;
  }
  function stop(){if(!stopped){stopped=true;document.removeEventListener('visibilitychange',update);window.removeEventListener('blur',update);window.removeEventListener('focus',update);if(nkActiveLeave===tracker)nkActiveLeave=null;}return count;}
  const tracker={stop};nkActiveLeave=tracker;
  document.addEventListener('visibilitychange',update);window.addEventListener('blur',update);window.addEventListener('focus',update);
  return tracker;
}
function nkSendPanel(parent,lessonNo,activity,score,total,pageLeaves=null){
  const box=document.createElement('section');box.className='study-note';
  const title=document.createElement('h3');title.textContent='Eredmény elküldése a tanárnak';box.append(title);const leaves=document.createElement('p');leaves.textContent='Oldalelhagyások: '+(Number.isInteger(pageLeaves)?pageLeaves:'nem mért');box.append(leaves);
  const info=document.createElement('p');info.textContent='Csak akkor küldd el, ha a tanárod kéri. Add meg a neved vagy a tanártól kapott azonosítót és az osztályodat. Az eredmény önálló gyakorlási adat, nem hitelesített dolgozatjegy.';box.append(info);
  const form=document.createElement('form');const fields={};
  for(const [id,label,max] of [['student_label','Név vagy tanulói azonosító',80],['class_label','Osztály',20]]){
    const l=document.createElement('label');l.textContent=label;const x=document.createElement('input');x.required=true;x.maxLength=max;x.autocomplete='off';x.style.cssText='display:block;width:100%;font:inherit;padding:8px;margin:4px 0 10px';l.append(x);form.append(l);fields[id]=x;
  }
  const send=document.createElement('button');send.type='submit';send.textContent='Eredmény beküldése';const status=document.createElement('p');status.setAttribute('role','status');form.append(send,status);box.append(form);parent.append(box);
  const id=crypto.randomUUID();let busy=false,sent=false;
  form.onsubmit=async ev=>{ev.preventDefault();if(busy||sent)return;const student_label=fields.student_label.value.trim(),class_label=fields.class_label.value.trim();if(!student_label||!class_label){status.textContent='Mindkét mezőt töltsd ki!';return;}busy=true;send.disabled=true;Object.values(fields).forEach(x=>x.disabled=true);status.textContent='Beküldés…';
    try{const res=await fetch(nkCloudApi+'/rest/v1/nyelvtan5_results',{method:'POST',headers:{apikey:nkCloudKey,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({id,student_label,class_label,lesson_no:lessonNo,activity,score,total,page_leaves:Number.isInteger(pageLeaves)?pageLeaves:null})});if(!res.ok){if(res.status===409){status.textContent='Ez a beküldési azonosító már szerepel az adatbázisban. Kérd a tanárt, hogy ellenőrizze.';sent=true;return;}throw Error('HTTP '+res.status);}sent=true;status.textContent='Az eredmény megérkezett a központi eredménytáblába.';send.textContent='Elküldve';}
    catch(err){status.textContent='Nem sikerült igazolni a beküldést. A pontszámod továbbra is látható. Próbáld újra!';}
    finally{busy=false;if(!sent){send.disabled=false;Object.values(fields).forEach(x=>x.disabled=false);}}
  };
}
// Real manipulative games: sorting, sequencing and construction. No timers; first attempt scored.
const nkGames={
  3:{title:'Üzenetküldő műhely',rule:'Rakd össze az üzenet útját! Az egyes kártyák a közlés tényezőit jelölik.',kind:'order',rounds:[
    ['Anna üzenetet küld Bencének.', ['Anna (feladó)','üzenet','Bence (címzett)']],
    ['A könyvtáros tájékoztatja az olvasót.', ['könyvtáros (feladó)','tájékoztatás','olvasó (címzett)']],
    ['Peti telefonon hívja Évát.',['Peti (feladó)','telefonkapcsolat (csatorna)','Éva (címzett)']]]},
  11:{title:'Könyvtári rendező',rule:'Rendezd a könyvkártyákat magyar betűrendbe. A többjegyű betű egyetlen betűnek számít.',kind:'order',rounds:[
    ['A polc',['alma','cica','csiga','dió','egér']],
    ['B polc',['ceruza','cinege','cinke','csónak','daru']],
    ['C polc',['szalag','szamár','szappan','szék','szem']],
    ['D polc',['daru','dzsem','dzsungel','egér','fa']]]},
  20:{title:'Közmondásépítő',rule:'Építsd fel a közmondást a szétszórt kártyákból!',kind:'order',rounds:[
    ['A türelemről',['Lassan','járj,','tovább','érsz.']],
    ['A takarékosságról',['Sok','kicsi','sokra','megy.']],
    ['A megfontoltságról',['Többet','ésszel,','mint','erővel.']],
    ['Az együttműködésről',['Több','szem','többet','lát.']]]},
  28:{title:'Hangszedő műhely',rule:'Válogasd szét a magánhangzókat a hosszúságuk szerint!',kind:'sort',groups:['Rövid','Hosszú'],rounds:[
    ['a',0],['é',1],['i',0],['ő',1],['u',0],['ű',1],['o',0],['á',1],['ö',0],['ú',1],['e',0],['í',1],['ü',0],['ó',1]]},
  29:{title:'Hangrendi állatkert',rule:'Vidd a szókártyákat a megfelelő kifutóba a magánhangzók alapján!',kind:'sort',groups:['Magas','Mély','Vegyes'],rounds:[
    ['tigris',0],['róka',1],['zsiráf',2],['ürge',0],['bárány',1],['fóka',1],['sirály',2],['őz',0],['teknős',0],['csiga',2],['kutya',1],['víziló',2]]},
  37:{title:'Szóépítő műhely',rule:'Rakd sorrendbe az összetett szó tagjait!',kind:'order',rounds:[
    ['A víz szállítására való cső',['víz','vezeték']],
    ['A könyvek elhelyezésére szolgáló polc',['könyv','polc']],
    ['A természetben magától növő virág',['vad','virág']],
    ['A madarak etetésére szolgáló eszköz',['madár','etető']]]},
  39:{title:'Toldalékvonat',rule:'Kapcsold össze a szótövet, a jelet és a ragot megfelelő sorrendben! A kötőhangzót a jellel együtt kezeljük.',kind:'order',rounds:[
    ['kertekben',['kert','ek','ben']],
    ['házakhoz',['ház','ak','hoz']],
    ['padokról',['pad','ok','ról']],
    ['könyvekből',['könyv','ek','ből']]]},
  43:{title:'Jelentésnyomozó',rule:'Párosítsd a két szójelentést: ugyanannak a szónak összefüggő jelentései vagy egymástól független jelentések?',kind:'sort',groups:['Összefüggő jelentések','Független jelentések'],rounds:[
    ['fül (testrész) – fül (bögre fogója)',0],['vár (épület) – vár (várakozik)',1],['láb (testrész) – láb (asztal része)',0],['ég (mennybolt) – ég (lángol)',1],['száj (testrész) – száj (barlang nyílása)',0],['dob (hangszer) – dob (hajít)',1]]},
  44:{title:'Jelentéspárosító',rule:'Keress rokon vagy ellentétes jelentésű szópárokat, majd sorold őket a megfelelő helyre!',kind:'sort',groups:['Rokon értelmű','Ellentétes jelentésű'],rounds:[
    ['fürge – sebes',0],['vidám – szomorú',1],['csendes – halk',0],['világos – sötét',1],['örül – ujjong',0],['bátor – gyáva',1],['szép – gyönyörű',0],['hideg – meleg',1]]},
  45:{title:'Hangvadász',rule:'Válogasd szét a hangot utánzó és a hangulatot érzékeltető szavakat!',kind:'sort',groups:['Hangutánzó','Hangulatfestő'],rounds:[
    ['csobban',0],['ballag',1],['zizeg',0],['cammog',1],['koppan',0],['andalog',1],['csiripel',0],['biceg',1]]}
};
function nkRealGame(i){
 const cfg=nkGames[i+1];if(!cfg)return;current=i;const activeMode=mode.value;
 const shuffle=xs=>{const a=xs.slice();for(let j=a.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[a[j],a[k]]=[a[k],a[j]];}return a};
 root.replaceChildren();const panel=e(root,'section','');b(panel,'← Lecke',()=>lesson(i));e(panel,'h2',cfg.title);e(panel,'p',cfg.rule);const tracker=nkBeginLeave(panel);let pageLeaves=0;
 const rounds=shuffle(cfg.rounds).slice(0,activeMode==='sni'?Math.min(5,cfg.rounds.length):activeMode==='btmn'?Math.min(8,cfg.rounds.length):cfg.rounds.length);
 const bar=e(panel,'progress','');bar.max=rounds.length;bar.value=0;bar.setAttribute('aria-label','Játék előrehaladása');
 const area=e(panel,'div','');let pos=0,score=0;const wrong=[];
 const bins=cfg.kind==='sort'?e(panel,'div',''):null;const binRows=[];
 if(bins){e(bins,'h3','A megtöltött csoportok');const grid=e(bins,'div','');grid.className='map';cfg.groups.forEach(g=>{const tray=e(grid,'div','');tray.className='study-note';e(tray,'strong',g);binRows.push(e(tray,'div',''));});}
 function next(){area.replaceChildren();bar.value=pos;if(pos===rounds.length){e(area,'h3','Első próbálkozásra: '+score+' / '+rounds.length+' ('+Math.round(100*score/rounds.length)+'%)');e(area,'p',wrong.length?'Javított kártyák: '+wrong.join('; '):'Minden kártya helyes volt!');b(area,'Új játék',()=>nkRealGame(i));nkSendPanel(area,i+1,'jatek',score,rounds.length,pageLeaves);return;}
 const q=rounds[pos];e(area,'p',(pos+1)+' / '+rounds.length);e(area,'h3',q[0]);const status=e(area,'p','');status.setAttribute('role','status');const controls=e(area,'div','');let answered=false;
 function finish(ok,correct){if(answered)return;answered=true;controls.replaceChildren();if(ok)score++;else wrong.push(q[0]);if(pos===rounds.length-1)pageLeaves=tracker.stop();status.textContent=(ok?'Helyes! ':'A helyes megoldás: ')+correct;b(controls,'Tovább',()=>{pos++;next();});}
 if(cfg.kind==='sort'){const targets=e(controls,'div','');targets.className='map';cfg.groups.forEach((g,j)=>b(targets,g,()=>{if(answered)return;const tile=e(binRows[q[1]],'p',(j===q[1]?'✓ ':'↻ ')+q[0]);tile.style.cssText='background:white;border:1px solid #b9d2cf;padding:5px;border-radius:6px;margin:5px 0';finish(j===q[1],cfg.groups[q[1]]);}));if(activeMode==='sni')audio(area,q[0]);}
 else{const correct=q[1],start=activeMode==='sni'?Math.min(1,correct.length-1):0;let selected=correct.slice(0,start);let pool=shuffle(correct.slice(start));if(pool.length>1&&pool.every((x,j)=>x===correct[start+j]))pool.push(pool.shift());const assembled=e(controls,'p','');const palette=e(controls,'div','');function draw(){assembled.textContent='Összeállítás: '+selected.join(' → ');palette.replaceChildren();pool.filter(x=>!selected.includes(x)).forEach(x=>b(palette,x,()=>{selected.push(x);draw();}));if(selected.length>start)b(palette,'Visszavonás',()=>{selected.pop();draw();});if(selected.length===correct.length)b(palette,'Ellenőrzés',()=>finish(selected.every((x,j)=>x===correct[j]),correct.join(' → ')));}draw();}
 }next();
}
