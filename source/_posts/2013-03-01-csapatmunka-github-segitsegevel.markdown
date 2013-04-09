---
layout: post
title: "Csapatmunka Github segítségével"
date: 2013-03-01 09:07
comments: true
categories: [hogyan, github, csapatmunka]
image: http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-preview.jpg
---

{% img left http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-preview.jpg Github Csapatmunka %}

Ez a cikk eredetileg [+Sayanee Basu](https://plus.google.com/112065206911083904311)
(Twitter: [@sayanee_](https://twitter.com/sayanee_)) munkája, amit a
[@nettuts](https://twitter.com/nettuts) oldalon publikált
"[Team Collaboration With Github](http://net.tutsplus.com/articles/general/team-collaboration-with-github/)"
címen. Mivel úgy gondolom, hogy ez egy nagyon jól összeszedett cikk gyorsan engedélyt is
kértem a fordításra Twitteren, melyre gyors válasz érkezett. Így aztán nekiláttam a fordításnak.
Mivel a cikk sok olyan szót tartalmaz, amit nem lehet vagy legalábbis nincs értelme lefordítani,
így ha valahol olyan hibát találsz, ami ebből fakad, akkor kérlek írd meg, hogy mi az, hol van
és hogyan lenne jobb. _(természetesen minden más hibára is örülök, ha írsz)_

<div style="margin-left: auto; margin-right: auto; width: 70%">
<blockquote class="twitter-tweet">
  <p>@<a href="https://twitter.com/yitsushi">yitsushi</a>
  That would be awesome for our Hungarian pals :) what do u think
  @<a href="https://twitter.com/nettuts">nettuts</a>?</p>
  &mdash; Sayanee (@sayanee_)
  <a href="https://twitter.com/sayanee_/status/307294717161373697">March 1, 2013</a>
</blockquote>
</div>

## És itt kezdődik a cikk...

A [Github](http://github.com/) lett manapság az Open Source közösségek, alkalmazások
központja. A fejlesztők szeretik, itt dolgoznak együtt projektjeiken és jobbnál-jobb
dolgokat készítenek közösen. Azon kívül, hogy a kódbázis tárolására ad lehetőséget,
a Github az együttműködés terén kimagaslik bármilyen más hasonló szolgáltatás mellett.
Ebben a leírásban felfedezzük, hogy miként is lehet csapatban dolgozni a Github-on,
hogyan lehet hatékonyan és mindemellett fájdalommentesen használni és javunkra fordítani.

<!--more-->

## Szoftverfejlesztés közösen a Github-on

Ez a leírás azt veszi alapul, hogy a [Git](http://git-scm.com/) használatának már a
tudatában vagy. A Git egy teljesen nyílt forráskódú verziókövető rendszer, amit
[Linus Torvalds](http://en.wikipedia.org/wiki/Linus_Torvalds) csinált 2005-ben. Ha úgy
érzed, hogy utána kellene nézned, hogy mi is ez és hogyan működik, akkor nézd meg ezt a
[videóanyagot](https://tutsplus.com/course/git-essentials/) vagy nézz szét a
[nettuts oldalon további cikkekért](http://net.tutsplus.com/tag/git/). Ezen kívül azt is
feltételezi a cikk, hogy már van Github felhasználód és ismered az alapokat, mint például
a repo készítés és a változások követését is ismered a Github-on. Ha mégsem, akkor ajánlott
szétnézni [további hasznos cikkekért](http://net.tutsplus.com/tag/github/) az intereten.

Ha fejlesztőként dolgozol, akkor elkerülhetetlen, hogy találkozz olyan esettel, amikor
csapatban kell dolgoznod. Ebben a leírásban az kerül előtérbe, hogy miként lehet megoldani
a Github segítségével ezt, milyen eszközöket lehet hozzá használni, hogy még könnyebb és
hatékonyabb tudjon lenni a csapatban való fejlesztés. Amik érintve lesznek:

1. **Csapattag hozzáadása** – Szervezet és Együttműködők
2. **Pull Requests** – Beküldés és Beolvasztás
3. **Bug Tracking** – Github Issues (Github hibakövető)
4. **Analitika** – Grafikonok és Hálózatok
5. **Project Management** – [Trello](https://trello.com/) és [Pivotal Tracker](https://www.pivotaltracker.com/)
6. **Continuous Integration** – [Travis CI](https://travis-ci.org/)
7. **Code Review** – Megjegyzések adott sorokhoz és URL képzés
8. **Dokumentáció** – Wiki és [Hubot](http://hubot.github.com/)

## Jobban szereted Screencast-okat?

Ha jobban szereted videó formájában nézni a dolgokat és úgy látni működés közben, akkor
nézd meg nézd meg ezt: (angol nyelvű)

{% youtube http://www.youtube.com/embed/61WbzS9XMwk %}

## Csapattag hozzáadása

Alapértelmezetten két lehetőség van csapatban dolgozni Github-on:

1. **Szervezet** – Egy Szervezet tulajdonosa létrehozhat csapatokat különböző jogokkal és
repókkal.
2. **Együttműködés** – A repó tulajdonosa hozzáadhat bárkit írási és olvasási joggal a saját
repójához

### Szervezet

Ha több csapatod van, és szeretnél minden csapatnak illetve a csapat tagjainak is külön állítani
hozzáférési szinteket, akkor a legjobb választás, ha csinálsz egy Szervezetet _(Organization)_.
Minden Github felhasználó ingyenesen létrehozhat szervezetet Open Source projekteknek.
Ha létre szeretnél hozni egyet, akkor csak menj a
[saját szervezetek beállításaihoz](https://github.com/settings/organizations).

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-create-org.png Github szervezet %}

A csapatok oldalát egyszerűen el lehet érni a `http://github.com/organizations/[organization-name]/teams`
címen, ha pedig újat szeretnél létrehozni, akkor azt megteheted a
`https://github.com/organizations/[organization-name]/teams/new` oldalon. Minden tagnak
három lehetséges jogot lehet beállítani:

1. **Pull Only:** [Leszedheti a forrást és beolvaszthatja](http://www.kernel.org/pub/software/scm/git/docs/git-pull.html)
egy másik repóba vagy készíthet belőle lokális másolatot. Ez tulajdonképpen a Csak olvasható mód.
2. **Push and Pull:** (1) + [Frissítheti](http://www.kernel.org/pub/software/scm/git/docs/git-push.html)
a szerveren lévő repót. Írási/Olvasási jog.
3. **Push, Pull & Administrative:** (1) és (2) + hozzáfér a számlázási adatokhoz, létrehozhat
új csapatokat, de akár törölheti is a szervezetet. Olvasás + Írás + Adminisztrációs jogok.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-create-team.png Három jogosultsági szint %}

### Együttműködő (partner)

Ha van egy személyes repód, akkor bárkinek adhatsz **írási és olvasási jogokat** a te saját
felhasználóddal. Ha szeretnél hozzáadni valakit egy projektedhez, akkor látogass el a
`https://github.com/[username]/[repo-name]/settings/collaboration` oldalra:

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-collaborator.png Csapattársak %}

Ha hozzáadtunk valakit, akkor láthatja az írható hozzáférési címet is a repóhoz. Ha
valakinek van írási joga, akkor tud `git clone` parancs kiadása után dolgozni a projekten
és a módosításait egyszerűen `git push`-al felküldeni a Github-ra.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-access.png Github jogosultságok %}

## Pull Requests

{% include post/adsense_right.html %}

A [Pull Request](https://help.github.com/articles/using-pull-requests) egy nagyon jó lehetőség
arra, hogy saját ágat létrehozva _(fork)_ függetlenül módosíts a kódon. A nap végén, ha akarod,
akkor fel tudod küldeni a módosításokat a saját repódba és küldhetsz egy Pull Request-et a projekt
eredeti tulajdonosának a módosításaidról. A módosítási listáról ezután elindulhat egy
beszélgetés, hogy kell-e, milyen a minősége és bekerülhet-e az eredeti kódbázisba.

Nézzük hogyan is működik a [Pull Request](https://help.github.com/articles/using-pull-requests).

### Pull Request kezdeményezése

[Két típusa van a Pull Requesteknek](https://help.github.com/articles/using-pull-requests)
Github-on:

1. **Fork & Pull Model** – Publikus repóknál használatos, ahol nincs írási jogod.
2. **Share Repository Model** – Privát repóknál használatod, ahol van írási jogod.
Ilyen esetben nem szükséges Fork-olni.

Most nézzük a folyamatot két résztvevő esetén (`repo-owner` and `forked-repo-owner`),
hogy lássuk a `Fork & Pull Model` működését:

* Keressük meg a Github repót, amin szeretnénk dolgozni. Kattintsunk a "Fork" gombra:

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-fork.png Fork %}

* Ez létrehoz egy teljes másolatot a saját felhasználónk alá:

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-forked.png Forkolt%}

* [Válasszuk ki az SSH URL-t](https://help.github.com/articles/why-is-git-always-asking-for-my-password),
így az SSH kulcshoz tartozó jelszót fogja kérni _(és nem a Github felhasználónevet és
jelszót)_ minden alkalommal, amikor a `git push` vagy `git pull` parancsot adjunk ki.
Most leszedhetjük a saját gépünkre a kódot:

```
$ git clone [ssh-url] [folder-name]
$ cd [folder-name]
```

* Általánosságban egy új funkció fejlesztéséhez csinálni szoktunk egy új ágat _(branch)_.
Ez egy jó gyakorlat, mert megmarad a `master` águnk és így könnyen tudjuk frissíteni az
alapján a fejlesztésünket. Így a [pull request-ünket a rendszer automatikusan tudja majd
frissíteni](http://stackoverflow.com/questions/9790448/how-to-update-a-pull-request).
Tehát most csináljunk egy új ágat és módosítsuk a `readme.md` fájlt:

```
$ git checkout -b [new-feature]
```

* Miután sikeresen befejeztük a módosításokat simán hozzáadjuk a repóhoz a módosításainkat.
Majd visszaállunk a `master` ágra:

```
$ git add .
$ git commit -m "information added in readme"
$ git checkout master
```

* Ezen a ponton fel tudjuk küldeni a Github-ra a `readme` águnkat, ami ugyebár most csak
lokálisan van meg. Ez a `git push [git-remote-alias] [branch-name]` parancssal tehetjük meg:

```
$ git branch
* master
readme
$ git remote -v
origin  git@github.com:[forked-repo-owner-username]/[repo-name].git (fetch)
origin  git@github.com:[forked-repo-owner-username]/[repo-name].git (push)
$ git push origin readme
```

* A saját forkolt repónknál kiválasztjuk a frissen felküldött ágat és megnyomjuk a "Pull Request"
gombot.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-pull-request.png Github Pull Request %}

* Miután beküldtük a kérelmünket, megjelenünk az eredeti repó "pull requests" oldalán.
Megjelenik mint "pull request" és mint "issue".

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-pull-request-sent.png Github Pull Request: 1 commit %}

* A változásokkal kapcsolatban történő beszélgetés végén kiderült, hogy bekerül az eredeti
repóba mint újdonság vagy nem.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-pull-request-2.png Github Pull Request: 2 commit %}

### Pull Request beolvasztása

Mi van akkor, ha te vagy a repó tulajdonosa?
[Két lehetőség van beolvasztani](https://help.github.com/articles/merging-a-pull-request)
a beérkező módosításokat:

* **Beolvasztás Github-on:** Ha Github-on szeretnénk beolvasztani, akkor előtte
meg kell bizonyosodni róla, hogy nincs semmilyen akadály. Tehát nincs `conflict` és készen
áll az egybeolvasztásra. Csak egyszerűen rá kell kattintani a "Merge Pull Request" gombra:

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-merge.png Github Merge %}

* **Beolvasztás lokális gépen:** Amennyiben vannak problémák a beolvasztással, ay "info"
gomb megnyomására kiírja a Github, hogy pontosan hogyan lehet megoldani a beolvasztást
lokális gépen.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-merge-conflict.png Github Merge Conflict %}

Különböző modellek vannak az elágazások kezelésére (branching). Két legelterjedtebb a (1)
[Github folyamat](http://scottchacon.com/2011/08/31/github-flow.html), ami egyszerűen új
ágak létrehozásával és Pull kérelmekkel dolgozik és a (2)
[Gitflow](http://nvie.com/posts/a-successful-git-branching-model/) ami sokkal kiterjedtebb
metódust használ. Az, hogy melyiket használja egy csapat az elsősorban rajtuk múlik illetve
az adott projekten.

## Hibakövetés

Github-on a hibakezelés központja az "Issues" fül alatt található. Annak ellenére, hogy
a problémák nevet viseli, három különböző típus van:

* **Hibák:** Hibák, amiket javítani kell
* **Újdonság:** Új ötletek, amiket implementálni kell
* **Feladatlista:** Lista azokról, amiket meg kell csinálni

Nézzük meg, hogy mit lehet csinálni velük:

{% include post/adsense_right.html %}

* **Címkézni:** Minden bejegyzéshez hozzá lehet társítani egy kategóriát/címkét.
Mindegyiknek van saját színe. Velük egyszerűen lehet szűrni a listában.
* **Mérföldköveket beütemezni:** Ezek olyan kategóriák, amiknek van egy dátuma. Azok a jegyek tartoznak
egy mérföldkő alá, amik jó lenne, ha készen lenne a következő verzióban (releaseben).
Mivel a mérföldkövek össze vannak kötve a jegyekkel, automatikusan frissül az állapotjelző,
ahogyan lezárunk egy jegyet.
* **Keresni:** A kereső automatikus kiegészítéssel segít megtalálni a nekünk az éppen keresett
mérföldkövet vagy jegyet.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-issue.png Hibakezelés %}

* **Hozzá lehet rendelni valakihez:** Minden jegy hozzárendelhető egy emberhez, így lehet
látni, hogy kinek mit kellene csinálnia, ki foglalkozik az üggyel és kit kell keresni, ha
kérdés van vele kapcsolatban.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-issue-new.png Uj hiba felvitele %}

* **Automatikusan lezárhatóak:** Ha egy commit tartalmazza a `Fixes/Fixed` vagy
`Close/Closes/Closed #[issue-number]` formát, akkor az `issue-number` azonosítójú jegy
automatikusan lezárt állapotba kerül.

```
$ git add .
$ git commit -m "corrected url. fixes #2"
$ git push origin master
```

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-close.png Hiba automatikus lezárása %}

* **Lehet említeni:** Bárhol létrehozható olyan megjegyzés, ami az adott jegyre mutat, ha
használjuk a `#[issue-number]` formulát. Az ilyen karakterláncokból linket készít a rendszer,
így gyorsan oda lehet jutni hozzájuk.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-mention.png Hiba megjelölése commit-ban %}

## Analitika

Két eszköz van, amit a rendszer nyújt – `Graphs` és `Network`. A
[Github Graphs](https://github.com/blog/1093-introducing-the-new-github-graphs)
egy áttekintést ad az együttműködők munkájáról és a commit-okról. A
[Github Network](https://github.com/blog/39-say-hello-to-the-network-graph-visualizer) pedig
vizuálisan jeleníti meg az adott projekt forkjait és a hozzájuk tartozó commit-okat.
Ezek nagyon hasznosak, ha át szeretnénk látni, hogy mi hogy áll.

### Graphs

A Graphs ezeket mutatja be:

* **Contributors:** Kik voltak akik dolgoztak rajta? Mennyi sort adtak hozzá vagy épp
töröltek.
* **Commit Activity:** Melyik héten voltak commit-ok az elmúlt egy évben?
* **Code Frequency:** Hány sor lett commit-olva a projekt élete során?
* **Punchcard:** Mely napokon és milyen időszakban milyen aktivitás van?

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-graphs.png Github grafikonok %}

### Network

A [Github Network](https://github.com/blog/39-say-hello-to-the-network-graph-visualizer)
is egy nagyon hasznos segítség, mert lehet rajta látni, hogy hol milyen ágak vannak. Ki hol
tart, hol lettek összeolvasztva az ágak és ki honnan dolgozik, melyik ágból csinált magnának
másolatot és hol szállt be. Minden ág, minden commit-ja  látható rajta.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-network.png Branch és Fork hálózat %}

## Project Management

Bár a `Github Issues` segítségével lehet a jegyek és mérföldkövek segítségével vezetni
egy projektet, sok csapat más eszközöket használ és preferál erre a célra. Ebben a részben
megnézünk két olyan népszerű projektvezetési eszközt, ami teljes mértékben együtt tud
dolgozni a Github-bal. Az első a [Trello](https://trello.com/), a második a
[Pivotal Tracker](https://www.pivotaltracker.com/). A Github hook-oknak köszönhetően
automatikusan frissülhetnek a feladatok, és a választott rendszerben látható lesz az aktivitás.
Nem pusztán azért jó, mert frissíti a jegyek állapotát, hanem ténylegesen segíteni és
gyorsítani tudja a csapat munkáját.

### Github és Trello

A Trello egyszerűen vizualizálja a feladatokat.
Az [agilis szoftverfejlesztés](http://en.wikipedia.org/wiki/Agile_software_development)
metodikáját követi és kártyákként egy [Kanban táblát](http://en.wikipedia.org/wiki/Kanban_board)
varázsol elénk. Github összekötéssel például egyszerűen és automatikusan létre tudunk
hozatni egy új kártyát, ha Pull Request érkezik. Nézzük hogyan!

* Csináljunk egy Trello felhasználót, ha még nincs és hozzunk létre egy új táblát.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-trello.png Github + Trello %}

* Menjünk be Github-on a repónkhoz, ott `Settings` > `Service Hooks`, és válasszuk ki a Trello-t.
* `TOKEN` kérhető az `Install Notes` alatti linken.
* Az `Install Notes` második pontja alatt van egy link, amibe behelyettesítve a frissen
szerzett `TOKEN`-t kapunk egy `json` formátumú tartalmat. Ez megadja a listaazonosítót
minden kártyához. A `BOARDID` pedig beszerezhető, ha ellátogatunk az oldalra az adott
táblához, fent az URL-ből, ami így néz ki: `https://trello.com/board/[BOARD-NAME]/[BOARDID]`.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-listid.png Trello list_id %}

* Vissza a Github hook-okhoz, töltsük ki a `list id` és a `token` mezőket.
Állítsuk be, hogy az állapota `Active` legyen, majd nyomjunk egy `Test Hook` gombot, hogy
lássuk működik-e.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-hook-trello-hooks.png Github hook beállítása Trello kapcsolathoz %}

* Mostantól automatikusan létrejön egy kártya, ha Pull kérelem jön.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-trello-update.png Automatikus frissítés %}

### Github és Pivotal Tracker

A [Pivotal Tracker](http://www.pivotaltracker.com/) egy másik egyszerű agilis PM eszköz,
ami `story-based` tervezést ad, amivel a csapat gyorsan tud reagálni a változásokra és a
projekt állapotára. A csapat állapota alapján mutatja a projektet, készít grafikonokat és
elemzi a csapat sebességét, iterációs burn-up, release burn-down és egyéb grafikonokkal
segíti a munkát és a tervezést. Ebben a rövid példában beállítjuk, hogy automatikusan
`deliver` státuszt kapjon egy sztori Github commit alapján.

* Csináljunk egy új projektet a Pivotal Tracker-en egy új Sztorival, amit meg kellene
csinálni.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-pivotal.png Github + Pivotal Tracker %}

* navigáljunk el a `Profile` > `API Token` (jobboldalt lent) oldalra. Másoljuk ki a kapott
API tokent.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-tracker-token.png Token %}

* Menjünk vissza a Github repóhoz, majd `Settings` > `Service Hooks` és keressük ki a
`Pivotal Tracker`-t. Másoljuk be a kapott tokent, állítsuk be, hogy aktív legyen és
kattintsunk az `Update settings` gombra. Mostantól össze van kötve a kettő.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-tracker-hook.png Github hook beállítása Pivotal Tracker-hez %}

* Végül csináljunk egy commit-ot úgy, hogy [a `tracker_id` is benne legyen](http://pivotallabs.com/level-up-your-development-workflow-with-github-pivotal-tracker/) a `git commit -m "message [delivers #tracker_id]"` formában.

```
$ git add .
$ git commit -m "Github and Pivotal Tracker hooks implemented [delivers #43903595]"
$ git push
```

* Most, ha visszamegyünk a Pivotal Tracker-re, akkor láthatjuk, hogy át lett állítva a
státusza és bekerült egy link, amit a Github commit-ra visz minket, ahol láthatjuk a
változásokat is.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-tracker-deliver.png Github commit a Pivotal Tracker-ben %}

Ezekben a példákban a Trello és Pivotal Tracker segítségével látható, hogy nagyon jól
összeköthetőek a rendszerek és nagy segítség tud lenni. Sok időt meg tud spórolni már csak
ott is, hogy ad egy linket az adott feladathoz tartozó commit-okra. Jó hír az is, hogy sok
más eszközhöz van már kapcsolat, mint például [Asana](http://asana.com/) vagy
[Basecamp](http://basecamp.com/). Ha ahhoz nincs amit ti használtok, akkor
[létre tudsz te is hozni egyet](https://github.com/github/github-services).

## Continuous Integration

{% include post/adsense_right.html %}

[Continuous Integration](http://en.wikipedia.org/wiki/Continuous_integration) (CI) egy
nagyon fontos része a szoftverfejlesztésnek, de legfőképpen akkor, ha többen dolgoznak
egy projekten. CI segít abban, hogy a hibák korábban kiderüljenek. Nem csak automatikusan
lefordítja a projektet, de a teszteket is lefuttatja, így ha azokból bármi hibát jelez, akkor
a kód hibás és nem szabad beolvasztani, de legfőképpen nem szabad kiélesíteni. Ebben a
példában [Travis CI](https://travis-ci.org/)-t fogunk használni, hogy látható legyen
Github-on, lehet-e beolvasztani avagy sem.

### Travis CI beállítása

Egy egyszerű `hello-world` alkalmazáson nézzük meg a működését, ami [node.js](http://nodejs.org/)-re
épül és [grunt.js](http://gruntjs.com/)-t használ, amit a tesztek futtatására használunk.
Pár fájl tartozik csak a projektünkhoz:

* A fő fájl a `hello.js` és ez a Node.js projektünk. Szándékosan lehagyunk egy pontosvesszőt,
hogy elhasaljon:

``` javascript hello.js
var http = require('http');
http.createServer(function (req, res) {
res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World in Node!\n') // without semicolon, this will not pass linting
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
```

* `package.json` megadja a függőségeket _(és egyéb tulajdonságokat)_:

``` json package.json
{
  "name": "hello-team",
  "description": "A demo for github and travis ci for team collaboration",
  "author": "name <email@email.com>",
  "version": "0.0.1",
  "devDependencies": {
    "grunt": "~0.3.17"
  },
  "scripts": {
    "test": "grunt travis --verbose"
  }
}
```

* A `gruntjs` egyetlen feladattal bír, ami jelenleg a `linting` (az egyszerűség kedvéért):

``` javascript
module.exports = function(grunt) {
    grunt.initConfig({
     lint: {
      files: ['hello.js']
    }
  });
  grunt.registerTask('default', 'lint');
  grunt.registerTask('travis', 'lint');
};
```

* `.travis.yml` fájl tartalmazza a Travis CI beállításokat, hogy tudja a rendszer miként
kell futtatni a tesztünket:

``` yaml .travis.yml
language: node_js
node_js:
  - 0.8
```

* Most jelentkezzünk be a Travis-ba a Github felhasználónkkal és kapcsoljuk be a repó hook-ot
a `repositories` fülön.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-travis-on.png Github + Travis CI %}

* Ha nem indul el a teszt, akkor manuálisan kell beállítani. A profil fülön másoljuk ki
a token-ünket.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-travis-token.png Travic CI token %}

* Menjünk vissza Github-ra és aktiváljuk a Travis hook-ot bemásolva az imént megszerzett
token-t.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-travis-hook.png Github hook beállítása Travis CI kapcsolathoz %}

* Első alkalommal egy `git push` kell, hogy elinduljon a folyamat. Ha minden rendben volt,
akkor látogassunk el a `http://travis-ci.org/[username]/[repo-name]` oldalra, hogy
lássuk a végeredményt.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-travis-pass.png Travis CI eredmények %}

### Travis CI + Pull Requests

Korábban, amikor még nem volt a CI a Pull kérelmek elbírálásának folyamatában, akkor úgy
ment az egész, hogy Pull Request, beolvasztás, aztán tesztelés, és ha nem volt jó, akkor
visszaállítás. A Travis CI-nek köszönhetően a második és harmadik lépés felcserélődött, így
gyorsabban kiderül, ha valami nem jó, és így könnyebb eldönteni, hogy lehet-e beolvasztani.
Nézzük is meg, hogy miként megy a folyamat.

* Küldünk egy Pull Request-et és hagyjuk, hogy a Travis megmondja, működik-e vagy sem.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-pull-pass.png Github Pull Request-ben látszódó Travis CI eredmények %}

* Ha a módosításokkal hibásak a tesztek, akkor a Travis szól nekünk erről.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-pull-fail.png Ha hiba van a Pull Request-ben, akkor az látszik %}

* Ha a piros figyelmeztető gombra kattintunk, akkor az elnavigál minket a Travis oldalára,
hogy lássuk, mi nem jó.

A Travis CI és a Github kiemelten hasznos a csapat számára, mert automatikusan lefuttatja a
teszteket és értesítést küld az eredményről. Így sokkal gyorsabban javításra kerülhetnek
azok a hibák, amik lehet, csak később kerülnének napvilágra. Ha más eszközt használsz, mint
mondjuk a Jenkins-t, akkor van lehetőség arra is, hogy egyszerűen együtt használd őket.

## Code Review

A Github minden commit-hoz lehetőséget ad egy letisztult és egyszerű felületen, hogy
megjegyzéseket fűzzünk egy adott módosítás adott sorához vagy az egész commit-hoz. Ez egy
remek lehetőség, hogy sorról-sorra átnézhessük a változásokat, azokat átbeszéljük, vagy épp
csak rámutassunk egy hibára, hibalehetőségre, jelezzük, hogy az adott kódolási stílus
nem helyes adott projekten. A sorokhoz fűzött megjegyzéseket el lehet rejteni és meg lehet
jeleníteni minden commit-nál a jobb felső sarokban lévő checkbox-al.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-inline.png Github commit adott sorához is hozzá lehet fűzni megjegyzést %}

Nézzünk pár olyan URL mintát, ami segítheti a munkánkat. Először is, hogyan lehet
lekérdezni két commit közötti különbséget?

* **Összehasonlítás ágak, címkék és SHA1-ek között** : Az URL így néz ki egy összehasonlításra:
`https://github.com/[username]/[repo-name]/compare/[starting-SHA1]...[ending-SHA1]`.
Hasonlóan működik ágakra _(branches)_ és címkékre _(tags)_ is.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-url.png Commit-ok összehasonlítása %}

* **Összehasonlítás felesleges szóközök nélkül** : Add hozzá az URL-hez a `?w=1` paramétert

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-whitespace.png Felesleges space-ek nélkül is megtekinthetőek a változások %}

3. **Diff** : add hozzá a `.diff` kiterjesztést, hogy megkapd azt a formát, amit egy `git diff`
is eredményezne. Hasznos lehet akkor, ha scriptelni szeretnéd a kimenetet.
4. **Patch** : add hozzá a `.patch` kiterjesztést, hogy úgy lásd mintha egy `git format-patch`
kimenete lenne
_([formázott patch email küldéshez](http://www.kernel.org/pub/software/scm/git/docs/git-format-patch.html))_.
5. **Sorra hivatkozás** : Ha rákattintasz egy sor számára, a Github hozzáfűzi az adott
sorszámot `#line` formában az URL végéhez így, ha valaki megnyitja a linket, akkor az adott
sor háttere sárga lesz. Így pontosan rá lehet mutatni egy linkkel egy adott sorra.
Ez a forma ugyan úgy elfogad tartományt is a `#start-end` formában. Itt egy példa a
[sorra hivatkozáshoz](https://github.com/NETTUTS/team-collaboration-github/blob/master/.travis.yml#L4)
és egy a [tartományra](https://github.com/NETTUTS/team-collaboration-github/blob/master/.travis.yml#L2-3).

## Dokumentálás

Ebben a fejezetben megnézünk két dokumentálási lehetőséget:

1. **Hivatalos dokumentáció:** A forráskód dokumentálására van a Github Wiki
2. **Nem hivatalos dokumentáció:** [Github Hubot](https://github.com/github/hubot)
segítségével dokumentálható a beszélgetés a csapattagok között és automatizálható az
információáramlás egy vicces boton keresztül.
3. **Megemlítés, gyorsbillentyűk és hangulatjelek**

### Github Wiki

A Github Wiki létrejön minden repóval és így egy helyen tud lenni a dokumentáció és a forráskód.
Hogy létrehozz egy Wiki-t, szinte semmit se kell tenni, csak engedélyezni a beállításoknál.
A Wiki-nek saját verziókövetése van és azt le lehet klónozni lokális gépre, akár csak magát
a projekt repóját.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-wiki.png Github Wiki %}

Egy nagyon haszos dolog, ha például `submodule`-ként hozzáadjuk a Github Wiki-t a forráskódhoz,
így nem kell két repót karbantartani és nincs elszeparálva a kettő. Ahhoz, hogy ezt megtegyük,
adjuk hozzá a Wikit mint [submodule](http://git-scm.com/book/ch6-6.html). Természetesen
ha használunk Travis CI-t, akkor meg kell neki mondani, hogy azt
[ne nézze, mert felesleges](https://github.com/travis-ci/travis-build/pull/46).
Ezt egyszerűen megtehetjük, csak hozzá kell adni a `.travis.yml` fájlhoz pár sort:

``` yaml .travis.yml
git:
  submodules: false
```

Ezek után hozzáadhatjuk a Wiki repóját, mint submodule:

```
$ git submodule add git@github.com:[username]/[repo-name].wiki.git
Cloning into 'hello-team.wiki'...
remote: Counting objects: 6, done.
remote: Compressing objects: 100% (3/3), done.
remote: Total 6 (delta 0), reused 0 (delta 0)
Receiving objects: 100% (6/6), done.
$ git add .
$ git commit -m "added wiki as submodule"
$ git push origin master
```

Innentől kezdve a dokumentáció ott van a forrás mellett, mint submodule.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-submodule.png Github Wiki mint Submodule %}

### Github Hubot

[Hubot](https://github.com/github/hubot) egy egyszerű csevegőbot, ami információkat fogad
vagy küld szét értesítésként, ha össze van kötve a Github commit-okkal, kommentekkel,
hibalistával és egyéb aktivitással. Egy csapatban, ahol szeretnénk lecsökkenteni a szükséges
meetingeket _(vagy akár teljesen ki is iktathatjuk)_, ott Hubot egy remek társ lesz. Minden
egyes beszélgetést rögzít, így még inkább segíti a munkát akkor is, ha a csapattagok nem
egy időben dolgoznak és írják le gondolataikat, kérdéseiket.

**Vigyázat:** Hubot függőséget okoz!

Kezdjük ott, hogy beállítjuk Hubot-unkat egy szerveren. Jelen esetben ez a
[Heroku](http://www.heroku.com/) lesz és a [Campfire](http://campfirenow.com/) mint felület,
ahol a kommunikáció folyni fog. Azért is ezt a kettőt választottuk, mert mindkettő ad
lehetőséget ingyenes használatra.

* Most a [Hubot Github-os Campfire verzióját](https://github.com/github/hubot) fogjuk
használni. Ha gondolod, nézd meg milyen,
[más lehetőségek vannak már készen](https://github.com/github/hubot/wiki), mint Skype, IRC,
Gtalk stb.
* Csináljunk egy új Campfire fiókot, ami csak a Hubot-é, és ez a felhasználó létre fog hozni
egy új csevegőszobát, ahova mindenki meg lesz hívva később.
* Telepítsük fel Hubot-ot Heroku-ra a
[leírtak szerint](https://github.com/github/hubot/wiki/Deploying-Hubot-onto-Heroku).
Ne problémázz azon, ha azt mondja az alkalmazás, hogy `Cannot GET /`, mert
[tényleg nincs ott semmi](https://github.com/github/hubot/issues/286) alapértelmezetten.
* A Hubot Campfire fiókjából hívjuk meg magunkat. Most jelentkezzünk be a saját fiókunkba,
és írjuk be, hogy `Hubot help`. Hubot szépen le fogja írni, hogy milyen parancsok vannak.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-hubot.png Hubot help parancs, ami segít megtudni, hogy mit tudsz még csinálni %}

* Ki is próbálhatsz párat, mint például `hubot ship it` vagy a `hubot map me CERN`.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-hubot-commands.png Hubot parancsok %}

* Következőnek, hozzá kell adnunk egy Hubot script-et.
[Bőven van miből válogatni](https://github.com/github/hubot-scripts/tree/master/src/scripts)
ha szeretnénk látni, mi mit csinál, akkor még
[illusztrációkat is találunk](http://hubot-script-catalog.herokuapp.com/).
* Mi most csak a
[github-commits](https://github.com/github/hubot-scripts/blob/master/src/scripts/github-commits.coffee)
script-et pakoljuk be, így minden egyes commit-nál értesíteni fog minket róla a
csevegőszobában. Egyszerűen helyezzük a `github-commits.coffee` fájlt a `scripts`
könyvtárba.
* Frissítsük a `package.json` fájlt a szükséges függőségekkel, ahogyan le van írva minden
script első soraiban, a kommentek alatt.
* Élesítsük ki a változásokat egy `git add package.json scripts/github-commits.coffee` és
egy `git push heroku master` paranccsal.
* Navigáljunk el a repónkhoz, ahonnan szeretnénk, hogy értesítés érkezzen a commit-okról.
Adjunk hozzá egy új `web hook`-ot és állítsuk be a
`[HUBOT_URL]:[PORT]/hubot/gh-commits?room=[ROOM_ID]` címre, ahogyan a script is elmondja
nekünk a fájl elején.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-hubot-hook.png Github hook beállítása Hubot kapcsolathoz %}

* Mostantól minden egyes commitról Hubot szólni fog a csevegőszobában.

{% img center http://s3-dev.folyam.info/2013-03-01-csapatmunka-github-segitsegevel/github-team-hubot-ghcommit.png Github Commit megjelenik Hubot-nak köszönhetően %}

Nézz szét további [Github specifikus Hubot scriptek után](https://github.com/github/hubot-scripts)
vagy ha gondolod, írj sajátot, amihez találhatsz
[nagyon jó leírásokat](http://net.tutsplus.com/tutorials/javascript-ajax/writing-hubot-plugins-with-coffeescript/).
Hubot iszonyatosan fel tudja dobni a szürkének ható beszélgetéseket, commit-értesítéseket
és úgy az egész dokumentálási folyamatot. Adj neki egy esélyt!

Végezetül pedig itt van pár olyan lehetőség, ami még segíthet:

1. **Említések** – Bármilyen felületen, ahol szövegdoboz van, említhetünk másokat a kukac
karakterrel, `@user` formában és erről a felhasználó kap értesítést.
2. **Gyorsbillentyűk** – A `[shift] + ?` megnyomásával bármelyik Github oldalon megnézhetjük, hogy
milyen gyorsbillentyűk vannak.
3. **Hangulatjelek** – Az [Emoji cheat sheet](http://www.emoji-cheat-sheet.com/)-et használva,
a Github szövegdobozoknál támogatott a hangulatjelek beszúrása. Ezzel lehet egy kis színt
vinni a csapatmunkába.

## Nem szoftveres együttműködés Github-on

A legtöbben a Github-ra, mint szoftverfejlesztő eszközre gondolnak. Természetesen a Github
erre is lett kitalálva. _Közösségi kódolásra_. De van jópár olyan repó, ami nem programozói,
viszont ugyanúgy a csapatmunka miatt választották a Github-ot. Ezek a projektek ugyanúgy
nyílt forrásúak és bárki dolgozhat rajtuk, így könnyű javítani a hibákat benne, illetve
jelenteni, ha talál valaki egyet. Itt van pár érdekes repó, amikre ránézhetsz:

* **Háztáji barkácsolás:** [Hibakezelő, mint feladatlista](https://github.com/frabcus/house/issues?labels=building&state=open)
* **Könyvek:** [Little MongoDB Book](https://github.com/karlseguin/the-little-mongodb-book), [Backbone Fundamentals](https://github.com/addyosmani/backbone-fundamentals)
* **Dalszövegek:** [JSConfEU Lyrics](https://github.com/mandylauderdale/2012-JSConfEU-Lyrics)
* **Találj barátot:** [boyfriend_require](https://github.com/norinori2222/boyfriend_require/blob/master/README-en.md)
* **Mentorálás:** [Wiki](https://github.com/dianakimball/mentoring)
* **Genomic Data:** [Ash Dieback epidemic](https://github.com/ash-dieback-crowdsource/data)
* **Blogok:** [CSS Wizardry](https://github.com/csswizardry/csswizardry.github.com)

{% blockquote Github Team http://news.ycombinator.com/item?id=4963433 news.ycombinator.com %}
  We dig fun uses of GitHub like this
{% endblockquote %}

## További olvasmányok

* [Social Coding in GitHub](http://www.cs.cmu.edu/~xia/resources/Documents/cscw2012_Github-paper-FinalVersion-1.pdf), a research paper by Carnegie Melon University
* [How Github uses Github to build Github](http://zachholman.com/talk/how-github-uses-github-to-build-github/) by Zac Holman
* [Git and Github Secrets](http://zachholman.com/talk/git-github-secrets/) by Zac Holman
* [New features in Github](https://github.com/blog/category/ship) from the Github Blog
* Github Help: [pull requests](https://help.github.com/articles/using-pull-requests), [Fork a Repo](https://help.github.com/articles/fork-a-repo)
* [Github features for collaboration](https://github.com/features/projects)
* Nettuts+ Tutorials: [Git](http://net.tutsplus.com/tag/git/) and [Github](http://net.tutsplus.com/tag/github/)
* [Lord of the Files: How Github Tamed free Software (and more)](http://www.wired.com/wiredenterprise/2012/02/github/) by Wired

## Legyen szórakozás a csapatmunka!

Ez csak egy _kis_ ízelítő volt abból, hogy milyen jól lehet használni csapatban a Github-ot.
Rengeteg eszköz áll rendelkezésre, amik segítenek analizálni, automatizálni vagy átláthatóbbá
tenni egyes folyamatokat. Van egyéb dolog, ami szerinted hasznos lehet? Negatív vagy pozitív
tapasztalatok? Oszd meg velünk lentebb.