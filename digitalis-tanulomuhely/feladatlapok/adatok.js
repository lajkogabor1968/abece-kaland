// Egy tételsor egy feladat. A | választja el a kérdést, a megoldást és a téves válaszokat.
// Írásos feladatban a ~ egyenértékű megoldásokat, rendezéskor a / egymást követő elemeket választ el.
const lapok = [];
function lap(cim, tipus, utasitas, segitseg, ...sorok) {
  const tetelek = sorok.map(sor => {
    const [kerdes, valasz, ...egyeb] = sor.split('|');
    return {tipus, utasitas, segitseg, kerdes, valasz, egyeb};
  });
  lapok.push({cim, tetelek});
}
lap('Tanulni tanulunk','pár','Párosítsd a tanulási célt a módszerrel!','Gondold végig, mit szeretnél megtudni a szövegből.',
'Gyorsan áttekintenéd a fejezetet.|Átfutod az alcímeket.|Kikeresel egyetlen évszámot.|Szóról szóra felmondod.',
'Egy helyszín nevét keresed.|Célzottan keresel a szövegben.|Megtanulod az első bekezdést.|Leírod az összes címet.',
'Kipróbálnád, emlékszel-e a szabályra.|Becsukod a füzetet, és példát mondasz.|Újra aláhúzod a címet.|Lemásolod a mintát.');
lap('A jelek világa','csoport','Sorold a jelet a megfelelő csoportba!','A szándékos jellel valaki üzen. A természetes jelből következtetünk.',
'Nyúl lábnyoma a friss hóban|természetes jel|szándékos jel','Az őr felemeli a STOP táblát.|szándékos jel|természetes jel','A távolban villámlik.|természetes jel|szándékos jel','Dóra integet a vonatablakból.|szándékos jel|természetes jel');
lap('A közlés résztvevői','pár','Azonosítsd a közlés elemét!','Zita üzenetet ír Bencének a telefonján: „A hídnál várlak.”',
'Ki a feladó?|Zita|Bence|a hídőr','Ki a címzett?|Bence|Zita|a hídőr','Mi az üzenet?|A hídnál várlak.|Zita telefonja|Bence neve','Melyik a visszajelzés?|Bence visszaír: „Mindjárt ott vagyok.”|Zita előveszi a telefonját.|Zita beírja a címet.');
lap('Szavak nélkül','pár','Melyik jel illik a helyzethez?','Figyelj arra, mit tesz a beszélő az arcával, a kezével vagy a hangjával.',
'Bori a szája elé teszi a mutatóujját.|Csendre int.|Magához hív.|Búcsút int.',
'Peti összevonja a szemöldökét. Melyik jelcsoport ez?|mimika|testtartás|hangerő',
'A mesélő hirtelen suttogni kezd. Mi változik meg biztosan?|hangerő|szójelentés|kézmozdulat');
lap('Kapcsolatteremtés','csoport','Melyik szakaszhoz tartozik a megszólalás?','A társalgást megnyitjuk, fenntartjuk, majd lezárjuk.',
'„Szervusz, Rozi!”|megnyitás|fenntartás|lezárás','„És utána merre mentetek?”|fenntartás|lezárás|megnyitás','„Köszönöm a beszélgetést, viszontlátásra!”|lezárás|megnyitás|fenntartás');
lap('Beszélgetés és telefonálás','sorrend','Építsd fel a párbeszédet! Érintsd meg sorban a mondatokat!','Keresd meg először a megszólítást, majd a kérdéshez illő választ.',
'Időpont egyeztetése|Jó napot, Lili vagyok!/Mikor nyit a műhely?/Holnap kilenckor./Köszönöm, viszonthallásra!',
'Elveszett füzet|Szia, Misi!/Nem láttad a füzetemet?/De igen, a padon van./Kösz, már látom!',
'Meghívás|Szia, Emma!/Eljössz velünk korcsolyázni?/Persze, mikor indultok?/Délután háromkor.');
lap('Szóbeli és írásbeli közlés','csoport','Csoportosítsd az üzeneteket a közlés módja szerint!','A döntéshez azt figyeld meg, mit hall vagy olvas a címzett.',
'A hangszóróból hallod a vonat indulását.|szóbeli|írásbeli','A kijelzőn olvasod a késés idejét.|írásbeli|szóbeli','A portás telefonon ad útbaigazítást.|szóbeli|írásbeli','Cetlit találsz az uzsonnásdobozban.|írásbeli|szóbeli');
function ismetles(cim, ...forrasok) {
  const tetelek = forrasok.flatMap((n,i) => {const bank=lapok[n-1].tetelek; return [bank[i%bank.length]]});
  lapok.push({cim,tetelek});
}
ismetles('Önellenőrzés – kommunikáció',2,3,4,5,6,7);
lap('A magyar helyesírás','pár','Párosítsd a példát a kiemelt helyesírási elvvel!','Figyeld meg, a kiejtés, a szóelemek megőrzése, a hagyomány vagy a betűk egyszerűsítése a döntő.',
'A „hagyja” szóban leírjuk a tő gy betűjét és a toldalék j betűjét.|szóelemzés|egyszerűsítés|hagyomány',
'A „sirály” végén ly jelöli a j hangot.|hagyomány|szóelemzés|kiejtés',
'A „tollal” szóban három l helyett kettőt írunk.|egyszerűsítés|hagyomány|kiejtés',
'A „séta” szóban a betűk a kiejtett hangokat követik.|kiejtés|hagyomány|egyszerűsítés');
lap('Az írás kialakulása','pár','Párosítsd a leírást az írásfajtával!','Mit jelöl az írásjegy: képet, szótagot vagy hangot?',
'Egy rajz egy egész eseményt idéz fel.|képírás|szótagírás|betűírás','Egy írásjegy egy egész szótagot jelöl.|szótagírás|képírás|betűírás','A „mozi” négy hangját négy betű jelöli.|betűírás|szótagírás|képírás');
lap('A magyar ábécé és a betűrend','sorrend','Tedd betűrendbe a szavakat!','Balról jobbra keresd az első eltérő betűt. A cs és a sz önálló betű.',
'Az iskolakertben|cékla/cseresznye/dió','A könyvtárban|mese/minta/mozi','Az erdőben|sás/sün/szarka','A műhelyben|farag/faragás/faragó');
lap('Szótagolás és elválasztás','írás','Írd le a szót az összes szótaghatáron kötőjellel tagolva!','Minden szótagban egy magánhangzó van. Két magánhangzó között egy mássalhangzó a következő szótaghoz kerül.',
'kalapom|ka-la-pom','szigetelő|szi-ge-te-lő','függöny|füg-göny','pogácsa|po-gá-csa','bodza|bo-dza');
lap('Levél és keltezés','javítás','Javítsd a keltezést! Tartsd meg a helyet, az évszámot és a kiírt hónapnevet!','A hely után vesszőt, az évszám és a nap után pontot írunk.',
'Szeged 2026 március 4|Szeged, 2026. március 4.','Eger, 2025. Április 8.|Eger, 2025. április 8.','Vác 2024. május 12|Vác, 2024. május 12.');
lap('Kiejtés szerinti írásmód','pótlás','Írd be a hiányzó magánhangzót!','Mondd ki magadban a teljes szót. Figyelj a hang hosszúságára!',
'A fiókban lapul a rad_r.|í|i','Elolvassuk a röv_d mesét.|i|í','A tízóraihoz savany_ almát kaptam.|ú|u','A levesbe tejf_lt kevertem.|ö|ő');
lap('Szövegszerkesztés','sorrend','Állítsd helyre a szöveg sorrendjét!','A visszautaló szavak segítenek: mit jelent az „azt”, „belőle” vagy „ettől”?',
'Az ültetés|Mira egy üres cserepet talált./Azt megtöltötte földdel./A földbe magot dugott.',
'A javítás|Leeresztett a biciklim kereke./Megkerestem a lyukat a belsőn./A lyukra foltot ragasztottam.',
'A rajz|Elővettem egy lapot./A lapra sárkányt rajzoltam./A sárkány farkát pirosra festettem.');
lap('Szóelemző írásmód','javítás','Javítsd ki az idézőjelbe tett szót! Csak a javított szót írd be!','Keresd meg a szótövet, és őrizd meg írásban.',
'A fiú „láttya” a gólyát.|látja','Feri „aggya” a labdát.|adja','Márk „mongya” a verset.|mondja','A nagypapa „tartya” a létrát.|tartja');
lap('Hagyomány és egyszerűsítés','pótlás','Írd be a hiányzó betűt vagy betűket!','A j és az ly ugyanazt a hangot jelöli. A hosszú kétjegyű mássalhangzó első jegyét kettőzzük.',
'A hajó mellett sirá_ köröz.|ly|j','Az a_tó előtt vár egy vendég.|j|ly','A tűzhe_en leves fő.|ly|j','A füzetben me_szemet rajzoltam.|ggy|gy');
lap('Nyelvhelyesség és tagolás','javítás','Írd le helyesen! Állítsd vissza a szóközöket, a nagybetűket és az írásjeleket!','Keresd meg a neveket, az önálló szavakat és a mondat végét.',
'hovásietdani?|Hová siet Dani?','reggelzitasétál.|Reggel Zita sétál.','mikorindulavonat?|Mikor indul a vonat?');
ismetles('Összefoglalás – helyesírás',9,11,12,13,14,15,16,17,18);
lap('Szólások, közmondások, szállóigék','pár','Válaszd ki a helyzethez illő magyarázatot!','A képes kifejezések mögötti gondolatot keresd.',
'„Lógatja az orrát.” Milyen lehet a kedve?|szomorú|kíváncsi|elégedett',
'„Lassan járj, tovább érsz!” Mire int?|Megfontoltan haladj.|Mindig fordulj vissza.|Minden utat gyalog tegyél meg.',
'Egy név szerint ismert szerző idézete széles körben elterjed. Mivé válhat?|szállóigévé|találós kérdéssé|megszólítássá');
lap('Könyvtárhasználat','pár','Melyik forrást nyitnád ki?','Fogalmazd meg, hogy jelentést, helyes írásmódot vagy egy könyv lelőhelyét keresed.',
'Mit jelent a „dereng” szó?|értelmező szótár|könyvtári katalógus|atlasz','Megvan-e az iskolai könyvtárban egy regény?|könyvtári katalógus|szinonimaszótár|enciklopédia','Hogyan kerülhetnéd el a „vidám” ismétlését?|szinonimaszótár|atlasz|évkönyv','Hol húzódik a Zempléni-hegység?|atlasz|helyesírási szótár|mesegyűjtemény');
ismetles('Gyakoroljunk! – szavak és források',20,21,11,18);
lap('Az elbeszélés','sorrend','Rendezd időrendbe a történet mondatait!','Keresd az eseményt, amely nélkül a következő még nem történhetett meg.',
'A hazatérő üzenet|Nóra írt egy üzenetet./Beletette egy üvegbe./Az üveget a patakra bízta./A hídnál Soma kihalászta.',
'A csengő|A csengő leesett a kerékpárról./Vera felvette a földről./Visszacsavarozta a kormányra.',
'A veréb|Egy veréb berepült a terembe./Dani ablakot nyitott a riadt madárnak./A veréb kirepült a kertbe.');
lap('A leírás és a jellemzés','csoport','Milyen részletet tudsz meg a mondatból?','A külső megfigyelhető. A belső tulajdonságot gyakran tettekből ismerjük fel.',
'A csikó homlokán fehér csillag látszott.|külső jellemző|belső tulajdonság','Misi türelmesen kivárja, amíg más is szóhoz jut.|belső tulajdonság|külső jellemző','A gondnok kabátujja könyékig ért.|külső jellemző|belső tulajdonság','Lilla másnap is visszavitte a talált pénzt.|belső tulajdonság|külső jellemző');
ismetles('Összefoglalás – szöveg és jelentés',20,21,23,24,15);
lap('A nyelvi szintek','sorrend','Haladj a legkisebb egységtől a legnagyobbig!','A hangokból szóelemek, a szavakból mondatok épülhetnek.',
'Nyelvi egységek|beszédhang/szóelem/szó/mondat/szöveg','Keresd a bővülő egységeket!|k/kert/kertek/A kertek zöldek.','Melyik foglalja magába az előzőt?|f/fest/festő/A festő megérkezett.');
lap('Hangképzés és fonéma','pár','Keresd meg az összetartozó elemeket!','Egyetlen hang cseréje is megváltoztathatja a jelentést.',
'Melyik szóban változik csak az első hang a „tál” szóhoz képest?|sál|tél|tár',
'Honnan áramlik ki beszéd közben a levegő?|tüdő|orrüreg mint kiindulópont|nyelvhegy',
'Hol találhatók a hangszalagok?|gégében|szájpadláson|ajakban');
lap('A magánhangzók','csoport','Milyen a kiemelt magánhangzó?','A magasak: e, é, i, í, ö, ő, ü, ű. A mélyek: a, á, o, ó, u, ú.',
'ű – tű|magas, hosszú|magas, rövid|mély, hosszú','a – pad|mély, rövid|mély, hosszú|magas, rövid','ö – köd|magas, rövid|magas, hosszú|mély, rövid','ó – tó|mély, hosszú|magas, hosszú|mély, rövid');
lap('Hangrend és illeszkedés','csoport','Sorold be a szót a magánhangzói alapján!','Csak mély hangok: mély. Csak magas hangok: magas. Mindkettő: vegyes.',
'csónak|mély|magas|vegyes','füzér|magas|mély|vegyes','ibolya|vegyes|mély|magas','körte|magas|vegyes|mély');
lap('A mássalhangzók','pár','Párosítsd a mássalhangzót a zöngésség szerinti párjával!','A képzés helye és módja azonos, csak a hangszalagok működése tér el.',
'b|p|t|k','z|sz|s|zs','gy|ty|ny|j','v|f|p|b');
lap('Olvasás a sorok között','választás','Olvasd el a történetet, majd válaszolj!','Reggel a kertkapu nyitva állt. A homokban apró mancsnyomok vezettek az ólig. Az üres tál mellett Folti békésen szuszogott.',
'Hová vezettek a nyomok?|az ólig|a kertkaputól az utcára|a homokozó széléig','Miből tudod, hogy Folti pihent?|békésen szuszogott|a kapu nyitva volt|a homokban nyomok voltak','Mit nem tudunk biztosan?|Ki nyitotta ki a kaput.|Hol volt a tál.|Milyen volt a nyomok mérete.');
lap('Mássalhangzótörvények I. – részleges hasonulás','csoport','Melyik tulajdonság változik a kiemelt hangkapcsolatban?','A p és b zöngéssége különbözik. Az n a p vagy b előtt az m képzési helyéhez igazodik.',
'népdal (p + d)|zöngésség|képzés helye','színpad (n + p)|képzés helye|zöngésség','vízpart (z + p)|zöngésség|képzés helye','azonban (n + b)|képzés helye|zöngésség');
lap('Mássalhangzótörvények II. – teljes hasonulás','írás','Kapcsold a szóhoz a -val vagy -vel ragot! Írd le az egész szót!','Mássalhangzó után a v teljesen hasonul: kosár + val → kosárral.',
'füzet|füzettel','kalap|kalappal','fény|fénnyel','kulcs|kulccsal');
lap('Mássalhangzótörvények III. – hangváltozások','csoport','Nevezd meg a jelölt hangkapcsolat változását a folyamatos beszédben!','Összeolvadáskor két hangból egy új hang lesz. Rövidüléskor a hosszú hang röviden hallatszik. Kieséskor egy hang elmarad.',
'barátság (a t és az s helyén hosszú cs hallatszik)|összeolvadás|rövidülés|kiesés','jobbra (a hosszú b rövidül az r előtt)|rövidülés|kiesés|összeolvadás','mondta (a d gyakran elmarad)|kiesés|összeolvadás|rövidülés');
ismetles('Részösszefoglalás I. – beszédhangok',26,27,28,29,30);
ismetles('Részösszefoglalás II. – hangkapcsolatok',32,33,34,16,12);
lap('A szavak szerkezete','elemzés','Bontsd a szót a megadott elemekre! Az elemek közé + jel kerüljön!','Összetett szóban keresd a két önálló szót. Toldalékos szóban először válaszd le a szóvégi ragot.',
'kavicskert (előtag + utótag)|kavics+kert','kertben (szótő + rag)|kert+ben','házakban (szótő + többesjel kötőhangzóval + rag)|ház+ak+ban','dobverő (előtag + utótag)|dob+verő');
lap('Szóképzés','elemzés','Válaszd el + jellel az alapszót és a képzőt!','A képző új szót hoz létre: kert + ész → kertész.',
'festő|fest+ő','halász|hal+ász','nézés|néz+és','sóz|só+z');
lap('Jelek és ragok','csoport','Mi a kiemelt szóelem szerepe?','A jel például többes számot vagy múlt időt fejezhet ki. A rag mondatbeli viszonyt jelölhet.',
'kapu-k: a -k|jel|rag|képző','tál-ban: a -ban|rag|jel|képző','kért: a -t („Tegnap kért egy almát.”)|jel|rag|képző','hajó-ra: a -ra|rag|jel|képző');
ismetles('Összefoglalás – szóelemek',37,38,39,33,16);
lap('Hangalak és jelentés','pár','Melyik szó illik a körülíráshoz?','Képzeld magad elé a tárgyat vagy a cselekvést.',
'Fogai vannak, mégsem harap; a hajat rendezi.|fésű|tükör|hajcsat','Vékony fénysáv jelenik meg a felhők között.|fénysugár|árnyék|alkony','Apró cseppekben, alig hallhatóan esik az eső.|szemerkél|zuhog|ömlik');
lap('Egyjelentésű és többjelentésű szavak','csoport','Döntsd el, milyen jelentésviszonyt mutat a példa!','Többjelentésű szónál kapcsolat van a jelentések között.',
'Nyelvtani szakszó: magánhangzó.|egyjelentésű|többjelentésű','A pad lába és a kutya lába.|többjelentésű|egyjelentésű','Mértékegység neve: milliméter.|egyjelentésű|többjelentésű','A kulcs nyitja a zárat; a rejtvény kulcsa segít a megoldásban.|többjelentésű|egyjelentésű');
lap('Azonos és hasonló alakú szavak','pár','Melyik szó teszi értelmessé a mondatot?','Figyeld a teljes mondatot. Az „egyelőre” jelentése: most még.',
'Az edző két csapatra osztotta a játékosokat, így mindkét félnek … esélye volt.|egyenlő|egyelőre|egyenlőre',
'… a tornateremben maradunk, amíg eláll az eső.|Egyelőre|Egyenlőre|Egyenlő',
'A futó nagy … tett meg fél óra alatt.|távot|távolt|távolit');
lap('Rokon értelmű és ellentétes szavak','pár','Válassz szót a megadott kapcsolat alapján!','Azonos szófajú szavakat hasonlíts össze.',
'A „nesztelen” rokon értelmű párja|zajtalan|hangos|lassú','A „szűk” ellentéte|tág|rövid|sovány','A „bátor” ellentéte|gyáva|vakmerő|fürge','A „kószál” rokon értelmű párja|csatangol|rohan|álldogál');
lap('Hangutánzó és hangulatfestő szavak','csoport','Melyik csoportba illik a kiemelt szó?','A hangutánzó szó hangot idéz fel, a hangulatfestő a mozgás vagy állapot jellegét érzékelteti.',
'A kilincs KATTAN.|hangutánzó|hangulatfestő','A mackó CAMMOG.|hangulatfestő|hangutánzó','Az üveg CSÖRREN.|hangutánzó|hangulatfestő','A kisgyerek TIPEG.|hangulatfestő|hangutánzó');
lap('Jelentésmező','csoport','Helyezd a szót a hozzá tartozó témakörbe!','Melyik tevékenységnél találkozol a tárggyal a megadott szerepben?',
'kottaállvány|zenélés|vitorlázás|fazekasság','árbóc|vitorlázás|fazekasság|zenélés','égetőkemence|fazekasság|zenélés|vitorlázás','vonó|zenélés|fazekasság|vitorlázás');
ismetles('Szövegalkotás – gyakorló',15,18,23,24,31);
ismetles('Önellenőrzés – szójelentés',41,42,43,44,45,46);
ismetles('Év végi rendszerezés I.',3,7,11,12,14,20,27,32,37);
ismetles('Év végi rendszerezés II.',15,21,23,28,33,38,39,42,44,45);
// Egy adott lecke további feladattípusokkal is kiegészíthető.
function kiegeszit(sorszam, tipus, utasitas, segitseg, ...sorok) {
  lap('', tipus, utasitas, segitseg, ...sorok);
  lapok[sorszam-1].tetelek.push(...lapok.pop().tetelek);
}
kiegeszit(29,'pótlás','Pótold a teljes toldalékot!','A -hoz, -hez, -höz közül válassz.',
'Az asztal___ léptem.|hoz|hez|höz','A tükör___ hajoltam.|höz|hoz|hez','A szék___ toltam a ládát.|hez|hoz|höz');
kiegeszit(43,'választás','Vizsgáld meg a kiemelt szót!','Azonos alakú szavaknál az alak azonos, de a jelentések között nincs kapcsolat.',
'„A révész NYÚL az evezőért.” „A NYÚL eltűnik a fűben.” Milyen a két szó?|azonos alakú|hasonló alakú|rokon értelmű');
kiegeszit(13,'pár','Párosítsd a levélrészletet a szerepével!','A megszólítás a címzetthez szól. Az aláírás a feladót jelöli.',
'„Kedves Hanna!”|megszólítás|elköszönés|aláírás','„Baráti öleléssel:”|elköszönés|megszólítás|keltezés');
kiegeszit(34,'választás','Figyeld meg a kiejtést!','Ha egy írásban rövid mássalhangzó hosszabban hallatszik, nyúlás történik.',
'Az „együtt” szó gy hangját hosszan ejtjük. Mi történik a gy hanggal?|megnyúlik|megrövidül|kiesik');
kiegeszit(33,'csoport','Írásban is jelöljük a teljes hasonulást?','Vesd össze a szóelemeket az írott alakkal és az ejtéssel!',
'kéz + vel → kézzel|jelölt|jelöletlen','község (ejtésben hosszú s)|jelöletlen|jelölt','kanál + val → kanállal|jelölt|jelöletlen');
kiegeszit(30,'csoport','Hány betűjegyből áll a megadott magyar betű?','A dzs három betűjegyből áll, mégis egyetlen magyar betű.',
'ny|kettőből|egyből|háromból','dzs|háromból|kettőből|egyből','p|egyből|kettőből|háromból');
kiegeszit(17,'írás','Írd le egy szóban a toldalékos alakot!','Három azonos mássalhangzó-betű helyett egyszerű közszóban kettőt írunk.',
'toll + val|tollal','sakk + val|sakkal','orr + ra|orra');
kiegeszit(37,'írás','Alkoss összetett szót! Tartsd meg a megadott sorrendet!','A két önálló szó közé ne hagyj szóközt.',
'eső + kabát|esőkabát','könyv + támasz|könyvtámasz','kert + kapu|kertkapu');
kiegeszit(20,'pótlás','Egészítsd ki a közmondást!','Idézd fel a már ismert közmondás szavait.',
'Sok kicsi sokra ___.|megy|jut|jár','Ki mint vet, úgy ___.|arat|szánt|ültet');
kiegeszit(12,'sorrend','Állítsd össze a szót a szótagokból!','Mondd ki magadban a keresett szót.',
'Eső után színes ív az égen.|szi/vár/vány','Ezzel nagyítjuk fel az apró betűket.|na/gyí/tó');
kiegeszit(21,'pár','Igazodj el a könyvben!','A fejezetcímeket a tartalomjegyzék, a szakkifejezések magyarázatát a fogalomtár gyűjti össze.',
'Hol kezdődik a harmadik fejezet?|tartalomjegyzék|fogalomtár|forrásjegyzék','Mit jelent a fejezetben használt szakkifejezés?|fogalomtár|tartalomjegyzék|impresszum');
kiegeszit(44,'írás','Írd be a szöveghez illő szót a zárójelben megadott kettő közül!','A környezetből döntsd el, melyik illik ide.',
'A hídtól sebesen ___ a patak. (csörgedezik / zúg)|zúg','A lámpa alig ___ a ködben. (pislákol / ragyog)|pislákol');
kiegeszit(18,'emlékezet','Olvasd el a mondatot, majd írd le emlékezetből!','Figyelj a tulajdonnévre és a hosszú hangokra.',
'Az ösvény végén Zsófi megállt.|Az ösvény végén Zsófi megállt.','Csilla két pettyes bögrét hozott.|Csilla két pettyes bögrét hozott.');
kiegeszit(41,'írás','Fejtsd meg a képrejtvényt! Írd le egy szóban!','Olvasd össze a két jel nevét balról jobbra.',
'🌧️ (eső) + 🧥 (kabát)|esőkabát','🌻 (napraforgó) + 🌱 (mag)|napraforgómag');
const alkotas = {
  1:['Vitassátok meg párban, könnyebb-e hangosan tanulni! Mondj egy érvet!','Szerintem segít a hangos tanulás, mert észreveszem, melyik szónál akadok el.','Elhangzott a véleményed és egy indok is?'],
  4:['Mondd ki a „Megérkezett a csomag” mondatot örömmel, majd csalódottan!','Örömnél élénkebb lehet a hangod, csalódottságnál halkabbá válhat.','Megváltozott a hangsúlyod vagy a hangerőd?'],
  6:['Játsszátok el párban, hogy valaki téves számot hívott!','– Jó napot! A könyvtárat keresem. – Ez a pékség. – Elnézést, viszonthallásra!','Bemutatkoztál vagy köszöntél? Udvariasan lezártad a hívást?'],
  13:['Hívd meg levélben a barátodat az iskolai vásárra!','Kedves Áron! Pénteken háromkor nyílik a vásár az udvaron. Találkozzunk a kapunál! Barátod: Örs','Van megszólítás, hely, idő és aláírás?'],
  20:['Találj ki egy helyzetet ahhoz a szóláshoz, hogy „lógatja az orrát”!','Beni későn ért a pályára. A meccs véget ért, ő pedig egész úton hazafelé lógatta az orrát.','Kiderül, mitől lett szomorú a szereplő?'],
  21:['Keress egy ismeretlen szót egy könyvben, és nézd meg a jelentését szótárban!','Szó: pirkadat. Jelentése saját szavaimmal: amikor hajnalban világosodni kezd.','Feljegyezted a szót, a forrást és a jelentést?'],
  23:['Meséld el három mondatban, hogyan talált gazdára egy elveszett fél pár kesztyű!','A kapunál piros kesztyűt találtam. Feltűztem a hirdetőtáblára. Délben már a gazdája integetett benne.','Követhető a kezdet, az esemény és a befejezés?'],
  24:['Írj le egy táskát úgy, hogy a társad ráismerjen!','A hátizsák sötétzöld. Az első zsebén egy apró róka ül, a cipzárján sárga szalag lóg.','Megadtad az egész tárgy jellemzőjét és legalább egy részletét?'],
  31:['Adj másik címet Folti történetének, és indokold meg!','Mancsnyomok reggelre – a nyomok vezetnek el az alvó kutyához.','A címed a történethez kapcsolódik? Megmagyaráztad a választást?'],
  38:['Gyűjts foglalkozásneveket a kertész mintájára!','Például: zenész, régész, sebész.','Mindegyik szavad foglalkozást nevez meg, és felismered a képzőt?'],
  46:['Rajzolj szóhálót a kirándulásról!','Felszerelés: kulacs, hátizsák. Útvonal: ösvény, híd. Pihenés: tisztás, pad.','Legalább két csoportod van, és minden szót meg tudsz indokolni?'],
  47:['Jellemezz valakit egyetlen tettével, a tulajdonság megnevezése nélkül!','A rajt előtt Lili észrevette, hogy társa cipőfűzője kibomlott. Lehajolt, és segített megkötni.','Következtethet az olvasó a szereplő tulajdonságára?']
};
const temakorok = [
  [1,8,'Tanulás és kommunikáció'], [9,19,'Helyesírás és nyelvhelyesség'],
  [20,25,'Szólások, könyvek és szövegek'], [26,36,'Beszédhangok és hangtörvények'],
  [37,40,'A szavak szerkezete'], [41,48,'Hangalak és jelentés'], [49,50,'Év végi ismétlés']
];
kiegeszit(1,'sorrend','Állítsd össze a tanulási tervet!','Készülj fel, próbáld ki emlékezetből, aztán ellenőrizd magad!',
'Felkészülés egy szabályból|Elolvasom a szabályt./Becsukom a könyvet./Saját példát mondok rá./Visszakeresem, jól alkalmaztam-e.');
kiegeszit(2,'pár','Melyik érzékszerveddel veszed észre a jelzést?','A jel lehet látható, hallható vagy tapintható.',
'Kidomborodó pontok a lift gombján, amelyeket végigtapintasz.|bőröddel|szemeddel|füleddel','A szertáros sípszava a pályán.|füleddel|szemeddel|bőröddel');
kiegeszit(3,'pár','Mi a közlés elsődleges célja?','Más a célod, amikor hírt adsz, kérsz vagy örömödet fejezed ki.',
'„A könyvcsere csütörtökön lesz.”|tájékoztatás|felhívás|érzelemkifejezés','„Hozz egy kinőtt mesekönyvet!”|felhívás|tájékoztatás|érzelemkifejezés','„Úgy örülök ennek a kötetnek!”|érzelemkifejezés|felhívás|tájékoztatás');
kiegeszit(5,'választás','Válassz a helyzethez illő megszólalást!','Figyeld, kivel beszélsz, és mit szeretnél elérni.',
'A könyvtárostól segítséget kérsz egy atlasz kereséséhez.|Megmutatná, hol találom az atlaszokat?|Elvihetem ezt az atlaszt?|Visszahozhatom holnap az atlaszt?',
'A barátod mesélt, de egy részletet nem értettél. Hogyan kérdezel vissza?|Jól értem, hogy közben eleredt az eső?|Akkor majd máskor folytatjuk?|Szerinted holnap is esik?');
kiegeszit(7,'sorrend','Rendezd el a borítékon a címzett adatait felülről lefelé!','A név után a település, majd az utca és házszám következik, alulra kerül az irányítószám.',
'Címzés|Kerekes Sára/Szeged/Minta utca 8./6720');
kiegeszit(9,'csoport','Igaz vagy hamis az állítás?','Keress példát vagy ellenpéldát, mielőtt döntesz.',
'A „nyár” szó három magyar betűből áll.|igaz|hamis','Minden beszédhangot pontosan egy betűjeggyel írunk.|hamis|igaz','A „kar” és a „kár” jelentését megkülönbözteti a magánhangzó.|igaz|hamis');
kiegeszit(11,'írás','Írd le azt a szót, amelyik a két megadott címszó közé kerül a szótárban!','A szavakat az első eltérő betűjük alapján hasonlítsd össze.',
'béka … bika (bérlet vagy bodza?)|bérlet','málna … moha (mező vagy mókus?)|mező');
kiegeszit(12,'írás','Válaszd el az összetett szót az összetételi határon! Csak egy kötőjelet írj!','Keresd meg a két önálló szót akkor is, ha magánhangzóval kezdődik az utótag.',
'napernyő|nap-ernyő','vasút|vas-út','kertajtó|kert-ajtó');
kiegeszit(14,'pótlás','Pótold a mássalhangzót! Rövid vagy hosszú?','Ejtsd ki a teljes szót, és figyeld a mássalhangzó időtartamát.',
'Az asztalon sza__ag hever. (Ajándék átkötésére használjuk.)|l|ll');
kiegeszit(15,'választás','Válaszd ki, hol kezdenél új bekezdést!','Új helyszín vagy időpont gyakran új gondolati egységet indít.',
'„Este összekészítettem a hátizsákomat. Mellé tettem a bakancsomat. Másnap a busznál már mindenki várt.”|A „Másnap” előtt.|A „hátizsákomat” előtt.|A „bakancsomat” előtt.');
kiegeszit(19,'írás','Találd meg a kakukktojást! Írd le az eltérő írású szót!','Csak a j hangot jelölő betűt hasonlítsd össze.',
'hely, selyem, tutaj, gólya|tutaj','hajó, héja, pálya, ajtó|pálya');
kiegeszit(20,'pár','Mit jelent az átvitt értelmű kifejezés a mondatban?','Képzeld el a helyzetet szó szerinti értelmezés nélkül.',
'„A váltó utolsó futója szárnyakat kapott.”|Hirtelen nagyon gyors lett.|Eltévesztette az irányt.|Visszafordult a társaihoz.',
'„A hír hallatán kő esett le a szívéről.”|Megkönnyebbült.|Elcsodálkozott.|Megbántódott.');
kiegeszit(26,'pár','Melyik önálló mondat?','A mondat egy adott helyzetben közlésként megáll a saját lábán.',
'Melyik ad hírt egy eseményről?|Kinyílt a kapu.|a kopott kapu|kapukulcs','Melyik tartalmaz teljes kérést?|Add ide a kulcsot!|a kicsi kulcsot|kulcstartó');
kiegeszit(27,'sorrend','Kövesd a kiáramló levegő útját!','Indulj a tüdőtől, és haladj kifelé!',
'Szájon át képzett hangnál|tüdő/légcső/gége/garatüreg/szájüreg');
kiegeszit(28,'pár','Milyen az ajakműködés a hang ejtésekor?','Figyeld a szádat a tükörben: az í és az ű ejtésekor más helyzetben van az ajkad.',
'ő|ajakkerekítéses|ajakréses','é|ajakréses|ajakkerekítéses','ü|ajakkerekítéses|ajakréses');
kiegeszit(32,'írás','Írd le azt a mássalhangzót, amelyet a jelölt betű helyén ejtünk!','A következő mássalhangzó hatását figyeld.',
'dobtam: mit hallasz a b helyén?|p','népdal: mit hallasz a p helyén?|b','színpad: mit hallasz az n helyén?|m');
kiegeszit(38,'írás','Alkoss új szót a megadott képzővel!','Az új szó jelentését a képző módosítja.',
'úszik → cselekvés neve -ás képzővel|úszás','fest → cselekvés neve -és képzővel|festés','só → tulajdonság neve -s képzővel|sós');
kiegeszit(39,'elemzés','Bontsd szóelemekre az alakot! A kötőhangzót a jellel együtt írd!','A jel a rag előtt áll.',
'padokon (szótő + többesjel kötőhangzóval + rag)|pad+ok+on','kertekből (szótő + többesjel kötőhangzóval + rag)|kert+ek+ből');
kiegeszit(42,'pár','Milyen kapcsolat fűzi össze a kiemelt szó két használatát?','Gondolj arra, miben hasonlít egymásra a két dolog.',
'Tű foka – létra foka. Melyik mondatban jelent a „fok” a fellépésre szolgáló részt?|Megrepedt a létra harmadik foka.|Nem fért át a cérna a tű fokán.|Melegebb lett néhány fokkal.');
kiegeszit(45,'pár','Párosítsd a hangot a forrásával!','Képzeld el, mi adhat ilyen hangot a megadott helyzetben.',
'Fémkanál ér a porceláncsészéhez.|koccan|surrog|sistereg','Víz cseppen a forró vasra.|sistereg|koppan|zörög');
kiegeszit(48,'írás','Fejtsd meg a szórejtvényt! Csak a közös szót írd le!','Ugyanaz a hangsor két külön jelentésben is illik a meghatározáshoz.',
'Erődítmény is lehet, és azt is jelenti: egy helyben marad, míg valaki megérkezik.|vár','A szánkban van, és azt is jelenti: a kezében tart valamit.|fog');
