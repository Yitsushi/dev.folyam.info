---
layout: post
title: "JSHint: Növeljük a Kódbázis Minőségét"
date: 2013-12-10 18:52
comments: true
categories: ["javascript"]
image: http://dev-gcs.folyam.info/2013-12-10-jshint-noveljuk-a-kodbazis-minoseget/jshint.png
---

{% img center http://dev-gcs.folyam.info/2013-12-10-jshint-noveljuk-a-kodbazis-minoseget/jshint.png JSHint %}

Sok embertől hallottam már, hogy a szabályok hülyék, amiket ezek a kódminőség-ellenőrző
eszközök adnak. Régen én is így gondoltam. Mára nagyon megváltozott a véleményem. Pár
éve már azok közé tartozom, akik idegesítik az ilyen baromságokkal a többieket.

Persze teljesen jogos. Miért ne indentáljak 1 tabbal? Mitől jobb a 2 vagy 4 space? Én
nem akarom letörni a kapcsoszárójelet egy PHP-s osztálydefinícónál! Valahol együtt is érzek vele,
sőt, ha a csapatban mindenki 1 tabbal akar indentálni, akkor tegye. Nincs ellene semmi kifogásom,
de ha az egyik ember 1 tabbal indentál, a másik 2 szóközzel, a harmadik meg 4 szóközzel, akkor
az nagyon nem jó. Egyrészt olvashatatlan lesz a kód, aminek következménye, hogy nehezebben
találhatóak meg a hibák.

<!-- more -->

Mindenki szája íze, hogy milyen szabályokat hoz, de ha egynél több ember dolgozik egy
projekten, akkor szinte kötelező valamilyen szabályrendszer létrehozása. Ha egy ember
dolgozik rajta, akkor is illik, sőt nagyon is hasznos. Rengeteg lehetőség van, különböző
nyelveken. Én most elsősorban a JavaScript adta lehetőségekről fogok írni.

### Mi is az a JSHint?

A [JSHint](http://www.jshint.com/) egy jól konfigurálható és gyors kód-minőség ellenőrző
software. Nem csak azért, mert egyszerű konfigurációs fájlt létrehozni hozzá, hanem mert
sok szerkesztő észreveszi, ha van ez a fájl és követi annak irányelveit. A másik nagyon
hasznos, hogy a fájlokban is akár külön-külön is módosíthatóak egy-egy érték.

A legegyszerűbben úgy telepíthetjük, hogy kiadjuk az lábbi parancsot:

    npm install -g jshint

{% include post/adsense_right.html %}

Itt ugye, ha valakinek nincs fent a Node.js és a hozzá szorosan kapcsolódó npm, akkor el is
bukta a telepítést. Érdemes telepíteni, mert [nagyon sok eszközt](/blog/2013/04/28/grunt-es-google-chrome-kombo/)
lehet így telepíteni, még akkor is, ha nem akarsz Node.js-el foglalkozni.

A `-g` azért kell, hogy globálisan települjön fel, mivel mi nem betölteni szeretnénk,
hanem mint futtatható állomány kezelni.

Ezek után már biza van `jshint` megnevezésű parancsunk.

#### Használat

Használni nagyon egysezrű. Paraméternek simán meg kell adni a fájlt, amit rá szeretnénk ereszteni.

    jshint main.js

Nézzük mit csinál? Először is hozzunk létre egy fájlt:

``` javascript
var myLib = (function() {
  return {
    "key": "value",
    "list": function() {
      return [1,2,3,4,5,6]
    }
  }
})
```

Ha most erre ráeresztjük, akkor ezt kapjuk:

    (clockwork) Ξ ~ → jshint main.js
    main.js: line 5, col 27, Missing semicolon.
    main.js: line 7, col 4, Missing semicolon.
    main.js: line 8, col 3, Missing semicolon.
    
    3 errors
    (clockwork) ↑2 ~ →

Láthatóan 3 hiba van benne és mind a három pontosvessző gondokat mutat. Ezeket azért
illik javítani. Bár le fog futni a kód, de ha ezek így maradnak, akkor később hibákba futhatunk.
Mondjuk egy minify után kívos lesz, hogy dev környezetben fut a kód, de az éles oldalon
elhasal, mert ugye összefűzte a fájlokat és így hiányozni fog neki legalább egy pontosvessző,
ami most a `myLib` végéről hibádzik.

### Globális változók

Nah ezeket azért ritkán használunk, de simán előfordulhat, mondjuk egy
[jQuery](/blog/2013/05/26/ezert-nem-szeretem-a-jquery-t/), [Underscore.js](http://underscorejs.org/)
vagy [Bacon.js](https://github.com/baconjs/bacon.js) használatával.

Nézzünk is egy példát.

``` javascript
jQuery(document).ready(function() {
  console.log('Ready');
});
```

Itt most szólni fog, mert semmi sem garantálja, hogy van pl jQuery nevú változó

    (clockwork) Ξ ~ → jshint main.js
    main.js: line 1, col 1, 'jQuery' is not defined.
    main.js: line 1, col 8, 'document' is not defined.
    main.js: line 2, col 3, 'console' is not defined.
    
    3 errors
    (clockwork) ↑2 ~ →

De mondjuk `document` sincs, ha nem böngészőben futtatjuk.

Hozzunk létre egy konfigurációs állományt, aminek a neve `.jshintrc`:

``` json
{
  "curly": true,
  "eqeqeq": true,
  "undef": true,
  "globals": {
    "jQuery": true,
    "document": true
  }
}
```

Ha most futtatjuk, akkor már csak a `console.log`-ra fog panaszkodni, de az nem baj, mert
azt illik nem bennehagyni.

Most nézzük, hogy mit jelentenek a konfigurációs fájl kulcsai.

**curly**: Kötelez minket, hogy rakjunk minden block elejére és végére kapcsoszárójelet.
tehát nem lehet ilyet csinálni:

``` javascript
if (myNumber < 10)
  console.log('omg');
```

Lehet, hogy egyszerűbb és lusták vagyunk kirakni azt a plusz két karaktert, de a későbbi
hibák elkerülése végett, jobb ha nem marad le. Jön egy enyhén fáradt fejlesztő kollega
_(vagy mi magunk)_ és jól beszúrva még egy sort, az már a feltételtől föggetlenül lefut.
Itt persze gondolhatunk egy kicsit összetettebb kódról is.

**eqeqeq**: Szól, ha nem `===` és `!==`-t használtunk tesztelésnél. Sok hiba forrása lehet.

    +-------------+------+-------+
    + Értékek     |  ==  |  ===  |
    +-------------+------+-------+
    | ""     vs 0 | true | false |
    | "0"    vs 0 | true | false |
    | "0000" vs 0 | true | false |
    +-------------+------+-------+

{% include post/adsense_right.html %}

Láthatóan nem mindegy, hogy mit mivel hasonlítunk össze. Érdemes inkább konvertálni és
úgy tesztelni, mert úgy lényleg azt kapod, amit elvársz.

**undef**: Szól, ha egy olyan változót használtunk, amit előtte nem dekraláltunk.

**globals**: itt tudjuk felsorolni, hogy milyen globális változóink vannak, amiket nem fog
megtalálni a kódban, hogy hol lett létrehozva.

### Mi van akkor ha...

Persze előfordulhat, hogy csak egy adott fájlhoz szeretnénk engedélyezni egy paramétert
vagy egy globális változót. Ezt is megtehetjük, ha a fájl elejére felhisszük kommentben,
amit majd a JSHint jól figyelembe is vesz:

``` javascript
/* jshint undef: true, unused: true */
```

Így csak erre az egy fájlra mások lesznek a beállítások és máshogyan fogja vizsgálni.

#### Milyen editor támogatja?

Nagyon sok szerkesztő figyelembe veszi, ha létezik ez az állomány, de nem tudom pontosan melyek
és milyen mértékben. Ami biztos, hogy a [SublimeText](http://www.sublimetext.com/) editor
[SublimeLinter](https://github.com/SublimeLinter/SublimeLinter), a [Textmate](http://macromates.com/)-nél
a [JSHint](https://github.com/bodnaristvan/JSHint.tmbundle) míg a [Brackets](http://brackets.io/)-hez
a [brackets-jshint](https://github.com/cfjedimaster/brackets-jshint/) kiegészítés figyel rá. A Vim-hez
pedig van egy [jshint2.vim](https://github.com/Shutnik/jshint2.vim) nevű plugin.

[Grunt](/blog/2013/04/28/grunt-es-google-chrome-kombo/)-tal egyszerűen verhetetlen párosítás fejlesztéshez,
akár frontend akár backend oldalon.