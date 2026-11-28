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
  3:{title:'Kommunikációs üzenetküldő műhely',rule:'Rakd össze az üzenet útját! Az egyes kártyák a közlés tényezőit jelölik.',kind:'order',rounds:[
    ['Anna üzenetet küld Bencének.', ['Anna (feladó)','üzenet','Bence (címzett)']],
    ['A könyvtáros tájékoztatja az olvasót.', ['könyvtáros (feladó)','tájékoztatás','olvasó (címzett)']],
    ['Peti telefonon hívja Évát.',['Peti (feladó)','telefonkapcsolat (csatorna)','Éva (címzett)']]]},
  11:{title:'Betűrendvonat',rule:'Rendezd a könyvkártyákat magyar betűrendbe. A többjegyű betű egyetlen betűnek számít.',kind:'order',rounds:[
    ['A polc',['alma','cica','csiga','dió','egér']],
    ['B polc',['ceruza','cinege','cinke','csónak','daru']],
    ['C polc',['szalag','szamár','szappan','szék','szem']],
    ['D polc',['daru','dzsem','dzsungel','egér','fa']],['E polc',['ablak','alma','asztal','autó','baba']],['F polc',['gyár','gyerek','gyík','hajó','hal']],['G polc',['nyár','nyelv','nyúl','olló','óra']],['H polc',['tál','táska','toll','tyúk','udvar']],['I polc',['kacsa','kalap','kanál','kapu','kert']],['J polc',['zebra','zene','zokni','zsák','zsiráf']]]},
  20:{title:'Közmondásépítő',rule:'Építsd fel a közmondást a szétszórt kártyákból!',kind:'order',rounds:[
    ['A türelemről',['Lassan','járj,','tovább','érsz.']],
    ['A takarékosságról',['Sok','kicsi','sokra','megy.']],
    ['A megfontoltságról',['Többet','ésszel,','mint','erővel.']],
    ['Az együttműködésről',['Több','szem','többet','lát.']]]},
  28:{title:'Magánhangzó-válogató',rule:'Válogasd szét a magánhangzókat a hosszúságuk szerint!',kind:'sort',groups:['Rövid','Hosszú'],rounds:[
    ['a',0],['é',1],['i',0],['ő',1],['u',0],['ű',1],['o',0],['á',1],['ö',0],['ú',1],['e',0],['í',1],['ü',0],['ó',1]]},
  29:{title:'Hangrendi állatmentők',rule:'Vidd a szókártyákat a megfelelő kifutóba a magánhangzók alapján!',kind:'sort',groups:['Magas','Mély','Vegyes'],rounds:[
    ['tigris',0,'🐅'],['róka',1,'🦊'],['zsiráf',2,'🦒'],['ürge',0,'🐾'],['bárány',1,'🐑'],['fóka',1,'🦭'],['sirály',2,'🐦'],['őz',0,'🦌'],['teknős',0,'🐢'],['csiga',2,'🐌'],['kutya',1,'🐕'],['víziló',2,'🦛'],['medve',0,'🐻'],['nyúl',1,'🐇'],['fecske',0,'🐦'],['szarvas',1,'🦌'],['leopárd',2,'🐆'],['egér',0,'🐁'],['bagoly',1,'🦉'],['sündisznó',2,'🦔']]},
  37:{title:'Szóelemgyár – összetett szavak',rule:'Rakd sorrendbe az összetett szó tagjait!',kind:'order',rounds:[
    ['A víz szállítására való cső',['víz','vezeték']],
    ['A könyvek elhelyezésére szolgáló polc',['könyv','polc']],
    ['A természetben magától növő virág',['vad','virág']],
    ['A madarak etetésére szolgáló eszköz',['madár','etető']],['A levél bedobására szolgáló láda',['levél','láda']],['A hó eltakarítására való lapát',['hó','lapát']],['A nap fényéből nyert energiát hasznosító elem',['nap','elem']],['A gyümölcsből készült lé',['gyümölcs','lé']],['A fog tisztítására szolgáló kefe',['fog','kefe']],['A tenger partja',['tenger','part']]]},
  39:{title:'Toldalékvonat',rule:'Kapcsold össze a szótövet, a jelet és a ragot megfelelő sorrendben! A kötőhangzót a jellel együtt kezeljük.',kind:'order',rounds:[
    ['kertekben',['kert','ek','ben']],
    ['házakhoz',['ház','ak','hoz']],
    ['padokról',['pad','ok','ról']],
    ['könyvekből',['könyv','ek','ből']]]},
  43:{title:'Jelentésnyomozó',rule:'Párosítsd a két szójelentést: ugyanannak a szónak összefüggő jelentései vagy egymástól független jelentések?',kind:'sort',groups:['Összefüggő jelentések','Független jelentések'],rounds:[
    ['fül (testrész) – fül (bögre fogója)',0],['vár (épület) – vár (várakozik)',1],['láb (testrész) – láb (asztal része)',0],['ég (mennybolt) – ég (lángol)',1],['száj (testrész) – száj (barlang nyílása)',0],['dob (hangszer) – dob (hajít)',1]]},
  44:{title:'Jelentéspárosító',rule:'Keress rokon vagy ellentétes jelentésű szópárokat, majd sorold őket a megfelelő helyre!',kind:'sort',groups:['Rokon értelmű','Ellentétes jelentésű'],rounds:[
    ['fürge – sebes',0],['vidám – szomorú',1],['csendes – halk',0],['világos – sötét',1],['örül – ujjong',0],['bátor – gyáva',1],['szép – gyönyörű',0],['hideg – meleg',1]]},
  45:{title:'Hangutánzó és hangulatfestő szóvadász',rule:'Válogasd szét a hangot utánzó és a hangulatot érzékeltető szavakat!',kind:'sort',groups:['Hangutánzó','Hangulatfestő'],rounds:[
    ['csobban',0],['ballag',1],['zizeg',0],['cammog',1],['koppan',0],['andalog',1],['csiripel',0],['biceg',1]]}
};

