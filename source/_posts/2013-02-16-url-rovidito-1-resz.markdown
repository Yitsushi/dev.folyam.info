---
layout: post
title: "URL rövidítő 1. rész"
date: 2013-02-16 12:09
comments: true
categories: [hogyan, javascript, angularjs, html]
image: http://dev.folyam.info.s3.amazonaws.com/2013-02-16-url-rovidito-1-resz/AngularJS-hogyan.png
---

{% img left http://dev.folyam.info.s3.amazonaws.com/2013-02-16-url-rovidito-1-resz/AngularJS-hogyan.png "AngularJS Hogyan" %}

Most készíteni fogunk egy URL rövidítő oldalt. Az első részben csak offline lesz és semmit
sem fog elmenteni sehova. A második részben alá pakolunk egy szerveroldali réteget, hogy
amit berakunk URL-eket, azokat mentse is el valahova.

Kezdjük a legelején. Mit fogunk használni? [AngularJS](http://angularjs.org/)
fogja kezelni a kliensoldali részt. Ez fog ügyelni arra, hogy minden adat a helyén legyen.
Először ezt állítjuk hadrendbe. Persze jó volna egyből alá rakni egy
[Node.js](http://nodejs.org/) keretet, hogy később ne kelljen túlzottan mozgatni a
dolgokat, de ezt mi most nem tesszük meg. Most csak a kliensoldali résszel foglalkozunk.
Amúgy sem kell sokat mozgatni és átírni hozzá.

<!--more-->

A következő felvonásban alá rakjuk a már emlegetett Node.js-t és adatbázisként
[MongoDB](http://www.mongodb.org/)-t fogunk használni. Természetesen mással is használható,
de jelenleg én ehhez csinálom a cikket és ezt használom. Minden későbbi fejezet attól függ,
hogy mi az igény és/vagy még mire lesz kedvem.

### HTML struktúra

Mivel ez egy rém egyszerű dolog lesz, mármint a végcél, így sok dolgunk nincs a layout
munkálataival.

{% include_code Layout 2013-02-16-url-rovidito-1-resz/index.html %}

Mi mit jelent ebben? Első ami szembetűnik, hogy a `html` kapott egy `ng-app`
tulajdonságot. Ez megmondja, majd szépen az AngularJS-nek, hogy ez egy olyan alkalmazás,
amit neki kezelnie kell. Itt értéknek megadható egy `Project` a tulajdonság értékeként,
de ez nekünk most nem fontos.

Ezek után a szokásos `head` rész, amiben betöltjük a css fájlunkat, ami majd a stílust
határozza meg, az `angular.min.js`, ami önmaga az AngularJS és az `app.js` fájt, ami
tartalmazza, hogy mit csinál az oldal. A mi saját kódunk.

``` html
<div ng-controller='App.controllers.Link'>
  <!-- egyéb kód -->
</div>
```

Az AngularJS alapvetően ebből tudja, hogy az adott elem meglétével, kelleni fog neki egy
kontroller. Jelen esetben a `Link` kontroller. Az `App.controllers` nem AngularJS
specifikus, hanem én így különítem el a kód bizonyos részeit, ami most ugye a kontroller.

A kontroller fog cselekedni. Ez mondja meg, hogy mit kell csinálni. Itt adhatunk meg
társításokat (`data bind`), amikkel adott mező értékét össze tudjuk kötni változókkal,
vagy épp függvényekkel. Azok a függvények lesznek eléthetőek _(mondjuk)_ a `view` számára,
amiket itt megmondunk, hogy elérhet.

``` html
<form ng-submit="addLink()">
  <input type="text"
         ng-model="newLink"
         placeholder="add new link here">
  <input type="submit" value="add">
</form>
```

{% include post/adsense_left.html %}

Ezek után találkozunk egy űrlappal, amiben egy sima `text` típusú mező és egy `submit`
gomb található. A `form` rendelkezik egy `ng-submit` tulajdonsággal, aminek az értéke
`addLink()`. Ez tulajdonképpen egyenlő az `onSubmit` eseményre való hivatkozással, csak
épp itt a szokásos `ng-` prefixet kapta meg. Az `addLink` nevű függvény fog lefutni.
A zárójelek azért kellenek, mert változót is átadhatunk neki paraméterben.

A beviteli mezőnk pedig egy `ng-model` tulajdonsággal lett felruházva, aminek hatására,
ha változik a mező értéke, akkor azt megkapja egy `newLink` nevű változó is a
kontrollerben megadottak szerint _(hamarosan)_.

``` html
<tr ng-repeat="link in links">
  {% raw %}<td><a href="{{link.short}}">{{link.short}}</a></td>{% endraw %}
  {% raw %}<td><a href="{{link.long}}">{{link.long}}</a></td>{% endraw %}
  {% raw %}<td>{{link.clicks}}</td>{% endraw %}
  {% raw %}<td>{{link.created_at}}</td>{% endraw %}
</tr>
```

Ezek után egy sima táblázatot látunk, ami talán abban tér el a megszokottól, hogy a fejléc
után a `tr` kapott egy `ng-repeat`-et. Ez amolyan `forEach` azzal a különbséggel, hogy nem
a benne találhatóakat ismétli, hanem önmagát az elemet is. Tehát jelen esetben a
_(kontrollerben meghatározott)_ `links` tömb minden elemén végighaladunk és minden elemre
a cikluson belül `link` néven akarunk hivatkozni.

Ezek után – hasonlóan a [Twig](http://twig.sensiolabs.org/) _(PHP)_ template rendszerhez –
két kapcsoszárójelbe rakva pakolunk ki tartalmat a böngészőbe.

### JavaScript: AngularJS

Most jön a lényegi rész. Eddig csak firkáltunk, a lapunk nem csinált semmit és még hülyén
is nézett ki. Varázsoljunk rá mozgást.

{% include_code AngularJS alkalmazásunk 2013-02-16-url-rovidito-1-resz/javascripts/app.js %}

{% include post/adsense_right.html %}

Akkor most bontsuk szét. Először is találunk egy `App` objektumot, amibe pakoltunk egy
üres `controllers` objektumot. Ez lesz majd a kontrollerek helye. Ismétlem nem kell így
csinálni, de én így látom át igazán. Mindennek meg kell lennie a helyének :) Továbbá
található benne egy `utils` és egy `configuration` objektum. Előbbibe pakoljuk majd azokat
a kódjainkat, amik segítenek nekünk, mint például az URL generáló.
Utóbbiban pedig az URL képzéséhez használt adatok vannak, mint például a domain és a protocol.

``` javascript
(function UrlUtils (app) {
  app.utils.url = {
    get: function(path) {
      return app.configuration.protocol + "://" + app.configuration.domain + path;
    }
  };
})(App);
```

Ez egy rém egyszerű függvény, ami kap egy `path` értéket, és elédobja az URL statikus
részét. Nagyjából mindent be szoktam zárni egy függvénybe, hogy csak ahhoz férjen hozzá,
amihez én akarom és belőle is csak az látszódjon, amit én akarok, hogy lássanak belőle.

``` javascript
app.controllers.Link = function ($scope) {
  // egyéb kód
}
app.controllers.Link.$inject = ['$scope'];
```

Itt két dolgot csinálunk, mégis egyet. Először is létrehozunk egy kontrollert, ami a már
jól ismert `App.controllers.Link` címen lesz elérhető. Egyetlen paramétere a `$scope`, mert
most még mást nem használunk. Ami a `$scope` alá bekerül _(tulajdonsága)_, az fog látszódni
a `view`-ban is. Tehát itt fogjuk majd létrehozni a `links` tömböt és az `addLink` függvényt.
Az utána lévő sor megadja, hogy mik a paraméterei a kontrollerünknek, mert ha tömörítjük a
végén a JavaScript kódot, akkor nem fogja tudni az AngularJS, hogy mi a neve a változónak.
Érdekes elgondolás, hogy a változó neve alapján adja meg a paraméter értékét és nem a
paraméterek sorrendje számít, de így nagyon kényelmes.

``` javascript
$scope.links = [];
$scope.addLink = function addLink () {
  $scope.links.unshift({
    short: App.utils.url.get("/a4d56g"),
    long: $scope.newLink,
    clicks: 0,
    created_at: new Date()
  });

  $scope.newLink = "";
  return null;
};
```

Legyen akkor a `$scope` alatt egy `links` tömb, ami alapértelmezetten üres. A következő
részben majd letöltjük a szerverről induláskor a már meglévőket. Ezek után létrehozzuk az
`addLink` függvényt, ami ugyebát az űrlapunk `onSubmit` eseményére hívódik meg. Az egész
egy egyszerű tömbművelettel indul, minthogy egy objektumot betolunk a `links` tömbünk
elejére. A tömb tulajdonságai ugyebár a `short`, amit az `App.utils.url.get` függvénye
ad vissza, a `long` az a megadott linkünk. A `clicks` jelenleg teljesen mindegy, simán
nullára állítjuk. A `created_at` mező meg csak azért van, hogy tudjuk mikor lett
létrehozva így felveszi az aktuális időt értéknek. Ezek után kitöröljük a `newLink`
értékét.

{% include post/adsense_right.html %}

Mivel a tömbünk össze lett kapcsolva az `ng-repeat` használata során a táblázattal, így
ha változik a tömb, akkor frissíti a táblázat sorait.

Nem túl érdekes a link generálása, mert most statikusan minden URL végére ugyan azt
fogja tenni. Amiért nem törtem magam rajta, az azért van, mert ez úgyis a szerver oldalon
fog generálódni.

Van benne egy hivatkozás, ami furcsa lehet – még a többihez képest is – mégpedig önmaga
a `newLink`. Ugye már mondtam, hogy a kontrollerben megadott változókhoz fér hozzá a `view`.
Viszont, ha `ng-model` segítségével megadok egy változót, ám az nem létezik, akkor
létrehozza nekünk a `$scope` alatt.

### Meddig jutottunk?

Egyelőre egy teljesen használhatatlan offline alkalmazást csináltunk, amibe be tudunk
írni bármit és ahhoz ő csinál egy "rövid" címet. Az eddig elkészült rész
[megtekinthető itt](/downloads/code/2013-02-16-url-rovidito-1-resz/index.html).

#### Kapcsolódó linkek:

* [URL rövidítő 2. rész](/blog/2013/03/28/url-rovidito-2-resz/)