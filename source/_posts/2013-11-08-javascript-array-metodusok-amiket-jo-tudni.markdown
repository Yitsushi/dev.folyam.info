---
layout: post
title: "Array metódusok, amiket jó tudni"
date: 2013-11-08 10:34
comments: true
categories: [javascript, recommended]
image: http://dev-gcs.folyam.info/2013-11-08-javascript-array-metodusok-amiket-jo-tudni/javascript.png
---

{% img left http://dev-gcs.folyam.info/2013-11-08-javascript-array-metodusok-amiket-jo-tudni/javascript.png JavaScript Methods %}

Ha valaki foglalkozott már egy kicsit is [JavaScript](/blog/categories/javascript/)-el,
az legalább egy ciklust írt. A tömbök _(array)_ nagyon fontos elemei szinte minden
nyelvnek _(már amennyiben létezik)_.

De vajon kihasználjuk a tudását és nem írunk feleslegesen ciklustokba ágyazott cilusokat,
amik csak azért vannak, hogy egy másik tömböt felépítsünk vagy egy változó értékét
`true`/`false` értékkel töltsünk meg? Először nézzünk olyanokat, amiket talán sokan
ismernek. Később majd előveszünk ritkábban tudottakat is.

<!-- more -->

### Array.forEach

Gyakran látható az alábbi kódrész:

``` javascript
var myArray = ["Ez", "egy", "tömb."];

for (var i = 0, _l = myArray.length; i < _l; i++) {
  if (myArray[i].length > 2) {
    // A console.log a paramétereit szóközzel összefűzve írja ki.
    console.log("Itt egy hosszú szó:", myArray[i]);
  }
}
```

{% include post/adsense_right.html %}

Erre bizony van a tömböknek saját függvényük, amiket nyugodtan lehet használni. A `forEach`
pont arra való, amit a neve is mutat. Végighalad az összes elemen. Egy hátránya van:
Nem lehet belőle kilépni, tehát itt nincs `break`. Továbbmenni egyszerűen egy `return`-el
lehet :) De mint később látni fogjuk a `break` is megoldható. A `forEach` három paramétert
kap, amit vagy felhasználunk vagy nem. Első az adott elem _(igen nem az index-et adja
először, mert a legtöbb esetben az elemre van szükség)_. Második az index és harmadik
értéknek kompletten a tömböt kapjuk meg. Lássuk a fenti példát már az újonan megismert
függvényünkkel:

``` javascript
var myArray = ["Ez", "egy", "tömb."];

myArray.forEach(function(item) {
  // A console.log a paramétereit szóközzel összefűzve írja ki.
  console.log("Itt egy hosszú szó:", myArray[i]);
});
```

De akár kitehetjük külön függvénybe is, ha a műveletet többször szeretnénk futtatnk:

``` javascript

var logIfLongWord = function(word) {
  // A console.log a paramétereit szóközzel összefűzve írja ki.
  console.log("Itt egy hosszú szó:", myArray[i]);
};

myArray.forEach(logIfLongWord);
```

### Array.join

Kicsit kevesebbszer találkozunk az alábbi kódszerkezettel, de ez sem ritka:

``` javascript
var myArray = ["Ez", "egy", "tömb."],
    sentence = "";

for (var i = 0, _l = myArray.length; i < _l; i++) {
  if (sentence.length > 0) {
    sentence += " ";
  }
  sentence += myArray[i];
}
```

Egy nagyon jó megoldás van erre, amit úgy hívnak, hogy `join`. Megadhatjuk, hogy mivel
fűzze össze a tömbünk elemeit.

``` javascript
var myArray = ["Ez", "egy", "tömb."],
    sentence = myArray.join(" ");
```

Mennyivel egyszerűbb nem? :)

### Array.map

Ez talán az általam legtöbbet használt metódus. Szerintem többet használom, mint a
`console.log`, `console.error`-on kívül minden mást. Egy egyszerű `callback` függvényt
vár paraméterben és a `forEach`-hez hasonlóan három paramétert ad át neki. Az aktuális
elemet, az indexét és magát a tömböt. Annyi a különbség, hogy ez egy új tömböt hoz létre
kimenetként a `callback` függvény által visszatért érték alapján. Nézzünk is egy egyszerű
példát:

``` javascript
var myNumbers = [4, 16, 64, 256],
    myRootNumbers = [];

for (var i = 0, _l = myNumbers.length; i < _l; i++) {
  myRootNumbers.push(Math.sqrt(myNumbers[i]));
}
```

Ezek után a `myRootNumbers` az eredeti tömbünk értékeinek négyzetgyökét fogja tartalmazni,
azaz 2, 4, 8 és végül 16. Ennek egy picit egyszerűbb formája, ha használjuk a `map`
metódust:

``` javascript
var myNumbers = [4, 16, 64, 256],
    
    myRootNumbers = myNumbers.map(function(item) {
      return Math.sqrt(item);
    });
```

De talán még szebb, ha egyből a `Math.sqrt`-t hívjuk meg, hiszen az is _(első)_
paraméterként az értéket várja.

