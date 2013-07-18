---
layout: post
title: "URL rövidítő 3. rész"
date: 2013-07-05 19:31
comments: true
categories: [angularjs, hogyan, html, javascript, node.js]
image: http://s3-dev.folyam.info/2013-07-05-url-rovidito-3-resz/image.png
---

{% img left http://s3-dev.folyam.info/2013-07-05-url-rovidito-3-resz/image.png 300 %}

Ugye szeretnénk csinálni egy URL rövidítő alkalmazást. Nincs ezzel semmi baj, mert
azt mindenki szeret csinálni. Leginkább azért, mert mindenki más ToDo alkalmazásokat csinál :)

Az [első részben](/blog/2013/02/16/url-rovidito-1-resz/) megtudtuk, hogyan
működik az [AngularJS](http://angularjs.org/). Ezek után,
a [második részben](/blog/2013/03/28/url-rovidito-2-resz/) raktunk mögé egy
[Node.js](http://nodejs.org/)-t, hogy erre tudjunk építkezni.
Itt az ideje összekötni a kettőt. Amikor beküldünk egy linket, akkor
a szerver állítson elő egy rövid címet hozzá. És itt jön a harmadik rész.

<!-- more -->

### Szerver oldali rész

Természetesen mindenkinek ott figyel a gépén az eddigi kód. Akinek mégsem az eléri a
[Bitbucket
tárólót](https://bitbucket.org/folyam/url-r-vid-t/src/37a7427b4acc2cf93320180075a47f5c1faa1573/?at=v2.0)
és le bírja tölteni. Létrehoztunk egy `/routes/index.js` fájlt, amit nem használtunk.
Legalábbis nem sok minden volt benne. A jelenlegi tartalma így néz ki:

``` javascript
module.exports.index = function(req, res) {
    res.json({ "wtf": true });
};
```

Most akkor itt az ideje okosítani rajta. Ezt a függvényt békén is hagyjuk egyelőre, hogy
a későbbiekben ne zavarjon meg minket az elnevezés. Hozzunk létre egy másik függvényt
mondjuk `addLink` néven. Ezen kívül ugyebár hasznos lenne generálni is egyből egy rövid
azonosítót neki. Tehát létrehozunk egy `Link` _"Objektumot"_ is. Az, hogy most nem csak
egyszerűen generálunk, később lesz hasznos, amikor majd adatbázisban tároljuk, mert akkor
amúgy is ilyen formában fogjuk kezelni.

``` javascript
module.exports.index = function(req, res) {
  res.json({ "wtf": true });
};

var Link = function(long_url) {
  // Így néz ki egy link.
  // Ezt a struktúrát használtunk az első részben is.
  this.short = "";
  this.long = long_url;
  this.clicks = 0;
  this.created_at = new Date();

  // Legeneráltatjuk a rövid azonosítót
  this.generateShort();
};

Link.prototype.generateShort = function() {
  // A range nevű hosszú string lesz az alapja a generálásnak.
  // Ezen karakterek fordulhatnak elő benne.
  var range = "qwertyuiopasdfghjklzxcvbnm1234567890",
      // elmentjuk a hosszát is ennek, hogy ne kelljen a ciklusban
      // minden körben megnézni újra.
      rangeLength = range.length;

  // Jelenleg egy hét karakteres azonosító jó lesz.
  for (var i=0; i < 7; i++) {
    // Minden körben elmentünk a range stringből egy véletlenszerű karaktert.
    // Elég primitív generálás, de majd később okosítunk rajta, hogy
    // ne kelljen sok kört futni az egyedisége miatt.
    this.short += range.charAt(Math.floor(Math.random() * rangeLength));
  }

  return true;
};

module.exports.addLink = function(req, res) {
  // Kiszedjük a POST (azaz body) részből a linket
  // Ha nincs, akkor `link` vagy 0 karakter hosszú,
  // akkorvisszatérünk hibával.
  if (typeof req.body.link == "undefined" || req.body.link.length < 1) {
    return res.json({"error": true, "message": "empty url"});
  }
  // Ha van link, akkor csinálunk egy új Link példányt,
  // ami majd lerendezi nekünk a megfelelő átalakításokat
  var link = new Link(req.body.link);
  // aztán vissza is tudunk vele térni.
  return res.json(link);
};
```

{% include post/adsense_right.html %}

Ezzel meg is volnánk. De mit csináltunk? A `module.exports.index` függvényt békén hagytuk,
majd létrehoztunk egy `Link` "Objektumot", amiből majd mindig csinálunk új példányt.
A kontruktora 1 paramétert vár, ami nem más mint a link. A hosszú link. Szépen létrehozza
az alap struktúrát, hogy mindennek legyen értéke majd, ha közben bármi is történik.
Készítettünk hozzá egy `generateShort` nevű függvényt, ami egy adott karakterkészletből
generál 7 karakter hosszú azonosítót.

Miután már van `Link` és a rendszer tudja mit kezdjen vele, megcsináltuk a függvényt,
ami majd lefut, amikor adott URL-t kérnek. Megnéztük, hogy a POST adatokban – ami ugyebár a
kérés body része – van-e `link` nevű paraméter. Ha nincs vagy az 1 karakternél rövidebb, akkor
visszaadunk egy hibát, miszerint üres a megadott link, amihez ugyebár nem tudunk (vagy
legalábbis nem szeretnénk) rövid azonosítót generálni. Amennyiben van és még nem is üres,
akkor létrehozunk egy `Link` példányt, aminek megadjuk a kapott linket. Ezek után lefut a
már fentebb leírt folyamat, majd visszatérünk a kliensnek a link json formájával.

Még egy apró módosítás kell ehhez. Most ugyebár a rendszer nem tud róla, hogy mikor kell
meghívni az `addLink` függvényt. Nyissuk meg a gyökérben lévő `app.js`-t. Itt hagytunk
egy részt, ahova majd a route-okat visszük fel. Ide helyezzük el a következő sort:

``` javascript
// Most akkor állítsuk be a routokat
// Ezt most nem definiáljuk, mert
// jelen esetben szeretnénk, ha az index.html lenne használva
// a public-ból, amikor betöltjük az oldalt.
//app.get("/", routes.index);
app.post("/link", routes.addLink);
```

Az elején lévő sok kommentelt részt azért másoltam be, hogy látható legyen hova kell rakni.
Az az 5 sor már most is ott van a kódban. Most tulajdonképpen megadtuk, hogy ha az alkalmazásunk
kap egy POST kérést, aminek a célja a `/link`, akkor hívja meg a `routes.addLink` függvényt
és majd az teszi a dolgát.

Ha készen van, akkor futtathatjuk az alkalmazást a jól megszokott `node app.js` parancssal.
Tesztelni, hogy működik-e a legegyszerűbb, ha terminálból meghívjuk az url-t. Ebben nagy
segítség tud lenni a curl nevű nagyszerű csomag.

```
(clockwork) Ξ ~ → curl -X POST \
                       -H "Content-Type: application/json" \
                       --data "{\"link\": \"\"}" \
                       http://localhost:3000/link
{
  "error": true,
  "message": "empty url"
}
(clockwork) Ξ ~ → curl -X POST \
                       -H "Content-Type: application/json" \
                       --data "{\"link\": \"ajshdj\"}" \
                       http://localhost:3000/link
{
  "short": "wlkdd70",
  "long": "ajshdj",
  "clicks": 0,
  "created_at": "2013-07-05T18:10:50.631Z"
}
(clockwork) Ξ ~ →
```

Láthatóan szépen visszatért mind a rövid, mind pedig a hosszú linkkel, ha pedig nem adtunk meg
linket, akkor a hibával.

### Kliens oldali rész

Miután megcsináltuk, hogy a szerver tudjon mit kezdeni majd a kliens kéréseivel, jöhet a kliens.
Ehhez nem kell más csinálnunk, csak megmondani az Angular.js-nek a `/public/javascripts/app.js`
fájlban, hogy küldje fel a szerverre, majd az alapján írja ki a linket. Van most jelenleg egy
ilyen szép controller-ünk:

``` javascript
  app.controllers.Link = function ($scope) {
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
  };
  app.controllers.Link.$inject = ['$scope'];
```

Nah ezt kell kicsit megokosítani. Most ugyebár csak fixen beírjuk, hogy mik a link adatai és
kész. Ezt kell megoldani, mert ez hoszú távon (más a második linknél) problémát okozhat.

``` javascript
  app.controllers.Link = function ($scope, $http) {
    // Ebben vannak a linkek, amikről tudunk.
    $scope.links = [];

    // Hozzáadunk egy függvényt a scope-hoz, ami
    // akkor fog meghívódni, amikor megnyomjuk az
    // add gombot.
    $scope.addLink = function addLink () {
      // Azonnal el is indítunk egy POST kérést
      // a szerver felé. A szerver egy link nevű
      // paramétert vár a kérés törtzsében, ezt
      // meg is adjuk neki. Ha kész, akkor meghívódik
      // a callback.
      $http.post('/link', { link: $scope.newLink }).success(function(data, status) {
        // Ha a válasz státuszkódja nem 200, akkor
        // baj van. Erről szólni illik a felhasználónak
        // még ha nem is ilyen barbár alert ablakkal.
        if (status != 200) {
          alert("Valami hiba történt!");
          return false;
        }
        // Ha van error kulcs a kapott adatban
        // és az igaz, akkor adjuk vissza
        // a felhasználónak a hozzá tartozó
        // hibaüzenetet.
        if (data.hasOwnProperty('error') && data.error == true) {
          alert(data.message);
          return false;
        }
        // Írjuk felül a kapott adatot, legalábbis
        // a short tulajdonságát, mert az ugye
        // nem tartalmazza csak a rövid kódot,
        // míg mi linket szeretnénk kirakni.
        data.short = App.utils.url.get("/" + data.short);
        // Adjuk hozzá a tömbünk elejéhez.
        $scope.links.unshift(data);
      });

      // Ürítsük ki a beviteli mezőnket, hogy
      // új linket lehessen felvinni.
      $scope.newLink = "";
      return null;
    };
  };
  // JavaScript tömörítők esetén nem tudja az Angular.js,
  // hogy mik a paraméterek így meg kell neki mondani.
  // Ha nem tömöríted, akkor is érdemes megadni, mert
  // később kényelmetlen mindenhova felvinni, ha mégis
  // szeretnéd tömöríteni.
  app.controllers.Link.$inject = ['$scope', '$http'];
```

Hosszúnak tűnik, de nem az csak telepakoltam hasznos kis kommentekkel. Tehát mi történik?
Miután meghívódik az `addLink` függvény egyből elindítunk egy `POST` kérést. Az Angular.js
`$http` modul függvényei nem paraméterként kérik be a callback-et, hanem úgynevezett ígérettel
térnek vissza. Ennek az a logikája, hogy megígéri, hogy ott lesz adat és az ígéretnek van
státusza, miszerint még nincs adat vagy van, eseteg hiba történt.

Jelen esetben, ha lefutott, akkor meghíva az általunk megadott callback függvényt, ami
két paramétert vár (meg is fogja kapni), ami az adat és a válasz státusza. Egyből
meg is nézzük, hogy mi a státusz és ha az nem 200, akkor hiba történt (például 500, 404).
Ha nem volt hiba és 200-as kódot kaptunk, akkor megnézzük, hogy van-e `error` tulajdonsága
a kapott adathalmaznak. Ha van, akkor a szervernek nem tetszett valami. Jelen esetben
egy ilyen van, ha üres volt a link. Ha ilyen hiba előfordul, akkor szólunk a felhasználónak.
Persze lehet kultúráltabban is, mint egy szép `alert` ablakot feldobatni, de most jó lesz ez is,
lévén az oldal többi része se néz ki túl szépen. Ha készen van, akkor majd húzunk rá valami szép
felületet is :) Megígérem.

Ha nem volt hiba sehol, akkor a kapott adatokból a `short` értéket felölírjuk, mert
most csak egy 7 karakter hosszú azonosítót tartalmaz, amiből valós linket kellene készíteni.
Erre már ott van az `App.utils.url.get` függvényünk, azt nem is bántjuk most. Egyelőre.
Ha megvan, akkor betoljuk a `$scope.links` tömbünk elejére, aminek hatására megjelenik
az oldalon is.

### Összefoglaló

{% include post/adsense_right.html %}

Tudom, hogy megint nagyon sokat kellett várni a következő részre, de lassan megszokom,
hogy buzgálkodjak ezzel is rendszeresebben. Míg egy _"sima"_ cikk írása elsősorban
kutatás, olvasás és írás, addig itt elő is kell állítanom közben a kódot.

Persze nem is arról szólt a cikk, hogy miért tartott ilyen sokáig. Az eddigi kliens és
szerver oldali részt most összekötöttük. Persze még mindig nem mentettük el adatbázisba,
meg úgy sehova sem az adatokat, de már legalább a két réteg beszélget egymással. Haladás.

Holnap vagy holnapután _(tényleg)_ pedig rakunk bele egy [MongoDB](http://www.mongodb.org/)-t,
amibe elmentjük az adatokat, persze előtte jól leteszteljük, hogy már létezik-e vagy sem.

#### Kapcsolódó linkek:

A forrás elérhető itt:
[https://bitbucket.org/folyam/url-r-vid-t](https://bitbucket.org/folyam/url-r-vid-t/src/?at=v3.0)

* [URL rövidítő 1. rész](/blog/2013/02/16/url-rovidito-1-resz/)
* [URL rövidítő 2. rész](/blog/2013/03/28/url-rovidito-2-resz/)
