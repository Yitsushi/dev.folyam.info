---
layout: post
title: "Google+ és Google API kapcsolat"
date: 2013-03-20 1:08
comments: true
categories: [google+, api, google, javascript, hogyan]
image: http://s3-dev.folyam.info/2013-03-20-google-plus-es-google-api-kapcsolat/sign-in-button.jpg
---

{% img left http://s3-dev.folyam.info/2013-03-20-google-plus-es-google-api-kapcsolat/sign-in-button.jpg Google+ Sign-In Button %}

Már egy ideje megjelent a [Google Login](https://developers.google.com/accounts/docs/GettingStarted)
mellett a [Google+ Sign In](https://developers.google.com/+/features/sign-in) is. Kicsit
meg is lepődtem, mert bár minden cégnek van valami jó kis autentikációs rendszere, amit
fel lehet használni azonosításra, de a legtöbb cég megmaradt, ahogy a Google is,
az [OpenID](https://developers.google.com/accounts/docs/OpenID)
vagy az [OAuth](https://developers.google.com/accounts/docs/OAuth2Login) mellett. A
[Twitter OAuth](https://dev.twitter.com/docs/auth/oauth/faq) rendszert használ, az
[Evernote](http://dev.evernote.com/start/core/authentication.php) szintén ezt az utat
választotta, de még az [Instagram is az OAuth](http://instagram.com/developer/authentication/)
mellett tette le a voksot. A Facebook mondjuk kilóg a sorból, hiszen ő a
[Graph API](https://developers.facebook.com/docs/reference/api/) fejlesztésébe fogott annó
és maradt is ezen a vonalon.

Persze most nem is ez a téma. A Google ahelyett, hogy szépen beillesztette volna a Google+
elérését a már meglévő azonosítási rendszerébe, úgy döntött, hogy csinál egy újat. Egészen
idáig a Facebook rendszerét szidtam, de azt hiszem eljött a pillanat, hogy az új
_Google+ Sign In_ szidhatóbb. Lényegében egy webes alkalmazás számára teljesen
értelmezhetetlen logikát követ. De először is nézzük meg, hogy eddig hogyan működött.

<!-- more -->

## A jól megszokott régi idők

Eddig ugyebár, mint említettem OAuth v2.0-t használt a Google az azonosításra a külső
fejlesztők számára biztosított API felületen. A legtöbb esetben ez úgy működött, hogy
a webes alkalmazás _(természetesen nem kívánom elemezni és bírálni az asztali réteget sem
és a mobilos alkalmazások területén való működését sem)_ átirányította a kedves felhasználót
a Google által biztosított jól megszokott bejelentkezési felületre, ahol engedélyt kért az
alkalmazásunk az előre meghatározott adatok eléréséhez. A felhasználó miután elfogadta
_(mivel mást úgy sem igazán tehet, ha használni akarja a szolgáltatásunkat)_ átkerül
egy olyan oldalra, amit szintén előre meghatároztunk, mint callback cím. Itt mi szépen
lekezeltük az adatokat, majd átirányítottuk a felhasználót oda, ahova mi szerettük volna.

## Mi a mostani logika?

Először is leszögezném, hogy szerény véleményem szerint a mobilpiacot kiszolgáló
alkalmazások területén biztosan nagyon jó logika, de weben nem. Most kirakunk egy gombot.
A gomb már önmagában indít egy validálási folyamatot, mivel amint lefut a hozzá kapcsolódó
behívott JavaScript kódsor, már fel is szól az oldalunk a Google szervereire és ő meghívja
nekünk a megadott callback függvényt.

Itt előre jelezném, hogy van benne egy pici hiba. Én előszeretettel "névterezem" a
függvényeimet, így nem meglepő módon egy `User.signInCallback` nevű
függvényt hoztam létre, ami történetesen nem jó, mert ha így adom meg akkor azt mondja,
hogy nem található a függvény. Megoldásként meghagytam a szép kis objektumomat és csináltam
egy `var __signinCallback = User.signinCallback` trükköt neki, amit már elfogadott. Nem
kevés idő ment el, mire rájöttem, hogy miért nem találja a függvényt.

Tehát miután meghívja a mi callback függvényünket, mi szépen kapunk egy objektumot
paraméterben, aminek van egy `code` és egy `access_token` kulcsa. Van még pár, de azokkal
nem kell foglalkozni. Itt persze egyből jön a szépség, mert ha van `code` kulcsa a
kapott objektumnak, akkor el kell rejteni a bejelentkező gombot. Ha jól megnézzük
valamelyik irányba mindenképpen "villogni" fog a gomb azokon az oldalakon, ahol már
megcsinálták az átállást. Vagy alapból el van rejtve és miután megkapjuk, hogy nincs
engedélyünk megjelenítjük, vagy alapból megjelenítjük és amint megkapjuk, hogy van
engedélyünk elrejtük. Tehát a callback valahogy így néz ki _(nem cifráztam az biztos)_:

``` javascript
var _signinCallback = function(result) {
  // Ha van code kulcsunk, akkor jók vagyunk
  if (result['code']) {
    // tehát elrejthetjük a bejelentkezéshez használt gombot.
    jQuery("#signinButton").hide();
    // elmenthetjük a teljes kapott objektumot
    authData = result;
    // majd egy külső függvényt hívva... nah itt jön majd a poén :)
    sendAuthStateToServer();
  } else {
    // Ha nincs, akkor biza semmi jogunk még semmihez
    // így el sem rejtjük a gombot, de ha mégis el lenne rejtve
    // akkor megjelenítjük
    jQuery("#signinButton").show();
    console.log('There was an error: ' + result['error']);
  }
}
```

Meg is jegyezném gyorsan, hogy az egész oldal nem használja a [jQuery](http://jquery.com/)
remek függvénykészletét, csak és kizárólag ez miatt raktam be, mert miután már csak a
függvény meghívásával _<del><small>elba</small></del>_ jó sok idő elment, úgy döntöttem
behívom, mert ki tudja mivel kerülök még szembe.

Ha nem futott le a kódunk első része, akkor biza még nincs jogunk. Itt kell a felhasználó,
aki majd szépen megnyomja az el nem rejtett gombot. Miután megnyomta kap egy ablakot,
ahol mindenféle jogok után érdeklődik a Google, hogy a kedves ügyfél azokat a részünkre
bocsájtja-e. Természetesen igent mond, mert hát használni szeretné az oldalt. Ekkor ugyan
ez a függvény hívódik meg, és most sikeresen lefut a kódunk első része, minek következtében
elrejtődik a bejelentkezési gomb.

Hoppá! Itt jön a vicces rész. Az alkalmazásunk kliens oldalon már tudja, hogy be van
jelentkezve a felhasználó, de legalábbis azt tudja, hogy van felhasználó. A szerver még
nem tud semmit, de honnan is tudhatna. Most a szépen lekérdezett adatokat át kell
juttatnunk a szerverre, de azzal se megyünk ám sokmindenre, mert emailcím, Google+ ID nem
jön, ahhoz külön kérés kell. Tehát miután megkaptuk a jelet, hogy van jogunk, szépen
lekérdezhetjük a felhasználó adatait, amikre amúgy vigyázni kell és a lehető legkevésbé
utaztatni 40x oda vissza. Ha ez is megvan akkor ezt el kell küldeni a szerveren lévő
háttérnek, hogy aztán ő is jól megkérdezze, hogy biztosan jók-e az adatok, mert a kliens
azt küld amit akar ugyebár.

``` javascript
var sendAuthStateToServer = function() {
  // most, hogy van jogunk kérdezzük le a Google+ API-t
  gapi.client.load('plus','v1', function() {
    // ha ez megvan, akkor a /me-t, mert legalább egy ID kell,
    // hogy a későbbiekben tudjuk: ez az a felhasználó, aki...
    var request = gapi.client.plus.people.get( {'userId' : 'me'} );
    request.execute( function(profile) {
      // ha visszakaptuk amit akartunk, akkor
      // elküldhetjük a szervernek, hogy ő is kérdezze meg ugyanezt
      jQuery.post(
        "/user/auth",
        {
          code: authData['code'],   // a kapott code, ami titkos
          state: authData['state'], // ez csak arra van, hogy
                                    // én előre definiáltam egy véletlenszerű
                                    // karakterláncot, ami végigmegy
                                    // mindenhol, hogy a session alapján
                                    // lássam tényleg az akinek mondja magát
          user_id: profile.id       // Elküldöm ezt is, mert ez hasznos
                                    // bár végük nem használtam fel,
                                    // mivel úgyis le kellett kérdeznem
                                    // szerver oldalon is
        },
        function(resp) {
          if (resp.error) {
            // ha hiba volt, akkor nem csinálok semmit
            // higgye a felhasználó azt, hogy minden rendben :)
            console.log(error);
          }
          // ha minden ok, akkor átirányítom a főoldalra
          window.location = "/";
        },
        "json"
      );
    });
  });
};
```

Ezek után mi akár el is menthetjük az aktuálisan átküldött Google+ ID-t, mint
felhasználó, aki bejelentkezett, de ki garantálja, hogy azok valós adatok-e? Senki. Tehát
most miután a szerver megkapta, amit akart... Végigmegyünk mégegyszer az egészen, ami
annyit jelent, hogy akkor most szépen használjuk a régi OAuth2-es rendszert
`https://www.googleapis.com/auth/plus.login` scope megadásával. Ha minden ok, akkor
jelezhetünk vissza a kliensnek, hogy minden ok.

## Miért kell ez a sok szívás és miért érdemes átállni mégis erre?

Két oka van. Az egyik vagányul néz ki, a másik pedig ütősen hangzik, de nem az. És persze
ott a bűvös harmadik is: _"Mert a főnök azt mondta."_

### Ütősen hangzik, de nem az

Ha így azonosítasz, akkor csinálhatsz
[Moments](https://developers.google.com/+/api/latest/moments) bejegyzéseket, vagyis
leegyszerűsítve már majdnem az, mint a Facebook. Csinálhatsz interaktív megosztást a
felhasználó folyamjára. Viszont nem ez a leglényegesebb, hanem a következő pont.

### Vagányul néz ki

Miután az alkalmazásod használja a Google+ Sign In rendszerét és össze is kötöd a
Google+ Oldaladat az alkalmazással, a Google API Console felületén, megjelenik egy új
menüpont a Google+ Oldalad adminisztrációs részén.

{% img center http://s3-dev.folyam.info/2013-03-20-google-plus-es-google-api-kapcsolat/connected-services.png Connected Services %}

Mi van itt? Láthatod, hogy mennyien jelentkeztek be a rendszeredbe az alkalmazásodon
keresztül és mennyi ebből az új.

{% img center http://s3-dev.folyam.info/2013-03-20-google-plus-es-google-api-kapcsolat/sign-in-activity.png Sign-In Activity %}

Továbbá az előbb említettem, hogy az interaktív posztoknak van azért előnye is. Itt láthatod,
hogy mennyi interaktív megosztás született, mennyien látták azokat és abból mennyi
átkattintás volt. No kérem ez viszont tényleg jól néz ki.

{% img center http://s3-dev.folyam.info/2013-03-20-google-plus-es-google-api-kapcsolat/interactive-posts.png Interactive Posts %}

Mivel a képen létható oldalnál még nincs semmi, amit interaktívan meg lehetne osztani
_(sőt semmilyen interaktivitás nincs rajta... egyelőre)_ így minden érték nullán áll ezen
a részen.

## Végeredmény

Végigszívhatod az egész napodat, hogy a marketingesek kérésére látható legyen az új
bejelentkezési lehetőség _(nah jó azért Node.js-ben csináltam és ott se volt szörnyen
hosszú, pedig oda nincs normálisan GoogleAPI lib)_. Ezen kívül pedig reménykedünk, hogy
a későbbiekben bekerül valami értelmes elérés is, hogy több mindenre lehessen használni.
És persze majdnem elfelejtettem még valamire felhívni a figyelmet. **A dokumentáció**
_(ahahahahha)_ **melletti példa kódok nem egészen jók.**

<del><small>A [PHP](https://developers.google.com/+/quickstart/php)-s speciel átad 2
értéket a szervernek JavaScript-ből, de mást használ már a PHP kódban. Kicsit rosszul esett,
hogy nem értem miért kellene működnie, majd még rosszabbul, amikor rájöttem, hogy ennek így
100%, hogy nem kellene, hogy működjön és valószínűleg copy-paste áldozata lett.</small></del>

<del><small>A [Ruby](https://developers.google.com/+/quickstart/ruby)-s verzióra vetettem
a szememet, miután ezzel szembekerültem és ott sem igazán úgy van használva, ahogyan kellene.
A _"dokumentáció"_ elején levő gyönyörű, ám annál kevésbé olvasható, rajzocskáján pedig
megint egy teljesen más logikát rajzol le.</small></del>

Ezek úgy tűnik már azóta javítva lettek.

Sok sikert :) Ha már szembe kerültél vele, akkor nyugodtan oszd meg velünk is
a tapasztalataidat és esetlegesen további ajánlásokat, tippeket. Vagy csak szimplán szólj
be, hogy hülyeséget írok.