``` javascript
var myNumbers = [4, 16, 64, 256],
    
    myRootNumbers = myNumbers.map(Math.sqrt);
```

Lényegesen egyszerűbb, rövidebb és szebb :)

### Array.filter

Nagyon szép és nagyon jó ez a `map`, de mi van, akkor ha nekem nem kell minden elem. Sőt
nem is akarok műveletet végezni rajta, csak simán leszűrni adott értékeket.

``` javascript
var myNumbers = [4, -16, 3, -4, 5, 6, 2, -5, -10],
    myNegativeNumbers = [];

for (var i = 0, _l = myNumbers.length; i < _l; i++) {
  if (myNumbers[i] < 0) {
    myNegativeNumbers.push(myNumbers[i]);
  }
}
```

Mostmár szépen le tudtuk szelektálni a negatív számokat. De miért szenvednénk ilyen
hosszan, ha a `filter` metódus tud nekünk ebben segíteni. Szintén egy `callback`
függvényt vár paraméterként és a jól megszokott érték, index, tömb hármassal hívja meg azt.
Ez hasonlóan a `map`-hez végigmegy az elemeket és kimenetnek felépít egy tömböt, de csak
azokból az elemekből, amiknék a `callback` igazként tért vissza.

``` javascript
var myNumbers = [4, -16, 3, -4, 5, 6, 2, -5, -10],
    myNegativeNumbers = myNumbers.filter(function() {
      return (myNumbers[i] < 0);
    });
```

Sokkal, de sokkal szebb :)

### Array.every

{% include post/adsense_right.html %}

Ez egy érdekes függvény. Ennek a kimenete igaz vagy hamis. A jól megszokott `callback`,
ami megkapja a három paramétert, használat van itt is érvényben. Sőt nagyon hasonló
a `filter`-hez, annyi különbséggel, hogy nem a `true` visszatérésű elemeleket pakolja
be a kimeneti tömbbe.

Ha minden _(every)_ `callback` igaz értékkel tért vissza,
akkor igaz, minden más esetben hasmis lesz a kimeneti érték. Bár a lenti példa elég
bugyuta, de arra jó, hogy látható legyen a működése.

``` javascript
var me = { "id": 9 },
var messages = [
  { "recipient": 9, "content": "Üzenet 1" },
  { "recipient": 9, "content": "Üzenet 2" },
  { "recipient": 7, "content": "Üzenet 3" },
  { "recipient": 9, "content": "Üzenet 4" }
];

var eachMessageForMe = messages.every(function(message) {
  return (message.recipient === me.id);
});
// return value: false
```

Ez a szépség nekünk elment az `eachMessageForMe` változóba, hogy minden üzenet nekem szól-e
vagy sem. Egyszerű `false` értékkel fog visszatérni, lévén van egy ami hamisat ad.

### Array.some

A neve is jól mutatja és tulajdonképpen lehetne együtt említeni az `every` metódussal is,
mert ez akkor tér vissza igazzal, ha van olyan elem, amire igaz a `callback` tartalma.

``` javascript
var me = { "id": 9 },
var messages = [
  { "recipient": 9, "content": "Üzenet 1" },
  { "recipient": 9, "content": "Üzenet 2" },
  { "recipient": 7, "content": "Üzenet 3" },
  { "recipient": 9, "content": "Üzenet 4" }
];

var mentioned = messages.some(function(message) {
  return (message.recipient === me.id);
});
// return value: true
```

Hiszen van olyan érték, amire igaz. Viszont ígértem, hogy a `forEach` megoldáshoz egy
`break` működést is mutatok. Ezt pontosan a `some`-al lehet megcsinálni, mivel a ez
a metódus az első igaznál megáll.

``` javascript
var myNumbers = [4, 16, 3, -4, 5, 6, 2, -5, -10],

var isInvalid = false;
for (var i = 0, _l = myNumbers.length; i < _l; i++) {
  if (myNumbers[i] < 0) {
    isInvalid = true;
    break;
  }
  // Csinálhatunk egyéb mást is még...
}

if (isInvalid) {
  alert("Negatív számot nem fogadunk el...");
}
```

Ezt egyszerűen a `some` felhasználásával meg tudjuk valósítani, csak annyi a dolgunk, hogy
mindig `false`-al térünk vissza és amikor meg szeretnénk állítani a folyamatot, akkor
visszatérünk egy `true` értékkel.

``` javascript
var myNumbers = [4, 16, 3, -4, 5, 6, 2, -5, -10],

var isInvalid = myNumbers.some(function(value) {
  if (value < 0) {
    return true;
  }
  // Csinálhatunk egyéb mást is még...
  return false;
});

if (isInvalid) {
  alert("Negatív számot nem fogadunk el...");
}
```

### Vége?

Nagyon sok metódus van, amit az emberek nem ismernek, mert gyorsan logikával _(nagyon
helyesen)_ megalkottak az általuk ismert módokon, de vajon az a legoptimálisabb időben,
energiában vagy processzorban? Te milyen egyéb olyan megoldásokat használsz, amit ritkán
látsz mások munkáiban? Objektumokra, számokta, tesztekre vagy bármi másra.
