'use strict';
function konyvjelzoLap(parent, lessonNumber, mode) {
  const story = 'A könyvtári vásár végén Zita különös könyvjelzőt talált az olvasóterem padlóján. Az egyik oldalán egy kék róka ült, a másikon csak ennyi állt: „Aki keres, talál.” Zita letette a könyvjelzőt a könyvtáros asztalára, aztán lesietett az udvarra.\n\nA kapunál egy fiú a zsebeit tapogatta. Egy kék rókáról beszélt a társának. Zita megtorpant. Néhány perc múlva már hárman hajoltak a könyvtáros asztala fölé. A fiú gondosan visszacsúsztatta a rókát egy vastag mesekönyvbe.';
  const reading = (text) => ({text});
  const choose = (label, answer, ...others) => ({label, answer, others});
  const write = (label, answer) => ({label, answer});
  const reflect = (label, model) => ({label, model});
  const order = (label, sequence) => ({label, sequence});
  const tasks = [
    [31,'Nyomozz a történetben!',reading(story),
      choose('Melyik mondat árulja el, miért tér vissza Zita?', 'Egy kék rókáról beszélt a társának.','A kapunál egy fiú a zsebeit tapogatta.','Zita megtorpant.'),
      order('Érintsd meg az eseményeket időrendben!', ['Zita talál valamit a padlón.','A könyvjelző az asztalra kerül.','Zita meghall egy beszélgetést.','A könyvjelző visszakerül a könyvbe.']),
      reflect('Miért volt fontos nyom a róka színe?', 'A fiú ugyanarról a kék rókáról beszélt, amelyet Zita a könyvjelzőn látott. A válaszod összekapcsolja a két részletet?')],
    [44,'Keress pontosabb szót!',reading('Szókészlet: sietve, fürgén, óvatosan, hirtelen, rálelt.'),
      choose('talált','rálelt','sietve','óvatosan'),choose('vigyázva','óvatosan','fürgén','hirtelen'),choose('váratlanul','hirtelen','rálelt','sietve')],
    [23,'Folytasd egy mondattal!',reading(story),reflect('Mit mondhatott a fiú? A szavaiból derüljön ki, miért fontos neki a könyvjelző.', '„A húgom rajzolta nekem ezt a rókát a születésnapomra.” A fiú szólal meg? Megtudjuk, miért becses neki a könyvjelző?')],
    [11,'Tegyél rendet a katalógusban!',order('Állítsd betűrendbe a címszavakat!', ['ceruza','cinege','cinke','csiga','csónak','dió']),
      choose('Melyik szópár sorrendjét dönti el a negyedik betű?', 'cinege és cinke','cinke és csiga','csiga és csónak')],
    [17,'J vagy ly?',write('sirá…','ly'),write('bó…a','j'),write('sú…','ly'),write('tuta…','j')],
    [28,'Könyvtári szókereső',{grid:true},
      choose('Melyik megtalált szóban van két mély magánhangzó?', 'kapu','kert','síp'),
      choose('Melyik két szóban van hosszú í?', 'híd és síp','kapu és síp','híd és kert')],
    [20,'Közmondások két darabban',choose('Addig jár a korsó a kútra, …','míg el nem törik.','mint erővel.','sokra megy.'),
      choose('Többet ésszel, …','mint erővel.','míg el nem törik.','sokra megy.'),
      choose('Sok kicsi …','sokra megy.','mint erővel.','míg el nem törik.'),
      choose('Mit mondanál annak, aki apránként gyűjt egy könyvre?', 'Sok kicsi sokra megy.','Többet ésszel, mint erővel.','Addig jár a korsó a kútra, míg el nem törik.')],
    [3,'Ki üzen kinek?',reading('Zita telefonon ezt írja a könyvtárosnak: „Jó napot kívánok! Megtaláltuk a könyvjelző gazdáját. Visszamehetünk érte a nagyszünetben?”\nA könyvtáros válasza: „Persze, az asztalomon vár benneteket.”'),
      choose('Ki az első üzenet feladója?', 'Zita','a könyvtáros','a fiú'),choose('Ki az első üzenet címzettje?', 'a könyvtáros','Zita','a fiú'),
      write('Milyen nyelven írt Zita?', 'magyar|magyarul|magyar nyelven'),write('Milyen eszközzel írt?', 'telefon|telefonon|telefonnal|mobiltelefonnal|mobiltelefon'),
      write('Másold ki a beleegyezést jelző szót!', 'Persze')],
    [5,'Kétféle kérés',reflect('Hogyan kérnéd el egy percre a könyvjelzőt a barátodtól?', '„Ideadod egy percre a könyvjelződet?” A megfogalmazás lehet közvetlen és tegező.'),
      reflect('Hogyan kérnéd el egy ismeretlen felnőttől?', '„Elnézést, kölcsönadná egy percre a könyvjelzőjét?” Udvarias, a helyzethez illő kérés hangzott el?')],
    [4,'Mit mond a mozdulat?',choose('A könyvtáros a beszélgetőkre néz, és az ajka elé teszi a mutatóujját.','Csendesebben!','Erre gyere!','Nem tudom.'),
      choose('A fiú látja, hogy Zita rossz felé indul. Felé fordul, és magához inti.','Erre gyere!','Csendesebben!','Nem tudom.'),
      choose('Zita a ceruzáját keresi. Társa széttárja a kezét és vállat von.','Nem tudom.','Erre gyere!','Csendesebben!')],
    [6,'Játsszátok el párban!',reflect('Egyikőtök olvasó, a másik könyvtáros. Négy megszólalásban játsszátok el a könyvjelző átvételét! Melyik mozdulatotok segített megérteni az üzenetet?', '– Jó napot! A rókás könyvjelzőért jöttem. – Ez lesz az? – Igen, köszönöm! – Tessék! A könyvtáros nyitott tenyérrel mutathat a könyvjelzőre. Nálatok mit fejezett ki a mozdulat?')],
    [28,'Rövid vagy hosszú?',reading('Olvasd fel: kor – kór • öt – őt • szurok – szúrok • tör – tőr.'),
      write('Melyik magánhangzó hosszú a „tőr” szóban?', 'ő'),choose('A fenyő kérgén sötét … csillogott.','szurok','szúrok'),choose('Megszámoltam a könyveket: pontosan … volt.','öt','őt')],
    [29,'Csoportosíts hangrend szerint!',...['polc','füzet','ibolya','kulacs','tükör','csiga'].map((word,i)=>{
      const categories=['mély','magas','vegyes'], correct=categories[i%3];return choose(word,correct,...categories.filter(c=>c!==correct));
    })],
    [28,'Hallgasd meg a társad!',reading('Őszi köd ül kint a réten,\ncsöpp csiga jár falevélen.\nKőre koppan négy kis csepp,\nettől lesz a kavics szebb.'),
      reflect('Olvassátok fel a verset előbb lassan, majd beszédtempóban! A hallgató koppintson a hosszú ő-nél!', 'Három koppintás hallatszik helyesen. Cseréljetek szerepet!'),
      write('Az első sor melyik szavában hallottál hosszú ő-t?', 'őszi'),write('És a harmadik sorban?', 'kőre'),write('És a negyedikben?', 'ettől')],
    [4,'Egy mondat, három szándék',reflect('Mondd el: „Nálad van a könyvjelző.” Előbb közöld, utána kérdezz rá, végül örülj neki! A társad felismeri a három szándékot más sorrendben is?', 'A kérdés és az öröm más hanglejtéssel hangzik, mint az egyszerű közlés. Beszéljétek meg, melyik változatot volt könnyű felismerni!'),
      write('Írd le a kérdő változatot, a mondatvégi írásjellel együtt!', 'Nálad van a könyvjelző?')]
  ];
  const selected = tasks.map(([lesson,title,...parts],i)=>({lesson,title,parts,number:i+1}))
    .filter(task=>lessonNumber===18 || task.lesson===lessonNumber);
  if (!selected.length) return;
  function node(tag, text) {
    const el=document.createElement(tag);
    if(text!==undefined) el.textContent=text;
    return el;
  }
  function button(label, click) {
    const el=node('button',label);el.type='button';el.onclick=click;return el;
  }
  function shuffled(items) {
    const arr=items.slice();
    for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}
    return arr;
  }
  const panel=node('details');panel.className='fejezeti-lap';
  panel.append(node('summary','Az elveszett könyvjelző'+(lessonNumber===18?' – teljes feladatlap':'')));
  parent.append(panel);
  for(const task of selected){
    const section=node('details');section.append(node('summary',task.number+'. '+task.title));
    const area=node('div');section.append(area);panel.append(section);
    function start(){
      area.replaceChildren();
      let correct=0, count=0, total=task.parts.filter(p=>!p.text&&!p.model).length;
      const result=node('p');result.setAttribute('role','status');
      for(const part of task.parts){
        const box=node('div');box.style.marginBlock='1rem';
        area.append(box);
        if(part.text){const quote=node('blockquote',part.text);quote.style.whiteSpace='pre-line';box.append(quote);continue;}
        if(part.label)box.append(node('p',part.label));
        const feedback=node('p');feedback.setAttribute('role','status');
        let done=false;
        function mark(ok,answer){
          if(done)return;done=true;count++;if(ok)correct++;
          box.querySelectorAll('button,input').forEach(e=>e.disabled=true);
          feedback.textContent=ok?'Helyes!'+(answer?' Megoldás: '+answer:''):'A helyes megoldás: '+answer;
          result.textContent=count===total?'Eredmény: '+correct+' / '+total+' ('+Math.round(100*correct/total)+'%).':'';
        }
        if(part.model){
          box.append(node('p','Válaszolj szóban, majd hasonlítsd össze a válaszodat a mintával!'),button('Mintaválasz és önellenőrzés',()=>{feedback.textContent=part.model;}));
        }else if(part.grid){
          box.append(node('p','Keresd meg a KERT, KAPU, HÍD és SÍP szót! Érintsd meg a szó első, majd utolsó betűjét. Jobbra vagy lefelé haladj!'));
          const grid=node('div');grid.className='konyvjelzo-racs';box.append(grid);
          const targets={'0-18':'KERT','0-3':'KAPU','19-21':'HÍD','5-17':'SÍP'};
          const found=new Set();let first=null;
          for(const [i,ch] of Array.from(['KAPULS','EZIBÁÍ','RATÓMP','THÍDPO','EJELAR'].join('')).entries()){
            const cell=button(ch,()=>{
              if(first===null){first=i;cell.setAttribute('aria-pressed','true');feedback.textContent='Most érintsd meg az utolsó betűt!';return;}
              const start=first;first=null;grid.children[start].setAttribute('aria-pressed','false');
              const word=targets[start+'-'+i];
              if(!word){feedback.textContent='Ezen a szakaszon nincs keresett szó. Próbáld újra!';return;}
              if(found.has(word)){feedback.textContent='Ezt már megtaláltad.';return;}
              found.add(word);
              for(let k=start;k<=i;k+=(i-start<6?1:6))grid.children[k].classList.add('megtalalt');
              feedback.textContent='Megtaláltad: '+[...found].join(', ')+'.';
              if(found.size===4)mark(true,'KERT, KAPU, HÍD, SÍP');
            });
            cell.setAttribute('aria-label',(Math.floor(i/6)+1)+'. sor, '+(i%6+1)+'. oszlop: '+ch);grid.append(cell);
          }
        }else if(part.sequence){
          let picked=[];const line=node('p'), controls=node('div');box.append(line,controls);
          const palette=shuffled(part.sequence);
          function draw(){
            controls.replaceChildren();line.textContent=picked.join(' → ');
            for(const word of palette.filter(x=>!picked.includes(x)))controls.append(button(word,()=>{picked.push(word);draw();}));
            if(picked.length)controls.append(button('Utolsó visszavonása',()=>{picked.pop();draw();}));
            if(picked.length===palette.length)controls.append(button('Ellenőrzés',()=>mark(picked.every((x,i)=>x===part.sequence[i]),part.sequence.join(' → '))));
          }draw();
        }else if(part.others){
          const choices=shuffled([part.answer,...shuffled(part.others).slice(0,mode==='sni'?1:part.others.length)]);
          choices.forEach(x=>box.append(button(x,()=>mark(x===part.answer,part.answer))));
        }else{
          const input=node('input');input.setAttribute('aria-label',part.label);input.autocomplete='off';input.spellcheck=false;
          const norm=s=>s.trim().normalize('NFC').toLocaleLowerCase('hu').replace(/\s+/g,' ');
          const check=()=>{if(!input.value.trim()){input.focus();return;}mark(part.answer.split('|').some(x=>norm(x)===norm(input.value)),part.answer.split('|')[0]);};
          input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check();}};
          box.append(input,button('Ellenőrzés',check));
        }
        box.append(feedback);
      }
      if(total===0)result.textContent='Szóbeli feladat – a mintaválasz alapján ellenőrizd magad.';
      area.append(result,button('Újragyakorlás',start));
    }
    section.ontoggle=()=>{if(section.open&&!area.childElementCount)start();};
  }
}
