---
layout: post
title: "URL rövidítő 2. rész"
date: 2013-03-28 07:26
comments: true
categories: [hogyan, javascript, node.js, angularjs, html]
image: http://dev-folyam-info.storage.googleapis.com/2013-03-28-url-rovidito-2-resz/tiny-cat-in-a-shell.jpg
---

{% img left http://dev-folyam-info.storage.googleapis.com/2013-03-28-url-rovidito-2-resz/tiny-cat-in-a-shell.jpg 400 Node.js Hogyan %}

Egy jó ideje volt már annak, hogy kikerült az első fejezet. Most úgy döntöttem, hogy
mindenképpen lesz rá időm, akármi jöhet közbe, ma készen lesz a második rész is. Mi
következik? És miért van ott az a macska? Az
[előző részben](/blog/2013/02/16/url-rovidito-1-resz/) csináltunk egy primitív URL rövidítő
oldalt pusztán HTML, CSS és [AngularJS](http://angularjs.org/) _(JavaScript)_ használatával.
Mielőtt tovább haladnánk, kellene hozzá valami háttér, ahol tárolva lesznek az URL-ek,
ahol esetleg tudjuk tárolni, hogy mennyi kattintás történt. Tehát építsünk mögé egy
[Node.js](http://nodejs.org/) keretet, ahogy azt már az előző részben is előre vetítettem.
De mi is ez egyáltalán? És még most sem tudod miért van ott a kiscica?

<!-- more -->

### Node.js alapok

Először is nézzük meg, hogy mi is ez a Node.js és mire való.

{% blockquote Wikipedia http://hu.wikipedia.org/wiki/Node.js Node.js %}
A Node.js egy szoftverrendszer, melyet skálázható internetes alkalmazások, mégpedig
webszerverek készítésére hoztak létre. A programok JavaScript-ben írhatók, using
eseményalapú, aszinkron I/O-val a túlterhelés minimalizálására és a skálázhatóság
maximalizálására.
{% endblockquote %}

_Az a using nem tudom mit keres ott, de hát ez csak egy idézet :)_

{% include post/adsense_right.html %}

Tehát az egész rendszereseményvezérelt, ahogyan azt már megszokhattuk a JavaScript-től.
Elsősorban a Google féle V8 motorra épül, de sok más könyvtár került beolvasztásra. Innen
már úgy érzem érthető, hogy mi is ez. Röviden: Server oldalon futtatható JavaScript.

Használhatnánk PHP-t is, de most nem azt fogunk :) Ha jól elboldogulsz böngészőben a
nyelvvel, akkor itt még könnyebb dolgod lesz, mert nincs böngészőfüggő függvénykészlet
és sokkal könnyebben modularizálható a kód. Ami a PHP-sokat meglepheti, de a Java vagy
Ruby nyúzóknak teljesen normális, az az, hogy a Node.js önmagában webszerver is, tehát
nem kell _(sőt nincs is)_ külön mod_nodejs Apache-hoz, ráadásul nem is lesz. Apache sem
kell hozzá.

### Bemelegítés

Hogy értehtőbb legyen, hogy mi is ez csináljunk egy gyors _"weboldalt"_, ami szinte
semmit se csinál, csak megmondja nekünk, hogy péntek van-e és ha nincs, akkor azt is, hogy
hány nap van még addig.

{% include_code Bemelegítő weboldal 2013-03-28-url-rovidito-2-resz/bemelegito/app.js %}

Mit is jelent ez? Nézzük részletekben.

#### Betöltjük, ami kell

Először is találkozunk egy `require` sorral, ami
sokat lesz használva. A `require` betölt nekünk egy libet vagy csak egy fájlt, de ezt a
neve is jól mutatja. Itt máris megállnék egy kicsit. Összességében 3 lehetőség van, amikor
betöltünk egy külső JavaScript fájlt.

1. Simán beírjuk a lib nevét és az egy beépített lib, így nem kíván más teendőt,
csak betöltöd és használod.

2. Simán beírjuk a lib nevét és az egy külső _(3rd party)_ lib. Ezeket telepíteni kell.
Ruby nyelvészeknek ismerős lehet _(gem)_.

3. Beírod a nevet, de relatív hivatkozással, tehát `.`-al kezded a nevet, például:
`require('./routes/url')`, ami betölti az aktuális fájlunkkal egy szinten lévő `routes`
könyvtárból az `url.js` állományt.

Jelen esetben mi a `http` libet hívtuk be, ami azért kell nekünk, hogy a szerver létezzen.
Ennek a segítségével képes az alkalmazásunk figyelni egy porton és lekezelni a bejövő
kéréseket.

#### Indítunk egy szervert

``` javascript
http.createServer(function(req, res) {
  // ez a függvény fut le minden kéréskor,
  // tehát ide írjuk, amit szeretnénk
  // futtatni, ha valaki lekérdezi az oldalt.
}).listen(3000);
```

Meghívjuk az imént betöltött `http` lib `createServer` függvényét, aminek átadunk egy
függvényt paraméterként, majd meghívjuk a `listen` függvényét, aminek megadjuk, hogy
hanyas porton figyeljen az alkalmazásunk. Jelen esetben ez a 3000-es port. A `createServer`
paramétereként kreált függvény fog lefutni minden oldallekéréskor. Két paramétere van, ami
rendre a kérés _(request)_ és a válasz _(response)_ objektum. A kettőből most csak az
utóbbit fogjuk használni.

#### Az érdemi kód

``` javascript
  res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
```

Gyorsan mindentől függetlenül tudatjuk a klienssel, hogy amit kapni fog az megvan és
200-as HTTP kódot tolunk át neki, amivel egy időben azt is megmondjuk, hogy a tartalom,
amit kapni fog, egy sima egyszerű szöveg lesz, ami utf-8 kódolással lett írva. Jól látható,
hogy a `res` objektumon keresztül kommunikálunk a klienssel.

``` javascript
  var now = new Date();
```

Létrehozunk egy változót `now` néven, ami az aktuálus időt jelenti. Ez egy Date objektum,
aminek mi a `getDay` függvényét fogjuk használni. A `getDay` megmondja nekünk, hogy a hét
hanyadik napja van. A számozása nem "magyarbarát", mert 0-val jelöli a vasárnapot,
1-el a hétfőt és így tovább egészen 6-ig, ami a szombatot jelenti.

``` javascript
  // Friday
  if (now.getDay() == 5) {
    return res.end("Igen! Ma péntek van.");
  }
```

Ebből eredően az 5-ös szám jelöli a pénteket. Ha az aktuális nap az 5. indexen helyeszkedik
el, akkor péntek van. Ismét a `res` objektumhoz nyúlunk, hogy a kommunikálni kívánt adatot
eljuttassuk a kliensnek. Most az `end` metódusát hívjuk meg, mert nem is lesz más, tehát
le is lehet zárni. A későbbi sok `else-if-else-if` szórakozást elkerülve vissza is térünk
ennek a kimenetével. Az, hogy ez a függvény mivel tér vissza, az teljesen mindegy, de
mivel visszatérünk a kód többi része véletlenül sem fut le.

``` javascript
  // Weekend
  if (now.getDay() == 0 || now.getDay() == 6) {
    return res.end("Mit számít? Hiszen hétvége van.");
  }
```

Aztán itt kell egy kis trükk, mert a 0. nap a vasárnap és a 6. nap a szombat, ami nálunk
egyben a hétvégét jelöli. Tehát, az aktuális nap 0 vagy 6, akkor nem érdekes, hogy mikor
lesz péntek, hiszen a kánaánt éljük meg.

``` javascript
  // Sad days
  return res.end("Nem, nincs péntek. De nyugi már csak "
                 + (5 - now.getDay())
                 + " napot kell túlélni.")
```

Minden más esetben, amikor a fentiek nem szakították meg a `return` használatával a
függvény futását hétköznap van és így ki is írjuk, hogy nincs péntek, továbbá azt, hogy
mennyi nap van még hátra. Ezt ugyebár a legegyszerűbben úgy kapjuk meg, hogy kivonjuk az
5-ből az aktuális napot.

Az egész alkalmazást úgy tudjuk megnézni, hogy _(tételezzük fel, hogy `app.js`-nek neveztük
ez a fájlt)_ beírjuk konzolra (terminálra vagy ki hogy nevezi), hogy `node app.js`. Ez
nem fog nekünk kiírni semmit _(vagy hibaüzenetet ír ki, de azt nem szeretjük)_ viszont, ha
megnyitjuk böngészőben, a [http://localhost:3000/](http://localhost:3000/) oldalt, akkor
megkapjuk az eredményt.

### Express.js (kis "történelem")

{% include post/adsense_right.html %}

Kicsit hosszú lenne és bonyolult minden kisebb oldalt felépíteni _(nagyobbakat méginkább)_
a `http` lib használatával. Pontosabban úgy, hogy csak azt használjuk. Most gyorsan
megismerkedünk az [Express.js](http://expressjs.com/)-el, ami egy keretrendszer, a
keretrendszeren, ami a keretrendszeren van. Nah jó ennyire nem gáz a helyzet, sőt...

Az egész onnan indul, hogy a Node.js úgy van felépítve, hogy maga egy keretrendszer tudjon
lenni. Egyszer valaki megcsinálta hozzá ugyebár a már használt `http` libet, ami benne van
a rendszerben.

A [Sencha Labs](http://www.sencha.com/) úgy gontolta, hogy ez így macera
lesz és megcsinálta a [connect.js](https://github.com/senchalabs/connect)-t, ami a `http`-t
használva ugyan úgy csinál nekünk egy webszervert, csak épp van benne Routing rendszer,
session kezelés és nagyon jól pluginelhető. Nagyon sok jó "gyári" middleware van hozzá,
mint például a `csrf` _(a neve jól mutatja mire való)_ vagy a `compress`, ami Gzip
tömörítést teszi nekünk lehetővé, hogy minél kisebb legyen az adathalmaz, amit átküldünk
a kliensnek. Persze ennél jóval több külső kiegészítő van hozzá, mint például a
`connect-auth`, ami tulajdonképpen egy azonosítási rendszerrel egészíti ki a rendszert és
nem is kicsit, hanem nagyon. A `connect-auth` segítségével HTTP Basic/Digest, Twitter,
Facebook, Yahoo, Github, FourSquare, Janrain/RPX vagy bármilyen OAuth azonosítást tudunk
pillanatok alatt bevarázsolni. (Persze említhetném itt a `connect-jade` middleware-t is,
amit jómagam tákoltam össze, hogy a jade is támogatott legyen connect használata közben...
Hopp meg is említettem [:)

No de, mi nem is ezt fogjuk használni, hanem
[TJ Holowaychuk](https://github.com/visionmedia) munkáját, ami a connect.js-re épülő
[Express.js](http://expressjs.com/). Tulajdonképpen a lehető legjobb dolog volt az
connect-re építkeznie, mert így a connect middleware-ek mind jók itt is :) Ebben egy sokkal
okosabb Routing rendszer van, sokkal durvább kiegészítők érhetőek el és nagyon kezes
session kezelő jár hozzá.

### Akkor jöjjön, amire vártunk

Ezen sok kitérő után jöhet a lényeg. Írjuk meg a hátterét az előző fejezetben elkezdett
URL rövidítőnek. Legalábbis egy részét. Először is nézzük sorra. Az alkalmazásunk jóval
összetettebb lesz, mint az előző.

#### Függőségek

A Node.js egy `package.json` konfigurációs állományon
keresztül kezeli a függőségeket, így létre is hozzuk most ezt a fájlt.

{% include_code Bemelegítő weboldal 2013-03-28-url-rovidito-2-resz/foly.am/package.json %}

A foly.am domainre már jóideje fáj a fogam, de nem olcsó így ezidáig nem sikerült
beszereznem, de ennek a nevét fogom most felhasználni a példában, mint alkalmazásnév.
_(Ha valaki meg akar vele ajándékozni, akkor ne szerénykedjen nagyon fogok neki örülni)_

Ez a fájl megmondja az `npm`-nek, hogy telepíteni kell az `express`, `jade`, `stylus`
és `mongoose` csomagokat.

* **express:** A keretrendszer, amit használni fogunk.
* **jade:** Express-nek kell valami template motor, és a Jade az jó.
* **stylus:** CSS helyett használatos. Én szeretem nagyon :) Most ezt nem fogjuk használni.
* **mongoose:** MongoDB lesz használva adatbázisnak és a mongoose nagy segítségünkre
lesz ebben, de ez se lesz most használva, majd legközelebb.

Hogy később tudjon futni Heroku-n, csinálunk egy Procfile-t is, ami tartalmazza a
processzeket _(pl: web dyno)_.

{% include_code Bemelegítő weboldal 2013-03-28-url-rovidito-2-resz/foly.am/Procfile %}

A rendszer miután feltelepültek a függőségek létre fog hozni egy `node_modules` nevű
könyvtárat, ami a külső libeket tartalmazza. Ezt teljes mértékben ki kell zárni a Git
folyamatból, mert sok fájl van benne, nagy és bárhova viszed ott fel tudod _(néha kell is)_
rakni a függőségeket egy parancssal, tehát ezt a könyvtárat minimum be kell rakni a
`.gitignore`-ba.

{% include_code Bemelegítő weboldal 2013-03-28-url-rovidito-2-resz/foly.am/.gitignore %}

Ha minden megvan, akkor egy `npm install` parancs kiadása után minden függőségünk fel van
telepítve.

#### Az alkalmazás lelke

Most jön a programozás :) Építsük fel az alkalmazás lelkét. Hozzuk létre az `app.js`-t.
Természetesen ez lehet más is, de akkor a `Procfile`-ban és a `package.json`-ban is át kell
írni a nevet.

{% include_code Bemelegítő weboldal 2013-03-28-url-rovidito-2-resz/foly.am/app.js %}

A forrás mindenhol szépen kommentelve van, tehát ne ugord át :) Ha megtetted, akkor
görgess szépen vissza és nézd meg.

#### Routes vs Controllers

Még egy valami kell mindenképpen az alkalmazásunknak mégpedig a `routes`, amit betöltünk,
de nem hoztuk létre. Hozzuk is gyorsan létre a `routes` nevű könyvtárat, amibe
belepakolunk egy `index.js`-t. A `require` olyan érdekességgel rendelkezik, hogy elég a
könyvtárat megadni neki, és ő betölti az `index.js`-t. Ez a kiváltság csak az index névre
illik, minden mást nem tölt be így, hanem meg kell adni a fájl nevét is.

{% include_code Bemelegítő weboldal 2013-03-28-url-rovidito-2-resz/foly.am/routes/index.js %}

#### Adjuk hozzá a titkos _A_ vegyszert

Van már cukor, só és minden mi jó a főzetben, de most adjuk hozzá az _A_ vegyszert.
Hozzuk létre a `public` könyvtárat, amit megadtunk, hogy ott lesznek a statikus tartalmak,
azon belül pedig egy `javascripts` és egy `stylesheets` könyvtárat. Másoljuk át az
[előző leckéből](/blog/2013/02/16/url-rovidito-1-resz/) a tartalmat ide és javítsuk ki
apróbb hibáit a html-nek, ami ezután így fog kinézni:

{% include_code Bemelegítő weboldal 2013-03-28-url-rovidito-2-resz/foly.am/public/index.html %}

Természetesen a többi fájlt is át kell másolni, mint `main.css`, `angular.min.js` és `app.js`.
Még egy dolog hiányzik. Kelleni fog még egy `views/error/404.jade`. Ez fog betöltődni, ha
olyan oldalt kérnek, ami nincs.

{% include_code Bemelegítő weboldal 2013-03-28-url-rovidito-2-resz/foly.am/views/error/404.jade %}

### Vége?

{% include post/adsense_right.html %}

Dehogy! Bár egyelőre igen. Ez a cikk elsősorban arra hivatott, hogy a hátteret megteremtsük
a későbbi alkalmazásunknak. Így is elég hosszú cikk lett és nem akarok egyszerre több
manát csepegtetni agyatokba, mert nem biztos, hogy elbírnátok :) Nemsokára _(most nem
lesznek hosszú hetes szünetek)_ jön a következő fejezet, ahol összekötjük ténylegesen
a két részt és el is mentjük az adatokat adatbázisba. Most tulajdonképpen szenvedtünk egy
jó adagot, hogy elérjük ugyan azt, amit eddig is elértünk, viszont mostmár van mögötte egy
Node.js szerver, amivel később tud beszélgetni a kliens oldali réteg. És persze egy csomó
mindent tanultunk a Node.js-ről :)

Hja és persze a cica, róla egy szó sem esett. Múltkoriban csúnyán belémkötött pár ember,
hogy milyen ellenséges vagyok a macskákkal. Nah ez a kép nekik került oda. Jól ábrázolja,
hogy az aranyos kis munkánkat, amit eddig csináltunk, most jól beleraktuk egy burokba, házba
vagy vázba. Tehát lássátok tudok én is macskát és kiscicát is kirakni, de nem osztok meg
40-et egy nap.

#### Kapcsolódó linkek:

* [URL rövidítő 1. rész](/blog/2013/02/16/url-rovidito-1-resz/)
* [URL rövidítő 3. rész](/blog/2013/07/05/url-rovidito-3-resz/)
