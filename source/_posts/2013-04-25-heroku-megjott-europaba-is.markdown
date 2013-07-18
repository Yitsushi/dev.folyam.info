---
layout: post
title: "Heroku megjött Európába is"
date: 2013-04-25 05:54
comments: true
categories: [heroku, cloud]
image: http://s3-dev.folyam.info/2013-04-25-heroku-megjott-europaba-is/heroku-logo.png
---

{% img left http://s3-dev.folyam.info/2013-04-25-heroku-megjott-europaba-is/heroku-logo.png 400 Heroku %}

A [+Heroku](https://plus.google.com/u/0/114423390012692442615/about) elindította Európában is szervereit. Mostantól
– bár egyelőre béta fázisban – létrehozhatóak olyan
alkalmazások is, amelyek EU régióban futnak. Miért is jó ez nekünk? Mi is egyáltalán az a Heroku? Megpróbálom
érthetően és röviden összefoglalni.

<!--more-->

### Mi az a Heroku?

A [+Heroku](https://plus.google.com/u/0/114423390012692442615/about) egy olyan felhő alapú szolgáltatás, ahol nem
komplett gépet adnak nekünk és oda pakolászhatunk, hanem tulajdonképpen csak alkalmazásokat futtatunk. Minél nagyobb
teljesítményre van szükségünk annál több [Dyno](https://devcenter.heroku.com/articles/dyno-size)-t
kell lefoglalnunk. Egy Dyno leegyszerűsítve egy process, ami 512MB memóriát és `1x`-es CPU. Ez nem is olyan régóta
módosult picit abban, hogy nem kell több szál ahhoz, hogy több memóriát kapjon az alkalmazásod, mert lehetőség
van `2x`-es Dyno-t kérni, ami kvázi annyit tesz, hogy 2x akkora erőforrást kapsz. 1db `1x`-es dyno van alkalmazásonként
ingyen. Ezen kívül futtathatsz háttérfolyamatokat úgynevezett `worker`-ekkel. Ez ugyan az mint a Dyno csak háttérben.

### Mit tudok futtatni Heroku alkalmazásként?

{% include post/adsense_right.html %}

Nagyjából bármit. Eleinte Ruby hosztingnak indult, aztán szépen kinőtte magát, így mára a Cedar Stack-nek köszönhetően
Ruby, Java, Python, Clojure, Scala, [Node.js](/blog/categories/node-js) és Play az
alapértelmezetten támogatott. Mivel létre lehet hozni úgynevezett `Buildpack`-eket, hatalmasra duzzadt a nyelvek
listája. Van egy szép nagy
[lista külső fejlesztők által készített csomagokról](https://devcenter.heroku.com/articles/third-party-buildpacks), amik
nagy segítséget adnak ahhoz, hogy Dart vagy épp PHP-t tudjunk futtatni. Természetesen van egy csomó olyan csomag, ami
nem nyelvspecifikus, hanem alkalmazásspecifikus, így van például a
[Wordpress](https://github.com/mchung/heroku-buildpack-wordpress)-hez vagy
[Drupal](https://github.com/patcon/heroku-buildpack-php-drupal)-hoz is. Nagy hátulütője, hogy nincs írható
fájlrendszered, így a képfeltöltéseket mindenképpen valahogyan máshogy kell megoldani.

[Nagyon sok Add-on van](https://addons.heroku.com/), ami elérhető innen és többségéhez van ingyenes `dev` verzió is.
Ha fájlokat akarunk tárolni, akkor erre is van nagyon sok lehetőség, melyek aktiválása nagyon egyszerű a használatukról
meg a legtöbb kiegészítőnek van leírása nyelvekre bontva.

### Mennyibe kerül?

{% pullquote %}
Nah ezt így nehéz megmondani, mert processzoridő alapján kell fizetni. 750 óra ingyenes, ami 1 db `1x`-es Dyno
teljes kihasználásban 31.25 napot jelent. Tehát, ha az webalkalmazásodat nem nézik, akkor idle állapotba kerül,
amiért nem fizetsz _(hiszen lényegében nem fut)_. A `worker`-ekért ugyan így kell fizetni. Ha van 1 Dyno és egy Worker
és azok folyamatosan dolgoztatják a procit, akkor az összesen 750x2 óra futásidőt jelent, így $0.05 óránkénti árral
$37.5-t jelent. {"Ha nem dolgozik folyamatosan, akkor ugyebár ennél kevesebb lesz, de maximum ennyibe fog kerülni."}
{% endpullquote %}

Ezen felül pedig, ha használunk kiegészítőket, akkor azoknak is lehet plusz költsége, ami attól függ, hogy milyen
mértékben akarjuk mi azt használni. Vegyük példának a
[+MongoHQ](https://plus.google.com/u/0/106648783195780211056/about) árakat. Ha MongoDB-t szeretnénk használni, akkor
az egyik lehetőség a [MongoHQ Add-on](https://addons.heroku.com/mongohq). Én speciel szeretem őket, mert eddig
bármilyen gondom is volt azonnal elérhetőek voltak Twitteren is és nagyon segítőkészek voltak. Tehát ott tartottunk,
hogy az árak. Amennyiben csak fejlesztéshez kell és még csak a tesztelés fázisában vagyunk, akkor van egy _Sandbox_
nevű csomaguk, ami ingyenes 50MB memóriával, 512MB adat tárolására alkalmas tárterülettel
_(és persze egy csomó mással, mint support)_.

{% pullquote %}
Ha az alkalmazásunk kinövi magát vagy kiélesítjük, akkor érdemes feljebb lépni mondjuk a `Small` csomagra, ami már
250MB memóriát jelent és 2GB tárterületet. Itt persze már képbe jön a pénz is, hiszen ez már havonta $15-ba kerül.
A már fent említett alkalmazásunk, ami eddig úgy tűnik $37.5-ba került gyorsan fel is kúszott $52.5-ra. Persze, ha
nem akarunk háttérfolyamatokat, akkor az nem kell és máris csak $15 az egész. A legjobb az egészben, hogy {"bármikor
állítható, hogy mikor mennyi Dyno-ra van szükségünk"} és az várható fizetendő összeget is folyamatosan láthatjuk.
{% endpullquote %}

### De miért jó nekünk, hogy van Európai szerver is?

Nem tudom ki hogyan van vele, de én elég gyakran csinálok olyan oldalakat, aminek a célközönsége Magyarország, vagy
Európa. Ebben az esetben elérésben lassabb egy US szerverről kiszolgálni ide a tartalmat, mint ha itt lenne Európában.
Hogy mennyire?

{% img center http://s3-dev.folyam.info/2013-04-25-heroku-megjott-europaba-is/speed.png Heroku speed EU vs. US %}

A mellékelt grafikonon jól látszik, hogy egy EU régiós látogatónak átlagosan 250ms/req a válaszideje, míg
egy EU régiós szerverről egy EU regiós látogatónak pusztán 100ms/req a "távolsága". Ha eddig nem foglalkoztál a
sebességoptimalizálással, akkor először is itt az ideje, másodszor pedig lehet kicsinek tűnik a különbség, de mégis
nagy, sőt hatalmas.

### Hozzunk létre EU régiós alkalmazást

Ez az egész folyamat ugyan úgy működik, mint ahogyan eddig is pusztán a `--region eu` paramétert kell még hozzácsapni.

```
$ heroku create --region eu
$ git push heroku master
```

Kicsit más a helyzet, ha a már meglévő alkalmazást szeretnénk mozgatni, mert akkor igénybe kell vennünk a szintén
nem túl régi funkciót, a [Heroku Fork](https://devcenter.heroku.com/articles/app-migration#fork-application)-ot.

```
$ heroku fork --region eu
Creating fork myapp-332... done
Copying slug... done
Adding newrelic:professional... done
Copying config vars... done
Fork complete, view it at http://myapp-332.herokuapp.com/
```

### Végeredmény

{% pullquote %}
Már nagyon régóta várok arra, hogy errefele mozduljanak, így most igencsak örül a szívem. Egyelőre béta fázisban van,
ami bár nem hinnem, hogy túl sok fennakadást okozna, mert annó a Cedar is jóideig az volt és semmi bajom nem volt vele,
de fő az óvatosság. Ami viszont ennél sokkal inkább fontosabb, hogy {" nem minden Add-on érhető még el. Jelenleg 71
látható az EU régiós appokhoz"}, ami picit több mint a fele az összesnek _(olyan ~120 körül van a teljes)_.
{% endpullquote %}

Használod a Heroku szolgáltatásait? Ha igen akkor milyen nyelvvel, mire és fogod-e használni az EU szervereket?
Ha pedig nem, akkor miért nem használod?

* _Forrás: [Heroku Blog: Introducing the Europe Region, Now Available in Public Beta](https://blog.heroku.com/archives/2013/4/24/europe-region)_
