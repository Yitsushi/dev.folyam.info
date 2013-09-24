---
layout: post
title: "Hogyan lett 10 ponttal jobb a Mobile PageSpeed?"
date: 2013-09-24 23:36
comments: true
categories: [javascript, recommended, tricks]
image: 
---

{% img left http://s3-dev.folyam.info/2013-09-24-hogyan-lett-10-ponttal-jobb-a-mobile-pagespeed/DevSpeedUp.png 300 Dev SpeedUp %}

Manapság a mobil netezők száma igen nagy, ezért fontos, hogy gyorsan töltődjön be az
oldal. Mobil felületen még inkább szembetűnő, ha nem gyors a weboldal. Ott jobban fáj
mindenkinek. Tudjuk jól, hogy a tartalom felszolgálása az elsődleges és hogy annak
minél előbb ott kell lennie a kijelzőn. Pár napja írtam egy cikket az androgeek portálra
[JavaScript: Google mondja! De igaza van?](http://androgeek.eu/javascript-google-mondja-de-igaza-van)
címmel, ahol azt taglalom, hogy milyen megoldások vannak JavaScript kódunk betöltésére.
Hogy néz ki ez a valóságban? Éles példán keresztül nézzük most meg.

<!-- more -->

Úgy gondoltam, ha már ilyen szépen összeszedtem és bemutattam, hogy melyik módszer milyen
hatással van a betöltési sebességre, ami ugyebár a keresők számára sem utolsó, akkor
ránézek a [Dev] Folyam.info és a [Folyam.info](http://folyam.info) oldalakra is.
Olyan 72 és 75 körül mozgott az átlagos
[Mobile PageSpeed index](https://developers.google.com/speed/pagespeed/insights/), ami
nem mondom, hogy rossz, de azért nem is jó.

Első lépésben ami nagyon piros volt, mi lett volna, ha nem a JavaScript állományok
betöltése. Ezek durván megfogták a böngészőt. Írtam, hogy az onLoad eseményre való
betöltés sokat segíthet az oldal sebességének drasztikus növelésében. Legalábbis érzetre,
mivel ugyan annyi idő lesz betöltenie a böngészőnek, de a különböző JavaScript fájlokat
már csak akkor tölti be, ha az oldal betöltődött. Végülis milyen igaz, amíg nincs ott a
tartalom minek Google+ komment, +1, Facebook like meg minden egyéb.

### Alap JavaScript struktúra

{% include post/adsense_right.html %}

Mivel a legkevesebb ACK-t akarom elérni az oldal betöltéséig, így a legfontosabb
scriptrészeket egyből beágyaztam az oldal aljába. Ez nem más, mint egy nagyon alap
Application objektum, aminek van egy `delegate` és egy `init` függvénye. Ezen kívül pedig
az onLoad lekezelését valósítja meg. A `delegate` függvénnyel lehet új kódrészt hozzáadni
az oldalhoz. Amik ide bekerülnek, azok csak azután futnak le, miután az onLoad esemény
elsütését követően betöltődött az összes előre megadott JavaScript fájl. Ezek után szépen
végighalad és meghívja mindegyiket.

``` javascript
var Application = (function() {
  var modules = {};
  return {
    delegate: function(name, callback) {
      modules[name] = callback;
    },
    init: function() {
      for (var name in modules) {
        if (modules.hasOwnProperty(name)) {
          modules[name]();
        }
      }
    }
  }
}());
```

### Delegáció

Ezek után szépen felsoroltam a nekem kellő JavaScript kódokat, melyeket nem pakoltam külső
fájlba, mert éppen nem érte meg nekem ezért a pár sorért. Lehet Egyszer kikerülnek, így
nem is lesz használva, de az mindegy is most. Egy pár példa:

``` javascript
// A kifele mutató linkeket nyissa új lapon.
Application.delegate('external_link', function() {
  jQuery('a[href^="http://"], a[href^="https://"], a[href^="/downloads"]')
    .attr('target', '_blank');
});

// Google+ commentekhez.
window.___gcfg = {lang: '{{ site.lang }}'};
Application.delegate('google-plus-comment', function() {
  function _getComputedStyle(el, cssprop){
   if (el.currentStyle) {
    // for IE
    return el.currentStyle[cssprop]
   } else if (document.defaultView && document.defaultView.getComputedStyle) {
    // Any other normal brwoser (like Chrome, Firefox)
    return document.defaultView.getComputedStyle(el, "")[cssprop]
   } else {
    // Try get inline style
    return el.style[cssprop]
    }
  }


  var script = document.createElement('script'); script.type = 'text/javascript';
  script.async = true;
  script.onload = function() {
    if (gapi && gapi['comments'] && gapi.comments['render']) {
      var gPlusCommentContainer = document.getElementById('gpluscomments');
      if (gPlusCommentContainer == null) {
        return false;
      }
      gapi.comments.render(
        'gpluscomments',
        {
          href: gPlusCommentContainer.getAttribute('data-href'),
          view_type: gPlusCommentContainer.getAttribute('data-viewtype'),
          first_party_property: "BLOGGER",
          width: parseInt(_getComputedStyle(gPlusCommentContainer, "width"), 10)
        }
      );
    }
  };
  script.src = 'https://apis.google.com/js/plusone.js?publisherid={{ site.googleplus_page }}';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(script, s);
});

// Facebook all.js betöltése.
Application.delegate('facebook', function() {
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js#appId=212934732101925&xfbml=1";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
});
```

### Töltsünk be mindent, ha kész az oldal

Már csak az egészet elindító onLoad esemény figyelését kell beállítani és kész is vagyunk.
Ez hasonlóan egyszerű kód, hiszen hova bonyolítsuk. Itt gyorsan bele is futottam, hogy az
én delegált kódjaimnak csak azután szabad lefutnia, miután már az összes külső fájl
betöltődött, így logikusan a scriptek onLoad-ját is figyelni kell, de ezután jött, hogy
nekem az összes után kell nem az első után. Nomeg aztán eszembe jutott, hogy a betöltésük
sorrendje sem mindegy, mert ha például a jQuery-t használom és akarok hozzá egy
kiegészítőt, akkor annak utána kell betöltődnie. Gyorsan el is mentem a
[Require.js](http://requirejs.org/) oldalára, de mire betöltődött már fel is fogtam,
hogy nem akarom ezzel is lassítani a rendszert. Csak azért, hogy a jelenlegi alacsony
számú fájlomat kezeljem felesleges.

{% include post/adsense_right.html %}

Nem maradt más, mint a rekurzió. Imádom és talán őrültje is vagyok, mert ahol lehet
használom. Lehet néhe nem kellene, de akkor is. Tehát mikor elsül az oldal onLoad eseménye,
akkor meghívok egy függvényt. Ez meghív egy újabb függvényt, ami kiszedi az első elemét
a fájllistát tartalmazó tömbből és azt betölti. Beállítja onLoad-ra önmagát, így ha
betöltődött az első elem, akkor betölti a tömb első elemét újta, de ugye az előzőt
kiszedtem már, így az eredetileg második elem lesz most az első. Az egész függvény persze
úgy indul, hogy ha üres, akkor meghívja a paraméterben kapott callback függvényt, amit
jelen esetben az eredetileg meghívott `downloadJSAtOnload` definiált és nem már, mint
az `Application.init` meghívása.

``` javascript
(function() {
  var javaScriptFiles = [
    '{{ root_url }}/javascripts/libs/jquery-1.9.1.min.js',
    '{{ root_url }}/javascripts/modernizr-2.0.js',
    '{{ root_url }}/javascripts/ender.js',
    '{{ root_url }}/javascripts/octopress.js',
    'http://www.google.hu/coop/cse/brand?form=cse-search-box&lang=hu'
  ];

  function loadJavaScript(script, callback) {
    var element = document.createElement("script");
    element.src = script;
    element.onload = script.onreadystatechange = callback;
    document.body.appendChild(element);
  }
  function loadNext(callback) {
    if (javaScriptFiles.length < 1) {
      return callback(null, true);
    }
    var current = javaScriptFiles.shift();
    loadJavaScript(current, function() {
      loadNext(callback);
    });
  }
  function downloadJSAtOnload() {
    loadNext(Application.init);
  }

  if (window.addEventListener) {
    window.addEventListener("load", downloadJSAtOnload, false);
  } else if (window.attachEvent) {
    window.attachEvent("onload", downloadJSAtOnload);
  } else {
    window.onload = downloadJSAtOnload;
  }
}());
```

### Mi történt ezután?

Tulajdonképpen nem lesz gyorsabb a teljes oldal betöltése és nem lett kisebb sem tőle az
egész, de túlzottan nagyobb sem. Viszont most nem szórakozik a böngésző a Google,
a Facebook vagy a jQuery betöltésével, amíg be nem töltött a tartalom, aminek köszönhetően
az oldal betöltési ideje drasztikusan csökkent. Az eredetileg 72/75 pont helyett immáron
85 és 87 pont között mozog.

### Egy kis plusz

Az összes képet, amit feltoltam a cikkekhez S3-ra optimalizáltattam az
[ImageOptim](http://imageoptim.com/) nevű ingyenes alkalmazással. Így nagyon sokat
spóroltam az adatmennyiséggel.

{% img center http://s3-dev.folyam.info/2013-09-24-hogyan-lett-10-ponttal-jobb-a-mobile-pagespeed/imageoptim.png ImageOptim %}

Így végül elértem _(Heroku ingyenes használattal belassíthatja néha neki)_ a 91/95 pontos
éréket is. Így végülis 20 pont növekedést értem el vele. De a cikk elsősorban a JavaScript
részről szólt :)

**Te milyen praktikákat követsz? Mi az ami szerinted nagyon sokat ronthat az oldal
betöltési sebességén és mégis sokan elkövetik a hibát?**