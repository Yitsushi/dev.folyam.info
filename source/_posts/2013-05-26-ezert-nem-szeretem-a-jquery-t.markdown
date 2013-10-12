---
layout: post
title: "Ezért nem szeretem a jQuery-t"
date: 2013-05-26 14:35
comments: true
categories: [javascript, recommended, tricks, sucks]
image: http://dev-gcs.folyam.info/2013-05-26-ezert-nem-szeretem-a-jquery-t/tmnt-competition.jpg
---

{% img center http://dev-gcs.folyam.info/2013-05-26-ezert-nem-szeretem-a-jquery-t/tmnt-competition.jpg %}

Mikor szóba kerül a jQuery, akkor majdnem mindig megkérdezik, hogy miért nem szeretem.
Sok oka van, de a teljesítmény talán a legszembetűnőbb. Mivel a helyszínen sokszor nem
tudom megmutatni, így nem is hisznek nekem, hogy mennyivel lassab egy-egy művelet vele.

Természetesen ez csak akkor jön ki, amikor valami nagyon nagy, főként kliens oldalon
tevékenykedő kódot ír az ember. Sok könnyedséget ad, mert nagyon jól összeszedett.
Még több öröm leli az embert, amikor talál valami plugin-t, ami pont kielégíti minden
vágyát. A plugin meg amúgy is a rosszabbik fajta, de ezt most nem akarom elővenni, már
csak azért sem, mert abban sokan egyetértettek velem, hogy a kiegészítő modulok nagy
része nincs jól megírva.

<!-- more -->

### Kód

Nézzünk is akkor egy gyors példát. Van egy `div`, amiben további kettő ezen mintára:

``` html
<div id="container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
</div>
```

Írjuk át az `item` osztállyal rendelkező elemek tartalmát azerint, hogy ezt kapjuk a
végén:

``` html
<div id="container">
  <div class="item">Item 1 v2</div>
  <div class="item">Item 2 v2</div>
</div>
```

Mi sem egyszerűbb ennél. Lekérdezzük az összes `.item` element, végighaladunk rajtuk,
majd tartalmukat kicserélkül.

Nézzük sorra a jQuery, VanillaJs és természetesen egy bónusz vegyes kód, ami felhasználja
mindkét kódot részben.

``` javascript Vanilla
var items = document.querySelectorAll('#container .item');
for (var i = 0; i < items.length; i++) {
  items[i].innetHTML = 'Item ' + (i + 1) + " v2";
}
```

``` javascript jQuery
jQuery('#container .item').each(function(index, item) {
  jQuery(item).html('Item ' + (index + 1) + " v2");
});
```

``` javascript jQuery with Vanilla
jQuery('#container .item').each(function(index, item) {
  item.innetHTML = 'Item ' + (index + 1) + " v2";
});
```

``` javascript jQuery with Vanilla v2
var items = document.querySelectorAll('#container .item');
for (var i = 0; i < items.length; i++) {
  jQuery(items[i]).html('Item ' + (i + 1) + " v2");
}
```

Hogy szó ne érjen beraktam még egyet a végén, ami nem a `querySelectorAll` metódust
használja:

``` javascript Vanilla old
var items = document.getElementById('container').getElementsByClassName('item');
for (var i = 0; i < items.length; i++) {
  items[i].innetHTML = 'Item ' + (i + 1) + " v2";
}
```

### Hogyan mérjük?

{% include post/adsense_right.html %}

Persze nekiállhatnánk írni egy új banchmark eszközt, de minek, ha már van. A
[Benchmark.js](http://benchmarkjs.com/) __(v1.0.0)__ elég jól működik, jól konfigurálható
és mindemellett a [BestieJS](https://github.com/bestiejs) része.

A logika egyszerű. Felsorakoztatjuk a kódrészeinket, majd szépen sorban lefuttatjuk őket,
majd szépen elmerengünk az eredményen. Mikor ennek most nekikezdtem nem volt foglalmam
róla, hogy mennyivel lassabbak vagy gyorsabbak az egyes kódrészek, de tudtam, hogy
drasztikus lesz a különbség. Olyannyira az lett, hogy még én is meglepődtem.

### Milyen gépről beszélünk

Persze ez nem mindegy. Aminél épp most ülök és amin nézem, az egy MacBook Pro. Mit
tartalmaz? 2.6 GHz Intel Core i7 processzor, 8 GB 1600 MHz DDR3 memória. Google Chrome
fut, mint böngésző és abból is a `Version 28.0.1500.20 beta`.

Természetesen ugyan ezen a gépen megnéztem más böngészőkkel is, de ezt majd lentebb látni
lehet.

### A mérés

Akkor mérjünk, hiszen ezért vagyunk itt. Miután leszedtük a
[Benchmark.js](http://benchmarkjs.com/) 1.0.0-ás verzióját, készíteni kellene egy oldalt,
amin ezt leteszteljük.

``` html index.html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Benchmark</title>
</head>
<body>
  <div id="container">
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
  </div>
  <!-- CDN-ről betöltjüj a jQuery legfrissebb verzióját -->
  <script src="http://code.jquery.com/jquery-1.10.0.min.js"></script>
  <!-- betöltjük a benchmark.js-t -->
  <script src="benchmark.js"></script>
  <!-- majd a végén az app.js-t, ami majd a teszteket tartalmazza -->
  <script src="app.js"></script>
</body>
</html>
```

``` javascript app.js
// Új Benchmark.js instance
var suite = new Benchmark.Suite();

suite
// hozzáadjuk a VanillaJs querySelectorAll-os verziót
.add('Vanilla', function() {
  var items = document.querySelectorAll('#container .item');
  for (var i = 0; i < items.length; i++) {
    items[i].innetHTML = 'Item ' + (i + 1) + " v2";
  }
})
// hozzáadjuk a full jQuerty szemléletűt
.add('jQuery', function() {
  jQuery('#container .item').each(function(index, item) {
    jQuery(item).html('Item ' + (index + 1) + " v2");
  });
})
// majd ugye azt, ahol a HTML módosítást nem jQuery végzi
// csak a DOM-ban való keresést
.add('jQuery with Vanilla', function() {
  jQuery('#container .item').each(function(index, item) {
    item.innetHTML = 'Item ' + (index + 1) + " v2";
  });
})
// ezek után megfordítjuk és a keresést a querySelectorAll végzi,
// de a DOM módosítást már a jQuery kényelmes html() metódusa
.add('jQuery with Vanilla v2', function() {
  var items = document.querySelectorAll('#container .item');
  for (var i = 0; i < items.length; i++) {
    jQuery(items[i]).html('Item ' + (i + 1) + " v2");
  }
})
// és végül egy VanillaJs, ami kikérdezi ID alapján a szülőelemet,
// majd annak class alapján a nekünk kellő gyerekeit
.add('Vanilla old', function() {
  var items = document.getElementById('container').getElementsByClassName('item');
  for (var i = 0; i < items.length; i++) {
    items[i].innetHTML = 'Item ' + (i + 1) + " v2";
  }
})
// amikor elindul kiírjuk, hogy start, hogy tudjuk mikor indult el
.on('start', function(event) {
  console.log("Start...");
})
// ha vége egy tesztnek, akkor írjuk ki az adott eset eredményét, hogy lássuk
.on('cycle', function(event) {
  console.log(String(event.target));
})
// ha végeztünk mindennel, akkor pedig írjuk ki a leggyorsabbat
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// végül pedig indítsuk el. async true, mert miért ne :)
// Ha false-ra állítod, akkor se lesz más az eredmény.
.run({ 'async': false });
```

### És akkor az eredmények

#### Google Chrome (Version 28.0.1500.20 beta)

```
Start...
Vanilla x 868,471 ops/sec ±27.53% (75 runs sampled)
jQuery x 25,664 ops/sec ±6.36% (91 runs sampled)
jQuery with Vanilla x 233,890 ops/sec ±2.44% (90 runs sampled)
jQuery with Vanilla v2 x 31,845 ops/sec ±0.55% (96 runs sampled)
Vanilla old x 1,944,603 ops/sec ±0.68% (98 runs sampled)
Fastest is Vanilla old
```

#### Mozilla Firefox (21.0)

```
Start...
Vanilla x 360,292 ops/sec ±2.23% (89 runs sampled)
jQuery x 2,646 ops/sec ±1.52% (88 runs sampled)
jQuery with Vanilla x 11,772 ops/sec ±3.99% (88 runs sampled)
jQuery with Vanilla v2 x 3,572 ops/sec ±2.61% (85 runs sampled)
Vanilla old x 1,504,734 ops/sec ±6.73% (70 runs sampled)
Fastest is Vanilla old
```

#### Safari (Version 6.0.4 (8536.29.13))

```
Start...
Vanilla x 350,148 ops/sec ±6.72% (55 runs sampled)
jQuery x 20,689 ops/sec ±4.75% (61 runs sampled)
jQuery with Vanilla x 61,427 ops/sec ±4.71% (61 runs sampled)
jQuery with Vanilla v2 x 32,140 ops/sec ±3.68% (61 runs sampled)
Vanilla old x 1,652,603 ops/sec ±1.65% (64 runs sampled)
Fastest is Vanilla old
```

### Értelmezés

{% include post/adsense_right.html %}

Az ops/sec minél nagyobb annál jobb. Minden esetben jól látható, hogy a legygyorsabb
a régi jól bevált `getElementById` és `getElementsByClassName` használata volt közel
2millió művelet másodpercenkénti sebességgel. Őt követte a `querySelectorAll` használata
jóval kevesebb, de még mindig szép sebességet produkáló kódrész.

Ezek után jött az érdekes rész. jQuery három különböző használati mintával. Első esetben
ugyebbár teljesen az ő függvényeit használtuk, így kiérdemelve a leglassabb díjat kicsit
kevesebb mint 3ezer művelet másodpercenként. Hogy megnézzük mi is a gyorsabb és lassabb
része, különszedtük és megnéztük, hogy milyen, ha csak az írást vagy csak az olvasást
végzi a jQuery. Láthatóan ha csak a keresést végzi, akkor gyorsabb a lefutás, ezek szerint
a DOM írás jQuery-vel jóval "drágább" művelet. A DOM írás amúgy is drágább, de jQuery-vel
nagyon durván.
