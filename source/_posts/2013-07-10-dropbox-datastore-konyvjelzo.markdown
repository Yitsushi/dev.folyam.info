---
layout: post
title: "Dropbox Datastore könyvjelző"
date: 2013-07-10 23:31
comments: true
categories: [dropbox, api, hogyan, cloud, javascript]
image: http://s3-dev.folyam.info.s3.amazonaws.com/2013-07-10-dropbox-datastore-konyvjelzo/developer-datastores-vfliUo8_8.png
---

{% img center http://s3-dev.folyam.info.s3.amazonaws.com/2013-07-10-dropbox-datastore-konyvjelzo/developer-datastores-vfliUo8_8.png Dropbox Datastore%}

[Megjelent egy új szolgáltatás a Dropbox](https://www.dropbox.com/developers/datastore)
palettáján. Röviden összefoglalva adatbázisként is tudjuk használni mostantol. A legjobb,
hogy [JavaScript API kliens](https://www.dropbox.com/developers/datastore/sdks/js) is jár
hozzá, amivel később nagyon jól össze lehet hozni mondjuk az Angular.js-es alkalmazásukat.

Ez egy remek lépés volt tőlük, mert ha valaki ezt használja, mint fejlesztő, akkor
rákényszeríti a felhasználóit, hogy rendelkezzenek Dropbox fiókkal.
Most akkor készítsünk egy egyszerű könyvjelzőalkalmazást.

<!-- more -->

### Első lépések

Miután persze már van egy Dropbox felhasználónk, létre kell hoznunk az alkalmazásunkat egy
dedikált felületen, az [App Console](https://www.dropbox.com/developers/apps)

Itt sok dolgunk nincsen. Kiválasztjuk a `Dropbox API App` lehetőséget, kiválasztjuk, hogy
mihez szeretnénk hozzáférni. Jelenleg elég lesz a `Datastore only` opció is. Fájlokkal is
lehet játszadozni, de azt most nem vizsgáljuk meg. Ha megvan, akkor adnunk kell egy
nevet az alkalmazásnak. Jelen esetben ez a `FolyamBookmark`. Dropbox-ban egészen jól
fejleszthető, mert csak `https://` címeket fogad el, mint átirányítási cím. Ez alől csak a
`localhost` kivétel. Tehát a legegyszerűbb, ha létrehozol egy fájlt (vagy letöltöd az itt
elkészültet) és feltöltöd valami publikus könyvtárba Dropbox-on. Kapsz hozzá egy publikus
címet és azt bemásolod mint `Redirect URL`. Egyedül a `App key`, amire szükségünk lesz
egyelőre.

### HTML

Gyorsan vázoljuk fel a html struktúránkat. Nem lesz sok nem kell félni :)

``` html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dropbox Datastore</title>
</head>
<body>
  <div id="content"></div>
  <script src="https://www.dropbox.com/static/api/1/dropbox-datastores-0.1.0-b2.js"
          type="text/javascript"></script>
</body>
</html>
```

Nem hazudtam, mert tényleg nem sok :) A lényeges pont a végén a JavaScript betöltés.
Ez ugyanis a Datastores API kliens. Jelenleg még béta címkét kapott, de majd szépen
átlendül ezen a fázison. Addig is nyugodtan lehet használni. Bár vigyázz, mert akinek
nincs Dropbox fiókja az nem fogja tudnk használni, amíg nem csinál.

### Alap JavaScript hozzá

``` html
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Dropbox Datastore</title>
</head>
<body>
	<div id="content">
	</div>
	<script src="https://www.dropbox.com/static/api/1/dropbox-datastores-0.1.0-b2.js"
	        type="text/javascript"></script>
	<script>
		(function() {
			var userInfoContainer, listContainer;

			// Új Dropbox kliens instance
			var client = new Dropbox.Client({key: "sruznra86dm01yz"});

			// Megpróbáljuk azonosítani a látogatót
			client.authenticate({interactive: false}, function (error) {
				// Ha hiba van, akkor...
		    if (error) {
		    	// Paraszt dolog, de így a cikk kedvéért
		    	// ismét alert ablak lesz használva
	        alert('Authentication error: ' + error);
		    }
			});

			// Ha a látogató azonosította magát, akkor...
			if (client.isAuthenticated()) {
				// hozzuk létre a boxot, amibe beleírjuk majd a felhasználót
				userInfoContainer = document.createElement('div');
				userInfoContainer.className = "user-info";
				// illetve azt, amibe majd a linkeket pakoljuk
				listContainer = document.createElement('ul');
				listContainer.className = "link-list"

				// adjuk hozzá őket a DOM struktúránkhoz
				document.getElementById('content').appendChild(userInfoContainer);
				document.getElementById('content').appendChild(listContainer);

				// kérdezzük le a felhasználó adatait
				client.getUserInfo({}, function(error, info) {
					userInfoContainer.innerHTML =  "<span class='name'>" + info.name + "</span>";
					userInfoContainer.innerHTML += "<span class='email'>(" + info.email + ")</span>";
				});
			} else {
				// Ha nincs bejelentkezve, akkor bejelentkeztetjük
				client.authenticate();
			}
		}());
	</script>
</body>
</html>
```

Két lényeges pont látható. Jelen példánkban, ha valaki nincs bejelentkezve, akkor
egy üres lapot lát maga előtt. Ez azért sem fájdalmas, mert gomb nélkül egyértelműen
bejelentkeztetjük a felhasználót, mert most nem akarunk szívni mindenféle dekorációval.

A másik a kliens meghívásakor paraméterben átadott `key`. Ezt az előző lépésből jól
megjegyeztük. Nem? Akkor lapozzunk oda, másoljuk át.

Ha sikeresen bejelentkezett a felhasználó, akkor kiírjuk, hogy ki is ő, nehogy véletlenül
ne tudja. Milyen dolog lenne már?

Mielőtt továbbmennénk csináljunk neki valami arcot is. A `<title>` tag alá (de még a `head`
zárótag főlé) másoljuk be a stílust.

``` css
<style>
	.user-info {
		border-bottom: 1px solid #aaa;
		padding: 5px 10px;
	}
	.user-info .name {
		padding-right: 10px;
	}
	.add-url {
		padding: 5px;
		border: 1px solid #ccc;
		width: 500px;
		margin: 10px;
		margin-top: 0;
	}
	.link-list {
		width: 500px;
		padding: 0;
		margin: 10px;
	}

	.link-list li {
		list-style: none;
		cursor: pointer;
	}

	.link-list li .delete-button {
		float: right;
		cursor: pointer;
	}
</style>
```

### A lényeg

Itt az ideje, hogy a már bejelentkezett felhasználónk érjük el az adatbázist. Nem olyan
bonyolult ez, mint amilyennek hangzik. Mikor betöltődik az alkalmazás egyből megpróbáljuk
azonosítani a látogatót. Ha sikerült, akkor betöltjük a felhasználó információit, majd
kiiratjuk. Ezek után inicializáljuk az adatbázist és minden elemet kikérdezve beillesztünk
egy `li` elemet minden linknek. Minden link mellé rakunk egy törlés gombot, hogy lehessen
őket törölni. Az egész alatt egy beviteli mező ékeskedik és jelzi számunkra, hogy ide
tudjuk beírni a kívánt címet. Ha itt egy entert ütünk, akkor elmentjuk adatbázisba, majd
beillesztjük a `li` elemet.

``` html
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Dropbox Datastore</title>
	<style>
		.user-info {
			border-bottom: 1px solid #aaa;
			padding: 5px 10px;
		}
		.user-info .name {
			padding-right: 10px;
		}
		.add-url {
			padding: 5px;
			border: 1px solid #ccc;
			width: 500px;
			margin: 10px;
			margin-top: 0;
		}
		.link-list {
			width: 500px;
			padding: 0;
			margin: 10px;
		}

		.link-list li {
			list-style: none;
			cursor: pointer;
		}

		.link-list li .delete-button {
			float: right;
			cursor: pointer;
		}
	</style>
</head>
<body>
	<div id="content">
	</div>
	<script src="https://www.dropbox.com/static/api/1/dropbox-datastores-0.1.0-b2.js"
	        type="text/javascript"></script>
	<script>
		(function() {
			var userInfoContainer, listContainer;

			// Csak hogy legyen egy példányunk, amivel mindig üres Link
			// objektumokat hozunk létre.
			var createLink = function(url) {
				// ha nincs url paraméter, akkor üres szöveg értéket kap
				if (typeof url == "undefined") {
					url = "";
				}
				return {
					"url": url,
					"createdAt": new Date(),
					"clicks": 0
				};
			};

			// Ezt elmentjük globálisan, mert mindenhonnan szeretnénk elérni
			var linkTable;

			// Ezt hívjuk majd meg, ha törölni akarunk egy linket
			var removeLink = function() {
				// a törlés gombon van az onlick, tehát
				// az ő szülőjének data-id tulajdonsága alapján tudunk törölni
				var link = linkTable.get(this.parentNode.getAttribute('data-id'));
				// töröljük a megtalált elemet
				link.deleteRecord();
				// töröljük a li elemet a DOM struktúrából is
				return this.parentNode.remove();
			};

			// Adjunk hozzá egy linket a DOM struktúrához
			// Ez a függvény fut le, akkor is, ha változik az adatbázis,
			// mert ez ám tud ilyet is. Ha változik valami, akkor meghív 
			// eseményfigyelő függvényt.
			var addLinkToList = function(link) {
				// Ha törlünk egy elemet, akkor is lefut a változásra
				// figyelő függvényünk, így ha az elem törölt, akkor
				// ne foglalkozzunk vele.
				if (link.isDeleted()) {
					return false;
				}
				// Megnézzük, hogy van-e már a listánkon ilyen.
				var ifExists = document.querySelector("li[data-id='"+link.getId()+"']");
				// Ha van, akkor nem foglalkoznk vele és nem adjuk hozzá.
				if (ifExists) {
					return false;
				}
				// létrehozzuk a li elemet
				var li = document.createElement('li');
				// beállítjuk a data-id tulajdonságot
				// Minden elemnek van ID-je, amit a rendszer generál neki
  			li.setAttribute('data-id', link.getId());
  			// szövegnek megadjuk az url-t
  			li.innerText = link.get('url');
  			// Beállítunk egy figyelőt, click eseményre.
  			// Ha rákattintunk, akkor egy számlálót növelünk,
  			// hogy hányszor kattintottunk rá
  			li.onclick = function(e) {
  				// Elemet megkeressük
  				var tempLink = linkTable.get(this.getAttribute('data-id'));
  				// frissítjuk a click értéket
					tempLink.set('click', tempLink.get('click') + 1)
  				        .update();
  				// megnyitjuk a linket
  				window.open(tempLink.get('url'), '_blank');
  			};
  			// törlés gombot is létrehozzuk
  			var deleteButton = document.createElement("span");
  			deleteButton.className = "delete-button";
  			// beállítjuk eseményfigyelőnek a removeLink függvényönk
  			// click eseményre
  			deleteButton.onclick = removeLink;
  			// tartalma logikusan egy X, ami a törlést hivatott tudatosítani
  			deleteButton.innerText = "X";
  			// hozzáadjuk a törlést a li elemhez
  			li.appendChild(deleteButton);
  			// majd a li elemet a listánk végéhez
  			listContainer.appendChild(li);
  			return link;
			}

			// ez az initStore fut le, amikor sikeresen léterhoztuk a felületet
			// bejelentkezett felhasználóknak
			var initStore = function() {
				// csinálunk egy beviteli mezőt, amibe majd írunk
				var addField = document.createElement('input');
				addField.setAttribute('type', "text");
				addField.setAttribute('placeholder', "Save URL for later");
				addField.className = "add-url";
				document.getElementById('content').appendChild(addField);

				// Kérünk egy DatastoreManager példányt
				var datastoreManager = client.getDatastoreManager();
				// megnyitjuk az adatbázist
				datastoreManager.openDefaultDatastore(function(error, datastore) {
					// Ha hiba volt, akkor szólunk
					if (error) {
		        alert('Error opening default datastore: ' + error);
			    } else {
			    	// beállítunk egy figyelőt. Ha frissül valami tábla,
			    	// akkor jól megnézzük, hogy mi frissült
			    	datastore.recordsChanged.addListener(function(updated) {
			    		// kikérdezzük a változott elemeket a links táblából
			    		var changes = updated.affectedRecordsForTable('links');
			    		// lefuttatjuk minden változott elemre az addLinkToList
			    		// függvényt
			    		changes.map(addLinkToList);
			    	});
			    	// lekérdezzük a táblánkat, aminek logikusan links a neve
			    	linkTable = datastore.getTable('links');
			    	(function(){
			    		// kikérdezünk minden elemet. Ezek azok, amik az alkalmazás
			    		// indulásakor már az adatbázisban vannak.
			    		var items = linkTable.query();
			    		// majd végighaladunk rajtuk, hogy hozzáadjuk
			    		items.map(addLinkToList);
			    	}());

			    	// ha kész az adatbázis, akkor beállítunk egy keyup eseményre
			    	// figyelő függvényt, hogy enter leütésére küldje el az adatot
			    	// hozzáadásra
			    	addField.onkeyup = function(e) {
			    		if (e.keyCode == 13) {
			    			var link = createLink(this.value);
			    			this.value = "";
			    			var link = linkTable.insert(link);
			    		}
			    	}
			    }
				});
			};

			// Új Dropbox kliens instance
			var client = new Dropbox.Client({key: "sruznra86dm01yz"});

			// Megpróbáljuk azonosítani a látogatót
			client.authenticate({interactive: false}, function (error) {
				// Ha hiba van, akkor...
		    if (error) {
	        alert('Authentication error: ' + error);
		    }
			});

			// Ha a látogató azonosította magát, akkor...
			if (client.isAuthenticated()) {
				// hozzuk létre a boxot, amibe beleírjuk majd a felhasználót
				userInfoContainer = document.createElement('div');
				userInfoContainer.className = "user-info";
				// illetve azt, amibe majd a linkeket pakoljuk
				listContainer = document.createElement('ul');
				listContainer.className = "link-list"

				document.getElementById('content').appendChild(userInfoContainer);
				document.getElementById('content').appendChild(listContainer);

				// kérdezzük le a felhasználó adatait
				client.getUserInfo({}, function(error, info) {
					userInfoContainer.innerHTML =  "<span class='name'>" + info.name + "</span>";
					userInfoContainer.innerHTML += "<span class='email'>(" + info.email + ")</span>";

					initStore();
				});
			} else {
				// Ha nincs bejelentkezve, akkor bejelentkeztetjük
				client.authenticate();
			}
		}());
	</script>
</body>
</html>
```

Elnézést a simán csak összecsapott bemutatóért, de ezt most gyorsan le akartam rendezni,
hogy [+Robert Cartman](https://plus.google.com/u/0/112022247551053844428) ezzel kapcsolatos
[kívánsága](https://plus.google.com/u/0/112022247551053844428/posts/agzWShap7B5) mielőbb
teljesülhessen.

A
[végeredmény használható formában elérhető Dropbox-on kereszrül](https://dl.dropboxusercontent.com/u/7963193/FolyamBookmark/index.html)
, amint átengedik a
szűrőn. Publikáláshoz ki kell tölteni egy egyszerű formot, amiben megadod, hogy mi ez
és hol érhető el. :)