Object.assign(nkGames,{"12":{"title":"Szótaghíd","rule":"Rakd sorrendbe a szótagokat, hogy Szócska átkelhessen!","kind":"order","rounds":[["iskola",["is","ko","la"]],["ceruza",["ce","ru","za"]],["madarak",["ma","da","rak"]],["telefon",["te","le","fon"]],["virágok",["vi","rá","gok"]],["könyvtár",["könyv","tár"]],["barack",["ba","rack"]],["ablak",["ab","lak"]],["pillangó",["pil","lan","gó"]],["szivárvány",["szi","vár","vány"]],["papagáj",["pa","pa","gáj"]]]},"14":{"title":"Kiejtés szerinti helyesírási nyomozók","rule":"A hiányzó magánhangzó rövid vagy hosszú? A jelentés segít.","kind":"sort","groups":["Rövid","Hosszú"],"rounds":[["t_z (láng)",1],["v_z (inni lehet)",1],["h_d (átkelőhely)",1],["_jj (a kéz része)",0],["sz_v (testrész)",1],["k_tya (háziállat)",0],["f_l (hallószerv)",0],["k_z (testrész)",1],["t_k (zöldség)",0],["b_za (gabona)",1],["_skola (tanulás helye)",0],["_ra (időmérő)",1]]},"17":{"title":"J–LY helyesírási nyomozóiroda","rule":"A nyomokból hiányzik a j hang betűje. Válaszd ki a helyes írásmódot!","kind":"sort","groups":["j","ly"],"rounds":[["fo…ó",1],["ha…ó (vízi jármű)",0],["bago…",1],["te… (ital)",0],["he… (tartózkodási pont)",1],["sa…t",0],["gó…a",1],["…ég (fagyott víz)",0],["moso…",1],["a…tó",0],["pocso…a",1],["to…ás",0],["mé…",1],["…áték",0],["a…ándék",0],["gereb…e",1]]},"26":{"title":"Nyelvi szintek építőtornya","rule":"Építsd fel a nyelvi egységek tornyát a kisebbtől a nagyobbig!","kind":"order","rounds":[["Első torony",["beszédhang","szó","mondat"]],["Második torony",["szóelem","szó","mondat"]],["Harmadik torony",["szó","szószerkezet","mondat","szöveg"]],["Negyedik torony",["beszédhang","szóelem","szó","szöveg"]],["Ötödik torony",["szóelem","szószerkezet","mondat","szöveg"]]]},"30":{"title":"Mássalhangzó-labor","rule":"Válogasd szét a mássalhangzóbetűket a betűjegyek száma szerint!","kind":"sort","groups":["Egyjegyű","Kétjegyű","Háromjegyű"],"rounds":[["b",0],["cs",1],["dzs",2],["gy",1],["k",0],["ly",1],["m",0],["ny",1],["sz",1],["t",0],["ty",1],["zs",1],["dz",1],["z",0],["f",0]]},"38":{"title":"Képzőműhely","rule":"Állítsd össze a szót a szótőből és a képzőből!","kind":"order","rounds":[["olvasó",["olvas","ó"]],["rajzoló",["rajzol","ó"]],["szépség",["szép","ség"]],["jóság",["jó","ság"]],["barátság",["barát","ság"]],["ügyesség",["ügyes","ség"]],["halász",["hal","ász"]],["festő",["fest","ő"]],["tanulás",["tanul","ás"]],["kérés",["kér","és"]]]},"42":{"title":"Többjelentésű szavak kincstára","rule":"A két jelentés összefügg, vagy egymástól független?","kind":"sort","groups":["Összefüggő jelentések","Független jelentések"],"rounds":[["kar (testrész) – kar (fotel része)",0],["egér (állat) – egér (számítógépes eszköz)",0],["nyelv (testrész) – nyelv (beszédrendszer)",0],["sír (temetkezési hely) – sír (könnyezik)",1],["nyúl (állat) – nyúl (valami felé)",1],["ár (vízáradás) – ár (ellenérték)",1],["toll (madár tolla) – toll (íróeszköz)",0],["fej (testrész) – fej (káposzta)",0]]},"46":{"title":"Jelentésmező-szigetek","rule":"Irányítsd a szavakat a jelentésüknek megfelelő szigetre!","kind":"sort","groups":["Gyümölcsök","Hangszerek","Szerszámok"],"rounds":[["alma",0],["hegedű",1],["kalapács",2],["körte",0],["fuvola",1],["fűrész",2],["szilva",0],["dob",1],["fogó",2],["barack",0],["zongora",1],["csavarhúzó",2],["cseresznye",0],["trombita",1],["reszelő",2]]}});
function nkGameFirstScore(outcomes){return outcomes.filter(Boolean).length;}
function nkRealGame(i,practiceOnly=false){
 const cfg=nkGames[i+1];if(!cfg)return;current=i;const activeMode=mode.value;
 const shuffle=xs=>{const a=xs.slice();for(let j=a.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[a[j],a[k]]=[a[k],a[j]];}return a};
 const scene=i===10?'train':i===28?'rescue':i===36||i===37?'factory':i===11?'bridge':i===13||i===16?'detective':i===45?'islands':i===25?'tower':i===29?'lab':'workshop';
 const special=scene!=='workshop';
 const sceneIcon={train:'🚂',rescue:'🌳',factory:'🏭',bridge:'🌉',detective:'🔎',islands:'🏝️',tower:'🏰',lab:'🧪',workshop:'🧩'}[scene];
 const mission={train:'A betűrendvonat csak akkor indulhat el, ha a vagonok a magyar ábécé szerinti sorrendben állnak.',rescue:'Segíts Szócskának hazavezetni minden állatot! A nevük hangrendje mutatja az utat.',factory:'A szóelemgyár megrendeléseit helyesen összeépített szavakkal teljesítheted.',bridge:'Építs szótagokból hidat Szócskának!',detective:'Javítsd ki a hiányos szavakat, és gyűjts nyomokat!',islands:'Juttasd el a szavakat a megfelelő jelentésszigetre!',tower:'Építsd fel a nyelvi szintek tornyát!',lab:'Válogasd szét a mássalhangzókat a laborban!',workshop:'Oldd meg a nyelvtani küldetést!'}[scene];
 root.replaceChildren();const panel=e(root,'section','');panel.classList.add('nk-game-panel');nkColors(panel,nkTheme(i));
 b(panel,'← Lecke',()=>lesson(i));e(panel,'h2',sceneIcon+' '+cfg.title);
 const story=e(panel,'div','');story.className='nk-game-story';nkMascot(story);const copy=e(story,'div','');e(copy,'strong','Szócska küldetése');e(copy,'p',mission);e(panel,'p',cfg.rule);
 const tracker=practiceOnly?null:nkBeginLeave(panel);let pageLeaves=null;
 const cap=activeMode==='sni'?5:activeMode==='btmn'?8:12;
 const history=typeof nkGameHistory==='function'?nkGameHistory(nkRoute(),i):null;
 const weak=new Set(history?.weak||[]),mixed=shuffle(cfg.rounds),priority=mixed.filter(q=>weak.has(q[0])),fresh=mixed.filter(q=>!weak.has(q[0]));
 const limit=Math.min(cap,cfg.rounds.length),reviewCount=practiceOnly?Math.min(limit,priority.length):Math.min(Math.ceil(limit/2),priority.length);
 const rounds=priority.slice(0,reviewCount).concat(fresh,priority.slice(reviewCount)).slice(0,limit);
 if(practiceOnly)e(panel,'p','Célzott ismétlés: a korábbi hibákból és új példákból. Nem írja át a tanárnak küldhető játékpontszámot.');
 else if(reviewCount)e(panel,'p','Szócska néhány korábbi nehéz példát is visszahozott.');
 const meter=e(panel,'div','');meter.className='nk-game-meter';const tally=e(meter,'strong','');const bar=e(meter,'progress','');bar.max=rounds.length;bar.value=0;bar.setAttribute('aria-label','Teljesített küldetések');
 const area=e(panel,'div','');let pos=0;const outcomes=[],wrong=[];let saved=false;
 const bins=cfg.kind==='sort'?e(panel,'div',''):null;const binRows=[],targetButtons=[];
 let activeChoice=null;
 if(bins){bins.className='nk-game-bins';e(bins,'h3',scene==='rescue'?'Hangrendi menedékhelyek':'A megtöltött csoportok');const grid=e(bins,'div','');grid.className='nk-game-targets';cfg.groups.forEach((g,j)=>{const tray=e(grid,'div','');tray.className='nk-game-bin';const button=b(tray,(scene==='rescue'?['🏡 ','🛖 ','🏕️ '][j]:'')+g,()=>{if(activeChoice)activeChoice(j)});button.className='nk-bin-button';targetButtons.push(button);binRows.push(e(tray,'div',''));});}
 function next(moveFocus=false){
  area.replaceChildren();bar.value=pos;tally.textContent=pos+' / '+rounds.length+' teljesített küldetés';
  if(pos===rounds.length){activeChoice=null;targetButtons.forEach(x=>x.disabled=true);const score=nkGameFirstScore(outcomes);if(!saved&&typeof nkRecordGame==='function'){nkRecordGame(i,rounds,outcomes,practiceOnly);saved=true;}const result=e(area,'div','');result.className='nk-game-finish';e(result,'h3',scene==='rescue'?'🏆 Minden állat menedékbe jutott!':scene==='train'?'🏆 Minden vonat elindult!':scene==='factory'?'🏆 Minden megrendelés elkészült!':'🏆 Küldetés teljesítve!');e(result,'p','Első próbálkozásra: '+score+' / '+rounds.length+' ('+Math.round(100*score/rounds.length)+'%)');e(result,'p','Kijavított feladatok: '+wrong.length+'. A javítás nem írja át az első próbálkozás pontját.');if(wrong.length){const d=e(result,'details','');e(d,'summary','Ismétlendő szavak és feladatok');wrong.forEach(w=>{e(d,'p',w[0]+' → '+w[1]);});}if(!practiceOnly)nkSendPanel(area,i+1,'jatek',score,rounds.length,pageLeaves);if(wrong.length)b(area,'Célzott ismétlés',()=>nkRealGame(i,true));b(area,'Új játék',()=>nkRealGame(i));b(area,'Vissza a leckéhez',()=>lesson(i));b(area,'Kalandtérkép',map);if(moveFocus){const h=result.querySelector('h3');h.tabIndex=-1;h.focus();}return;}
  const q=rounds[pos],task=e(area,'div','');task.className='nk-game-task';const heading=e(task,'h3',q[0]);heading.tabIndex=-1;if(moveFocus)heading.focus();
  if(scene==='rescue'){const animal=e(task,'div',q[2]||'🐾');animal.className='nk-game-animal';animal.setAttribute('aria-hidden','true');}
  const status=e(task,'p','');status.className='nk-game-status';status.setAttribute('role','status');const controls=e(task,'div','');
  let attempted=false,finished=false,firstCorrect=false,mistakes=0;
  function attempt(ok,correct){
   if(finished)return false;
   if(!attempted){attempted=true;firstCorrect=ok;if(!ok)wrong.push([q[0],correct]);}
   if(!ok){mistakes++;status.textContent=scene==='rescue'?'🦊 Figyeld meg a szó magánhangzóit, majd válassz újra!':scene==='train'?'🦊 Nézd át a betűrendet! A vagonokat újra rendezheted.':'🦊 Ellenőrizd a megoldást, és próbáld újra!';if(mistakes>=2)status.textContent+=' Segítség: '+correct;status.className='nk-game-status retry';return false;}
   finished=true;outcomes.push(firstCorrect);activeChoice=null;targetButtons.forEach(x=>x.disabled=true);
   status.textContent='✓ '+(firstCorrect?'Elsőre sikerült! ':'Kijavítottad, ügyes vagy! ')+correct;status.className='nk-game-status success';
   bar.value=pos+1;tally.textContent=(pos+1)+' / '+rounds.length+' teljesített küldetés';
   if(pos===rounds.length-1&&tracker)pageLeaves=tracker.stop();
   const forward=b(controls,pos===rounds.length-1?'Eredmény megtekintése →':'Következő küldetés →',()=>{pos++;next(true);});forward.className='nk-game-forward';forward.focus({preventScroll:true});return true;
  }
  if(cfg.kind==='sort'){
   activeChoice=j=>{if(finished)return;const correct=cfg.groups[q[1]];if(attempt(j===q[1],correct)){const tile=e(binRows[j],'span',(q[2]?q[2]+' ':'')+q[0]);tile.className='nk-game-placed';}};
   targetButtons.forEach(x=>x.disabled=false);
   e(controls,'p','Válassz egy csoportot lent!');if(activeMode!=='normal')audio(task,q[0]);
   if(activeMode!=='normal'&&scene==='rescue'){const help=b(controls,'Magánhangzók megmutatása',()=>{status.textContent='Magánhangzók: '+Array.from(q[0]).filter(c=>'aáeéiíoóöőuúüű'.includes(c.toLowerCase())).join(' – ');});help.className='nk-game-help';}
  }else{
   const correct=q[1],start=activeMode==='sni'?Math.min(1,correct.length-1):0;let selected=correct.slice(0,start);let chosen=[];let pool=shuffle(correct.slice(start).map((value,id)=>({value,id})));if(pool.length>1&&pool.every((x,j)=>x.value===correct[start+j]))pool.push(pool.shift());
   const track=e(controls,'div','');track.className='nk-game-track '+scene;const palette=e(controls,'div','');palette.className='nk-game-palette';const actions=e(controls,'div','');
   function draw(){track.replaceChildren();palette.replaceChildren();actions.replaceChildren();if(scene==='train')e(track,'span','🚂').className='nk-locomotive';if(scene==='factory')e(track,'span','🏭').className='nk-locomotive';if(scene==='bridge'||scene==='tower')e(track,'span',sceneIcon).className='nk-locomotive';correct.forEach((_,j)=>{const slot=e(track,'span',selected[j]||'…');slot.className='nk-game-slot'+(selected[j]?' filled':'');});pool.filter(x=>!chosen.includes(x.id)).forEach(x=>{const tile=b(palette,x.value,()=>{chosen.push(x.id);selected.push(x.value);draw();});tile.className='nk-game-token';});if(selected.length>start)b(actions,'↶ Visszavonás',()=>{selected.pop();chosen.pop();draw();});if(selected.length===correct.length){const check=b(actions,scene==='train'?'Vonat indítása':scene==='factory'?'Megrendelés elküldése':scene==='bridge'?'Átkelés a hídon':'Ellenőrzés',()=>{if(attempt(selected.every((x,j)=>x===correct[j]),correct.join(scene==='factory'?' + ':scene==='bridge'?'–':' → '))){track.classList.add('complete');palette.replaceChildren();actions.replaceChildren();}});check.className='nk-game-check';}}
   if(activeMode!=='normal')audio(task,q[0]);draw();
  }
 }next();
}
