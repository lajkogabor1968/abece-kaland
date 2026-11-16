# Betűsziget – Helyesírási kaland, 5–8. osztály

Regisztráció nélkül használható, magyar nyelvű helyesírás-gyakorló alkalmazás.

## Tartalom

537 feladat, nyolc teljes, egyenként tizenkét mondatos magyar hangos tollbamondás, hatvan különálló gyakorlómondat és 22 témakör. A magasabb évfolyam az előző évfolyamok anyagát is gyakorolja.

| Kiválasztott osztály | Feladat | Teljes tollbamondás | Külön gyakorlómondat |
| --- | ---: | ---: | ---: |
| 5. | 190 | 2 | 18 |
| 6. | 334 | 4 | 36 |
| 7. | 471 | 6 | 48 |
| 8. | 537 | 8 | 60 |

Az évfolyamok között a kezdőlapon lehet váltani. A `?osztaly=5`, `?osztaly=6`, `?osztaly=7` és `?osztaly=8` paraméter közvetlen évfolyamválasztásra használható. Ez tanulói választás, nem hozzáférési korlátozás.

Gyakorlás, kikérdezés, tollbamondás, koppintásos betűrendezés, szabálysúgó, visszatérő hibák, helyi profilok és haladás. A földrajzi nevek külön 30 feladatos és 6 tollbamondatos modult kapnak, további földrajzinév-feladatok a Simonyi-műhelyekben is vannak. A nyolcadikos kiegészítés tagmondatokat, idézést, mozaikszókat és mozgószabályokat gyakoroltat.

## Tananyagalap

- A felhasználó által megadott OH-MNY05TA (2026), OH-MNY07TA (2024) és OH-MNY08TA tankönyvek.
- AkH. 12.: https://helyesiras.mta.hu/helyesiras/default/akh12
- OH kerettantervi tájékozódás: https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat/kerettanterv_alt_isk_5_8
- NKP 5–6. osztályos tanári kézikönyv: https://www.nkp.hu/api/media/file/3d27e23b95c814c67a13ef2b91ecdfe70848d6d1
- A felhasználó által feltöltött 2023-as Simonyi Zsigmond-verseny gyakorlófeladatai: https://simonyi.kre.hu/?p=110

A Simonyi-anyagokból 199 önálló részfeladatot dolgoztunk át (5.: 59; 6.: 62; 7.: 78). Az eredeti évfolyamot és feladatsorszámot a javítás után megjelenítjük, a `bank.json` source mezőjében is szerepelnek. Nem teljes, változtatás nélküli tesztmásolatok: a hibás mintaszavakat kiváltottuk beírással, a feladatokat önálló részfeladatokká alakítottuk, magyarázatokat adtunk hozzájuk. A tankönyveket, a teljes versenyfeladatsorokat és a bennük szereplő hosszabb irodalmi szövegeket nem tesszük közzé.

Az alkalmazás önálló tanulási eszköz, nem hivatalos versenyfelkészítő és nem teljes tantervi követelményjegyzék.

## Működés

Nyisd meg az index.html fájlt statikus webszerverről, például GitHub Pages-ről. Nincs telepítés, szerveroldali kód vagy API-kulcs. A hang előre elkészített MP3, hu-HU-NoemiNeural hanggal, mérsékelt beszédtempóban. Nem a böngésző beszédszintetizátorától függ. Internetkapcsolat a fájlok betöltéséhez szükséges.

A megtanulandó szavakhoz nem adunk hibás írású választási lehetőségeket. A megoldás és a magyarázat a válasz beküldése után látható. A frontend forrásában szereplő feladatbank miatt az alkalmazás gyakorlásra és önellenőrzésre alkalmas; biztonságos hivatalos vizsgarendszernek nem készült.

A teljes tollbamondásnál először meghallgatható a teljes történet, majd mondatonként lehet írni, ismételni és lassítani. Alapbeállításban a javítás és a pontozás csak mind a tizenkét mondat beküldése után látszik. Tanulási célból a kezdőlapon mondatonkénti javítás választható. A tagmondatokat ezekben a szövegekben vesszőkkel kell elválasztani. A rövid mondatgyakorló különálló példákkal működik.

A megoldásokban az ékezetek, szóhatárok, nagybetűk és írásjelek számítanak. A fölösleges ismételt szóközöket és az Unicode-normalizálásból adódó technikai különbségeket figyelmen kívül hagyjuk. A megengedett változatokat az accepted mező tárolja. Az értékelés önellenőrzés, nem iskolai érdemjegy.

A három külön napon, súgó nélkül helyesen megoldott feladat kap biztos jelölést. Ugyanarra a feladatra naponta egyszer jár XP. Az eredmények helyben, localStorage-ban tárolódnak, nincs központi tanulói adatgyűjtés. A tárhelyszolgáltató saját technikai naplózása ettől független.

## Tanári használat

Kezdő vegyes tudáspróba után napi tíz perc célzott gyakorlás és rendszeres tollbamondás javasolható. Néhány nap múlva térjenek vissza a nehéz alakokra önálló kikérdezésben. Az alkalmazás gyakorlási segítség; a jegyek javulása a rendszeres, figyelmes használattól és az iskolai értékelés szempontjaitól is függ.
