---
layout: post
title: "Grunt és Chrome kombó"
date: 2013-04-28 19:57
comments: true
categories: [chrome, grunt, javascript, less, css, hogyan]
image: http://s3-dev.folyam.info.s3.amazonaws.com/2013-04-28-grunt-es-google-chrome-kombo/gruntjs-google-chrome.png
---

{% img left http://s3-dev.folyam.info.s3.amazonaws.com/2013-04-28-grunt-es-google-chrome-kombo/gruntjs-google-chrome.png %}

Manapság már egyre több lehetősége van az embernek, hogy ne – úgymond – nyers CSS és JavaScript
írásával kelljen eltöltenie idejének nagy részét. Persze mindegyiknek megvan a hátránya
és az előnye is. Most nem is ezeket mutatnám be, hanem sokkal inkább azt, hogy miként
lehet segítségünkre gyorsan és egyszerűen a [Grunt](http://gruntjs.com/) munkánk során.

_A cikk alján link a teljes forrásra._

<!--more-->

### Mi az a Grunt?

Sokat nem fűznék hozzá, mert akit érdekel az úgyis utána néz. Mondjuk azt, hogy amolyan
[Rake](http://rake.rubyforge.org/) szerű dolog. Aki a Rake-et se ismeri annak akkor a
[Make](http://www.gnu.org/software/make/manual/make.html)-hez hasonlítanám. Sőt nem is csak hasonlítanám, hanem
kvázi annak a JavaScript-re ültetett változata. Feladatokat definiálhatunk, amiket – logikus módon – futtathatunk
akár egymáshoz fűzve is.

Nézzünk egy gyors példát. Elsősorban Node.js alkalmazásoknál használt, de ez természetesen senkit sem akadályoz meg
abban, hogy más környezetben is használja. Vegyünk egy alap struktúrát, ami tartalmaz JavaScript-et, CSS-t és HTML-t.
Ennyi egyelőre elég is lesz :) Picit azért bonyolítsuk meg, mert az jó. Pakoljunk bele egy
[Angular.js](/blog/categories/angularjs)-t és írjuk a CSS-t [Less](http://lesscss.org/) segítségével.

### Struktúra

    webroot
     |-+ src
     | |-+ js
     | | |-- controllers    # Ide írjuk majd meg a kontrollereket
     | | |-- vendors        # Ide be tudunk rakni minden külső js-t
     | | |-- app.js         # Ezt lesz az egész eleje :) Nevezzük bootstrap-nek
     | | \-- routing.js     # Ha új route van, akkor csak ebbe bele kell írni
     | |-+ less
     | | |-- libs           # Ide össze tudjuk gyűjteni például a mixineket
     | | |-- modules        # Minden modulenak csinálunk egy külön könyvtárat ide
     | | |-- app.less       # Ez fog betölteni mindent
     | | \-- base.less      # Ide kvázi az oldalhoz tartozó alap dolgok kerülnek
     | \- templates         # Angular.js template fájlok helye
     |-+ static
     | |-+ css              # Ide jön majd a css
     | |-+ js               # Ide jön majd javascript
     | \-+ templates        # Ide kerülnek majd az Angular.js template fájlok
     |-- Gruntfile.js       # Itt az egyik nagy lényeg :)
     \-- index.html         # no comment ^^.

### Akkor építsünk

Először is vegyünk egy jól megszokott html fájlt:

{% include_code index.html 2013-04-28-grunt-es-google-chrome-kombo/index.html %}

{% include post/adsense_right.html %}

Elsőre feltűnhet két dolog. Első, hogy mindent abszolút adtam meg. Minden fejlesztéshez be szoktam lőni valami lokális
címet, mint például ehhez a clockwork.dev címet. Host fájlt nem igazán piszkálok, sokkal inkább meg van adva
[dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html)-nak, hogy minden `.dev` tld legyen `localhost` aztán már
csak a webszervernek kell megadni, ha új cím van.

_Clockwork azért, mert így hívják a gépet :) A példaprojekt könyvtára pedig LaMuse, ami meg az előző gép neve volt._

A második sokkal inkább furcsa dolog, hogy elvileg a dolgainkat ugyebár az `src` könyvtárba fogjuk írni és nem a
`static`-ba. Itt nincs is olyan fájl, amit ő majd keresni fog nekünk most, de majd oda kerül, amikor szükségünk van rá.

#### Inicializálás

Alkossuk meg most akkor gyorsan a JavaScript struktúrát is. Az `src` alatt van egy `js` könyvtárunk. Ez alatt a
`vendors`-ba töltsük le az Angular.js-t. Most hozzuk létre az `app.js`-t:

{% include_code src/js/app.js 2013-04-28-grunt-es-google-chrome-kombo/src/js/app.js %}

Mivel nem biztos, hogy csak és kizárólag Angular.js-t fogunk használni, így csinálunk mindennek az elején egy
`Application` objektumot, aminek két kulcsa van: `angular` és `Controllers`. Az előbbi gyorsan kap is értéket
az Angular.js alkalmazásunk keretében. Utóbbi alá fogjuk gyűjteni a kontrollereket.

Már majdnem működőképes amit csináltunk :) Kelleni fog egy router, ami megmondja, hogy milyen címen mi fog történni.

#### Router

{% include_code src/js/routing.js 2013-04-28-grunt-es-google-chrome-kombo/src/js/routing.js %}

Én nagyjából mindent bezárok egy függvénybe, mert akkor ott tudom definiálni a függvényeimet és változóimat, amik aztán
nem zavarnak bele a többi részbe. Praktikus szerintem :)

Mi is történik. Definiálunk egy változót, hogy a későbbiekben, amikor template fájlt adunk meg egy célhoz, akkor
ne kelljen mindig kiírni a teljes útvonalat. Ezek után létrehozzuk önmagát a routing rendszert. Egyetlen szabály
van benne, ami a gyökér. Ha bármi mást kérnek, akkor irányítsuk át a delikvenst a gyökérre. Amikor ezt betöltik, akkor
be kell tölteni a Dialer.html fájlt

{% include_code src/templates/Dialer.html 2013-04-28-grunt-es-google-chrome-kombo/src/templates/Dialer.html %}

és megadtuk, hogy `Application.Controllers.DialerController` töltődjön be, mint kontroller.

{% include_code src/js/controllers/DialerController.js 2013-04-28-grunt-es-google-chrome-kombo/src/js/controllers/DialerController.js %}

Itt ismét bezártam egy függvénybe és paraméterben megkapta `C` néven a már korábban definiált `Application.Controllers`
objektumot. Készítünk tömböt `$scope`-ba a nekünk kellő objektumokkal.

#### Adjunk hozzá egy kis stílust is

Mivel valahogyan szeretnénk, hogy kinézzen, így hozzuk létre a stíluslapokat is. Mint említettem Less-el készítjük majd.
Ehhez először is létrehozunk egy `app.less` fájlt, ami majd betölti azt ami nekünk kell.

{% include_code src/less/app.less lang:css 2013-04-28-grunt-es-google-chrome-kombo/src/less/app.less %}

Láthatjuk hogy szinte semmit se csinál. Betölti a `base.less`-t,  ami megadja a lapunk alap dolgait,
mint például a `html` és a `body` elem tulajdonságait. Ezek után betölti a
`lib/main.less`-t, ami egyelőre csak a `lib/helpers.less` állományt fogja betölteni. Ez csak egy `border-radius`
mixint tartalmaz. Végül betölti a `modules/main.less`-t, ahova majd mindig beírjuk az új modulokat.

{% include_code src/less/modules/dialer/main.less lang:css 2013-04-28-grunt-es-google-chrome-kombo/src/less/modules/dialer/main.less %}

### És hol a Grunt?

Ha most betöltjük az oldalt, akkor semmi se fog történni. Itt egy kis mankót fogunk
használni és letrehozunk egy `package.json` állományt, ami az npm-nek meg tudja mondani, hogy miket kell telepítenie.
Ez azért hasznos, mert később már csak `npm install`-al felrakhatóak a szükséges csomagok.

{% include_code package.json 2013-04-28-grunt-es-google-chrome-kombo/package.json %}

Most így minden benne van, ami kellhet, így elég egy `npm install` kiadása. Természetesen kelleni fog nekünk a `grunt` is
tehát, ha ez nincs telepítve, akkor telepítsük.

Innentől kezdve működni fog a `grunt` parancs, ami semmit se csinál, mert nincs `Gruntfile.js`, ami megadná neki,
hogy mit kell csinálnia:

{% include_code Gruntfile.js 2013-04-28-grunt-es-google-chrome-kombo/Gruntfile.js %}

Node mit is csinál ez most nekünk? Először is csinálunk egy `grunt` változót, mert ugye azt szeretnénk használni.
Lehet máshogy is, de én így szeretem ^^. Majd betöltjük a `grunt-devtools` feladatlistát. Ez a leghasznosabb most
nekünk. Enélkül is roppant hasznos lesz, de ezzel együtt egyenesen a mennyország. De erre majd később visszatérünk.

{% include post/adsense_right.html %}

Ezek után definiáljuk az alap konfigurációt egy `uglify`-nek, ami a `js` fájlokat fogja nekünk összefűzni és tömöríteni.
Ezek után a `copy`-nak adjuk meg, hogy mivel mit csináljon. Ez fogja nekünk bemásolni a helyükre a template fájlokat.
Következő a `less`, aminek egyetlen fájl van megadva mégpedig a fő `src/less/app.less` fájl, amit ő szépen beforgat
a `static/css/app.css` fájlba.

Ezek után betöltjük a már kész feladatlistákat, amiknek most megadtuk a paramétereket és végül regisztrálunk egy
feladatot `default` néven, ami akkor fog lefutni, ha nem adunk paramétert a `grunt`-nak, ami nem más mint a fenti
három szépen sorban. Először begeneráljuk a CSS-t, majd a JS-t és végül bemásoljuk a template-eket.

Most már ha kiadjuk a `grunt` parancsot, akkor az alábbi válasszal találkozunk:

    $ grunt
    Running "less:development" (less) task
    File static/css/app.css created.

    Running "uglify:build" (uglify) task
    File "static/js/SampleGruntProjectApp.min.js" created.

    Running "copy:main" (copy) task
    Created 1 directories, copied 1 files

    Done, without errors.

Ez eddig szép és jó, mert most már legalább egy helyen van minden és működik, amit csináltunk. De nem ez volt, ami miatt
megírtam ezt a jó hosszúra sikerült cikket. Akkor?

### Google Chrome + Grunt

Most akkor telepítsük
[Chrome böngészőnkbe a Grunt kiegészítőt](https://chrome.google.com/webstore/detail/grunt-devtools/fbiodiodggnlakggeeckkjccjhhjndnb). Ez a szépség
beépük a DevTools-ba és megjelenik egy új fül benne Grunt néven. Ide kattintva most még azt látjuk, hogy nem észlel
projektet.

{% img left http://s3-dev.folyam.info.s3.amazonaws.com/2013-04-28-grunt-es-google-chrome-kombo/grunt-devtools-no-project-detected.png %}

Már egészen közel járunk a végéhez :) Már csak a DevTools nem tud arról, hogy nekünk van Grunt fájlunk és abban
vannak feladatok is. Amik látszódnak a képen még kiegészítők, azokat tudom ajánlani, mert mindegyike nagyon hasznos.
Főleg a [Tincr](https://chrome.google.com/webstore/detail/tincr/lfjbhpnjiajjgnjganiaggebdhhpnbih) és az
[AngularJS Batarang](https://chrome.google.com/webstore/detail/angularjs-batarang/ighdmehidhipcmcojjgiloacoafjmpfk). Előbbi összeköti a fájlrendszert a böngészővel és amint módosítunk egy fájlon, akkor az frissíti a weboldalt, de ami
sokkal jobb, hogy amint módosítunk valamit a Chrome-ban, akkor mentésre kiírja a változásokat a fájlrendszerre. Utóbbi
pedig nagyon szépen mutatja az Angulat.js-hez kötött scope változókat és megmutatja mi nem optimális, tehát mivel
tölt sok időt a böngésző. Persze sokkal többre jó mind a kettő, de ez most nem a cikk célja.

Mint ahogyan azt elmondja nekünk az elénk táruló kép is, futtassunk le egy parancsot, hogy kommunikálni tudjon a
projektünkkel, így összekötve a böngészőt a `Gruntfile.js`-ben leírt feladatlistával.

    $ grunt devtools
    Running "devtools" task
    Warning: Native modules not compiled.  XOR performance will be degraded.
    Warning: Native modules not compiled.  UTF-8 validation disabled.
    >> Grunt Devtools v0.1.0-7 is ready! Proceed to the Chrome extension.

{% img center http://s3-dev.folyam.info.s3.amazonaws.com/2013-04-28-grunt-es-google-chrome-kombo/grunt-devtools-task-list.png %}

Láthatóan megjelent egy bal- és egy jobboldali rész az iménti semmi helyett. Baloldalt láthatjuk a feladatlistát,
míg jobboldalt lesz majd a kimenet. Ha ezek után kiválasztunk egy feladatot és rákattintunk, ami például a `default`,
akkor lefuttatja nekünk és kiírja a kimenetet.

{% img center http://s3-dev.folyam.info.s3.amazonaws.com/2013-04-28-grunt-es-google-chrome-kombo/grunt-devtools-run-default-task.png %}

Hasznos, mert így átírva mondjuk a JavaScript részt, miután végeztünk, elég lefuttatni az `uglify` feladatot. Ugyan így igaz az is, ha a template-eken módosítunk elég a copy feladatot futtatni és még csak el sem kell hagyni a böngészőt.

Emellett a [Tincr](http://tin.cr/) kiegészítő már csak egy kicsi plusz :) De erről majd máskor.

**A teljes forráskód megtekinthető Bitbucket-en:
[[Article] Grunt + Google Chrome](https://bitbucket.org/folyam/article-grunt-google-chrome)**
