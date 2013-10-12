---
layout: post
title: "Google+ kommentek nem Blogger oldalon"
date: 2013-04-19 09:07
comments: true
categories: [google+, google, api, hogyan, tricks, javascript]
image: http://dev-gcs.folyam.info/2013-04-19-google-plus-kommentek-nem-blogger-oldalon/googleplus-comments.png
---

{% img left http://dev-gcs.folyam.info/2013-04-19-google-plus-kommentek-nem-blogger-oldalon/googleplus-comments.png 400 Google+ Comments on your non-Blogger site %}

Tegnap megjelent a [Google+ Comments](http://googleblog.blogspot.hu/), ami egyelőre csak a
[Blogger](http://www.blogger.com/) rendszerében aktiválható elvileg. Mikor leültem tegnap
a gép elé, pont akkor jelent meg előttem a hír. Szépen beúszott egy kis _fade_ effekttel.
Már abban a pillanatban tudtam, hogy bizony ezt nekem nagyon gyorsan ki kell operálnom és
meg kell találnom a beágyazás módját.

<!--more-->

Lévén a Blogger nagyrészt JavaScript alapokon tölti
meg az összes widget-et, így kicsit nagyobb szívás volt, nem is beszélve arról, hogy az
összes JavaScript fájl szépen be volt tömörítve _(minified)_, ami még inkább megnehezítette
a munkát. Nem sokkal később viszont sikeresen reprodukáltam a _Comments_ blokkot a _[Dev]
Folyam.info_ posztjaira is. Mint látható immáron az van itt lent is. Minden korábbi
[Disq.us](http://disqus.com/) komment így elveszett, de lett helyettük sok szép Google+
_"komment"_. Tegnap egy gyors cikk keretében publikáltam már a kódrészt és a mikéntjét a
[Code-Infection Blog](http://blog.code-infection.com/2013/04/google-comments-on-your-none-blogger.html)-on
viszont itt most kicsit részletesebben bemutatom. Láthatóan kicsit hosszabb is lett a cikk.

### Mit csinál?

Hasonló működése van mint egy +1 gombnak, csak itt egyelőre nincs automatikus feldolgozás.
Van egy html elemed és a megfelelő `gapi` kérésre abban elhelyez egy iframe-et. Jelenleg
kicsit hazudni kell neki, mert van egy paraméter, aminek az értéke **BLOGGER**, ha persze
ezt kicserélem bármi másra, akkor 400 Bad Request hibát kaptam, így egyelőre ők tényleg
úgy tervezték, hogy csak a blog rendszerükben lesz elérhető. Kicsit naív hozzáállás.

### Előkészületek

Hogy a legegyszerűbb legyen használni azt szeretnénk, hogy simán létrehozva egy html
element, azt ellátva megfelelő `data-` tulajdonságokkal, nekünk az betöltődjön.

``` html
<div id="gpluscomments"
     data-href='{{ site.url }}{{ page.url }}'
     data-viewtype='FILTERED_POSTMOD'></div>
```

Jelenleg `id`-val oldottam meg, mivel csak egy komment dobozom van egy oldalon, de
természetesen megoldható, hogy csak egy `class` megadásával a JavaScript végighalad az
elemeken és ad nekik egy számmal ellátott `id`-t, ahogyan ezt a `plusone.js` is csinálja
a +1 gomboknál. Két paramétert használtam két egyszerű ok miatt.

{% include post/adsense_right.html %}

1. A Bloggeren is ezeket pakolja a html elemre, így valószínűleg ezek lesznek a
későbbiekben is dinamikus paraméterek.
2. A többi paraméter eléggé fix, tehát felesleges azokat is ide pakolni :)

De mik is ezek? A `data-href` tárolja az adott oldal címét, ami mondjuk a canonical címe,
hogy biztos ugyan az legyen. A `data-viewtype` már érdekesebb. Nem másztam bele túlzottan,
de egyelőre ezt az egyet találtam paraméternek. Tehát utólagos spamszűrés legyen a
kommentekre. Valószínűleg lesz később más is, különben nem tették volna bele ezt a
paramétert _(bár a Google+ API több olyan kötelezően megadott paramétert tartalmaz,
amikre egyelőre csak egy válasz van, mint például az `Activity` public értéke)_

### Mondjuk meg a `gapi`-nak...

Mi ezt szeretnénk használni, de ha csak ennyit csinálunk, akkor nem fog semmi extra
történni. Nah hát végülis bekerül egy üres `div` a DOM struktúrába, de ez nem egészen az
amit mi szeretnénk elérni.

Kicsit meg kell turkászni a `plusone.js` betöltését. Természetesen mindenki az
[async metódust](https://developers.google.com/+/web/+1button/#async-load) használja,
mert jobb, szebb és nem utolsó sorban nem állítja meg az oldal betöltését :)

``` html Eddig így nézett ki
<script type="text/javascript">
  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
</script>
```

Nekünk azt kellene ugyebár elérni, hogy miután betöltődött renderelje le a komment
dobozunkat. Mi sem egyszerűnn, mint rápakolni egy `onload` eseményre meghívódó callback
függvényt. Ebben a függvényben meghívjuk a `gapi.comments.render` metódust az alábbi
paraméterlista szerint:

``` javascript
gapi.comments.render(
  target_id,                // :string, a tartalmazó elemünk id-ja
  Options {                 // :object
    href                    // :string, az oldal url-je
    view_type               // :string, egyelőre csak utómoderált
    first_party_property    // :string, nah itt hazudunk: BLOGGER
    width                   // :integer, mértékegység nélküli szélesség
  }
);
```

jQuery-vel kicsit gyorsabban és egyszerűbben kiszedhetőek a `data-` értékek, meg nagyon
gyorsan és egyszerűen megnézhető az elemünk szélessége is, de nem szerettem volna, ha
bárki is kényszerítve lenne a jQuery használatára, így inkább anélkül csináltam meg,
ehhez viszont be kellett pakolnom egy új függvényt, ami segít lekérdezni a szélességet.

``` javascript
function _getComputedStyle(el, cssprop){
  if (el.currentStyle) {
    // IE nem tudja mi az a getComputedStyle
    return el.currentStyle[cssprop]
  } else if (document.defaultView && document.defaultView.getComputedStyle) {
    // Az értelmesebb böngészők igen
    return document.defaultView.getComputedStyle(el, "")[cssprop]
  } else {
    // Ha semmi nincs, akkor bepróbálkozunk az inline style-al is
    return el.style[cssprop]
  }
}
```

Miután már ez is megvan már csak az adatokat kell begyűjteni :)

``` html A végleges verzió
<script type="text/javascript">
   window.___gcfg = {lang: '{{ site.lang }}'};

  (function() {
    function _getComputedStyle(el, cssprop){
      if (el.currentStyle) {
        // IE nem tudja mi az a getComputedStyle
        return el.currentStyle[cssprop]
      } else if (document.defaultView && document.defaultView.getComputedStyle) {
        // Az értelmesebb böngészők igen
        return document.defaultView.getComputedStyle(el, "")[cssprop]
      } else {
        // Ha semmi nincs, akkor bepróbálkozunk az inline style-al is
        return el.style[cssprop]
      }
    }


    var script = document.createElement('script');
    script.type = 'text/javascript'; script.async = true;
    // Éljen az onload :)
    script.onload = function() {
      // Ha van gapi és annak comments eleme, aminek render eleme
      if (gapi && gapi['comments'] && gapi.comments['render']) {
        // Betöltjük az adott id-val ellátott elemet
        var gPlusComment = document.getElementById('gpluscomments');
        // Meghívjuk az rendert
        gapi.comments.render(
          'gpluscomments',
          {
            // kiszedjük az url-t a html elemünkről
            href: gPlusComment.getAttribute('data-href'),
            // kiszedjük, hogy milyen viewtype-ot akarunk
            view_type: gPlusComment.getAttribute('data-viewtype'),
            // marad statikusan BLOGGER, gondolom később jön ide a GAPI Client ID
            first_party_property: "BLOGGER",
            // szélesség px nélkül
            width: parseInt(_getComputedStyle(gPlusComment, "width"), 10)
          }
        );
      }
    };
    script.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(script, s);
  })();
</script>
```

Ezek után, ha ujratöltjük az oldalunkat, akkor miután a `plusone.js` betöltődött lefut
a jó kis kiegészítésünk, aminek hatására megjelenik a Google+ Comments doboz :)

### Végeredmény

{% include post/adsense_right.html %}

Van egy nagyon pofásan kinéző kommentrendszerünk, aminél minden hozzászólás egy Google+
posztot jelent. Ami nagyon jó benne, hogy az is ide kerül, ami nem innen lett megosztva,
hanem valaki Google+-on továbbosztotta publikusan vagy simán csak az url-t megosztotta.
Ezen kívül pedig a posztokra érkező kommenteket is láthatjuk és akár válaszolhatunk is
rájuk kommentként, ami itt is és Google+-on is megjelenik.

Van benne olyan opció is, hogy csak itt látható kommentként, de nem akarod megosztani
Google+-on. A szűrés pedig zseniális :)

{% blockquote Megjegyzés és megosztás, Google+ Comments %}
  Te döntöd el, hogy a megjegyzésed csak itt jelenjen-e meg,
  vagy a Google+ szolgáltatásban is.
  Bárhogy is dönts, csak a kiválasztott személyek
  és körök tagjai láthatják.
{% endblockquote %}

Remélem mielőbb bekerül a rendszerbe publikusként és nem kell ezen kis mókázás hozzá, de
addig is ez egy nálam jól működő megoldás.

Ti mit vártok el a Google+ Comments-től? Mi az ami már most látszik, hogy nem jó benne?
Akarjátok egyáltalán vagy bármi csak ne közösségi oldallal összekötött kommentelő?
