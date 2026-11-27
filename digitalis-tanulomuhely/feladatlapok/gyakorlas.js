'use strict';
function fejezetiFeladatlap(parent, lecke, mod) {
const {lapok, alkotas} = fejezetiAdatok;
function elem(tag, text, cls) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (cls) node.className = cls;
  return node;
}
function gomb(parent, label, action, cls) {
  const button = elem('button', label, cls);
  button.type = 'button';
  button.onclick = action;
  parent.append(button);
  return button;
}
function kever(lista) {
  const result = [...lista];
  for (let i=result.length-1;i>0;i--) {
    const j = Math.floor(Math.random()*(i+1));
    [result[i],result[j]] = [result[j],result[i]];
  }
  return result;
}

const panel=elem('details',undefined,'fejezeti-lap');
const nyito=elem('summary','Gyakorló feladatlap');
const munka=elem('div');
panel.append(nyito,munka);
parent.append(panel);
const id=name=>munka.querySelector('#'+name);
const modNev={normal:'Mester – önálló',btmn:'Kalandor – támogatott',sni:'Felfedező – segített'}[mod];
let tartalom,jelzes,muvelet,szam,sor,index,pont,hibak,lezart;
panel.ontoggle=()=>{
  if(!panel.open || tartalom) return;
  munka.innerHTML='<p id="hely"></p><h3 id="cim" tabindex="-1"></h3><progress id="haladas" aria-label="Eddig ellenőrzött feladatok"></progress><div id="tartalom"></div><div id="visszajelzes" role="status"></div><div id="muvelet"></div>';
  tartalom=id('tartalom');jelzes=id('visszajelzes');muvelet=id('muvelet');
  indit(lecke+1);
};
function indit(n,csak) {
  szam=n;
  const bank=lapok[n-1].tetelek;
  const hossz=mod==='sni'?Math.min(3,Math.max(2,bank.length-2)):mod==='btmn'?Math.max(2,Math.min(5,bank.length-1)):bank.length;
  sor=csak?[...csak]:kever(bank).slice(0,hossz);
  index=0; pont=0; hibak=[];
  id('cim').textContent=lapok[n-1].cim;
  mutat();
  id('cim').focus(); 
}
function tisztit() {
  tartalom.replaceChildren(); jelzes.replaceChildren(); muvelet.replaceChildren();
}
function ertek(szoveg) {
  return szoveg.normalize('NFC').trim().replace(/\s+/g,' ').replace(/\s*\+\s*/g,'+').replace(/[‐‑–]/g,'-');
}
function megoldas(t) {return t.valasz.split('~')[0].replaceAll('/',' → ');}
function ellenoriz(jo) {
  if (lezart) return;
  lezart=true;
  const t=sor[index];
  if (jo) pont++; else hibak.push(t);
  tartalom.querySelectorAll('button,input').forEach(x=>x.disabled=true);
  jelzes.textContent=(jo?'Helyes! ':'Ezt még érdemes gyakorolni. ')+ 'Megoldás: '+megoldas(t)+' '+t.segitseg;
  id('haladas').value=index+1;
  const tovabb=gomb(muvelet,index+1<sor.length?'Következő feladat →':'Eredmény megtekintése',()=>{
    index++;
    if (index===sor.length) eredmeny(); else mutat();
    id('cim').focus();
  },'fo');
  tovabb.focus();
}
function rendezes(t) {
  const cel=t.valasz.split('/');
  const kezdet=mod==='sni'?1:0;
  const kirakott=cel.slice(0,kezdet);
  const kijelzo=elem('p','', 'sor'), paletta=elem('div',undefined,'valaszok');
  const keszlet=kever(cel.slice(kezdet));
  if(keszlet.length>1 && keszlet.every((x,i)=>x===cel[kezdet+i])) keszlet.push(keszlet.shift());
  tartalom.append(kijelzo,paletta);
  function frissit(){
    kijelzo.textContent=kirakott.length?kirakott.join(' → '):'Ide kerül a választott sorrend.';
    paletta.replaceChildren();
    for(const x of keszlet) {
      if(!kirakott.includes(x)) gomb(paletta,x,()=>{kirakott.push(x);frissit();});
    }
    if(kirakott.length>kezdet) gomb(paletta,'Utolsó visszavonása',()=>{kirakott.pop();frissit();});
    if(kirakott.length===cel.length) gomb(paletta,'Ellenőrzés',()=>ellenoriz(kirakott.every((x,i)=>x===cel[i])),'fo');
  }
  frissit();
}
function iras(t) {
  const form=elem('form'), label=elem('label','Válaszod'), input=elem('input'), submit=elem('button','Ellenőrzés','fo');
  input.id='valasz'; label.htmlFor=input.id; input.required=true; input.autocomplete='off';input.spellcheck=false;
  form.append(label,input,submit);tartalom.append(form);
  if(mod==='sni' && t.tipus!=='emlékezet') form.insertBefore(elem('p','Kezdőbetű: '+t.valasz[0]+' · '+(t.tipus==='elemzés'?'Használd a + jelet!':'Olvasd vissza, amit írtál!'),'tipp'),input);
  form.onsubmit=e=>{
    e.preventDefault();
    if(!input.value.trim()) return;
    function normalizal(s){
      let v=ertek(s);
      if(!['javítás','emlékezet'].includes(t.tipus)) v=v.toLocaleLowerCase('hu');
      if(t.valasz.endsWith('.') && t.tipus==='emlékezet') v=v.replace(/\.$/,'');
      return v;
    }
    ellenoriz(t.valasz.split('~').some(x=>normalizal(input.value)===normalizal(x)));
  };
}
// A már besorolt kártyák a feladatlapon maradnak, így a teljes rendezés látható.
function kartyaTabla(t) {
  const tabla=elem('div',undefined,'tabla');
  const csoport=t.tipus==='csoport';
  const kartya=elem('button',t.kerdes,'kartya');
  const celok=elem('div',undefined,'celok');
  const tajekoztato=elem('p',csoport?'Jelöld ki a kártyát, majd érintsd meg a csoportját!':'Jelöld ki a bal oldali kártyát, majd keresd meg a párját!');
  const elozo=sor.slice(0,index).filter(x=>x.utasitas===t.utasitas && x.tipus===t.tipus);
  const lehetosegek=kever([t.valasz,...kever(t.egyeb).slice(0,mod==='sni'?1:t.egyeb.length)]);
  kartya.type='button';kartya.setAttribute('aria-pressed','false');
  kartya.onclick=()=>{
    kartya.setAttribute('aria-pressed','true');
    celok.querySelectorAll('button').forEach(b=>b.disabled=false);
    celok.querySelector('button').focus();
  };
  tartalom.append(tajekoztato,tabla);tabla.append(kartya,celok);
  let helyes;
  for(const nev of lehetosegek){
    const doboz=elem('div',undefined,'doboz');
    const g=gomb(doboz,nev,()=>{
      ellenoriz(nev===t.valasz);
      helyes.append(elem('span',t.kerdes,'bent'));
      kartya.hidden=true;
    });
    g.disabled=true;
    if(nev===t.valasz) helyes=doboz;
    if(csoport) for(const x of elozo.filter(x=>x.valasz===nev)) doboz.append(elem('span',x.kerdes,'bent'));
    celok.append(doboz);
  }
  if(!csoport && elozo.length){
    const lista=elem('ul');
    for(const x of elozo) lista.append(elem('li',x.kerdes+' → '+x.valasz));
    tartalom.append(lista);
  }
}
function mutat() {
  tisztit(); lezart=false;
  const t=sor[index], haladas=id('haladas');
  haladas.max=sor.length;haladas.value=index;
  id('hely').textContent=modNev+' · '+(index+1)+' / '+sor.length+'. feladat';
  tartalom.append(elem('p',t.utasitas));
  const kontextus=t.segitseg.startsWith('Zita üzenetet')||t.segitseg.startsWith('Reggel a kertkapu');
  if(kontextus||mod!=='normal') tartalom.append(elem('p',t.segitseg,'tipp'));
  else {
    const help=elem('details');help.append(elem('summary','Segítség'),elem('p',t.segitseg));tartalom.append(help);
  }
  if(['csoport','pár'].includes(t.tipus)) return kartyaTabla(t);
  const kerdes=elem('p',t.kerdes,'feladat');tartalom.append(kerdes);
  if(t.tipus==='sorrend') return rendezes(t);
  if(t.tipus==='emlékezet') {
    const elrejt=gomb(tartalom,'Megjegyeztem',()=>{kerdes.remove();elrejt.remove();iras(t);id('valasz').focus();});return;
  }
  if(!t.egyeb.length || (t.tipus==='pótlás' && mod!=='sni')) return iras(t);
  const buttons=elem('div',undefined,'valaszok');tartalom.append(buttons);
  for(const x of kever([t.valasz,...kever(t.egyeb).slice(0,mod==='sni'?1:t.egyeb.length)])) {
    gomb(buttons,x,()=>ellenoriz(x===t.valasz));
  }
}
function eredmeny(){
  tisztit();
  const szazalek=Math.round(pont*100/sor.length);
  id('hely').textContent='Befejezett feladatlap · '+modNev;
  tartalom.append(elem('h3','Eredmény: '+szazalek+'%'),elem('p',sor.length+' feladatból '+pont+' helyes válasz.'));
  if(hibak.length) gomb(muvelet,'A hibás feladatok újra',()=>indit(szam,hibak));
  gomb(muvelet,'Újragyakorlás',()=>indit(szam),'fo');
  if(alkotas[szam]) {
    const [kerdes,minta,szempont]=alkotas[szam];
    const panel=elem('details'), body=elem('div');
    body.append(elem('p',kerdes),elem('p','Mondd el szóban a megoldásodat, majd ellenőrizd a mintaválasz alapján!'));
    const mutasd=gomb(body,'Önellenőrzés',()=>{
      mutasd.remove();body.append(elem('blockquote',minta),elem('p',szempont));
    });
    panel.append(elem('summary','Alkotóműhely · önellenőrzés, pontozás nélkül'),body);tartalom.append(panel);
  }
}

}
