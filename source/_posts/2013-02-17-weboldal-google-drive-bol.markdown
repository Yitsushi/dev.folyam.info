---
layout: post
title: "Weboldal Google Drive-ból"
date: 2013-02-17 00:02
comments: true
categories: [google, html, ticks, hogyan]
image: http://dev.folyam.info.s3.amazonaws.com/2013-02-17-weboldal-google-drive-bol/open-with-preview.png
---

Végre eljött az idő. Hasonlóan, mint [Dropbox](https://www.dropbox.com/home)-nál,
a [Google Drive](https://drive.google.com) is képes mostantól tartalmat kiszolgálni.
Mostmár teljes értékűnek tekintem ezen a vonalon :)

### Miért?

Google Apps Script segítségével igen sok mindenhez hozzá lehet férni. A hozzá tartozó
scriptek illetve html, css és javascript fájlok tárolhatóak a Drive-on és onnan ki is
szolgálhatóak.

<!--more-->

### Hogyan?

Először is nyissuk meg a [Google Drive](https://drive.google.com)-ot. Csináljunk egy
könyvtárat és állítsuk be a jogait úgy, hogy mindenki láthassa, azaz publikusra. Hozzunk
létre a kívánt tartalmat. Jelen esetben egy HTML fájlt. Töltsük fel, vagy hozzuk egyből
ott létre.

{% img center http://dev.folyam.info.s3.amazonaws.com/2013-02-17-weboldal-google-drive-bol/new-text-document.png "Új fájl létrehozása" %}

Nyissuk meg a fájlt a Google Drive Viewer _(Google Drive - Megtekintő)_ használatával.

{% img center http://dev.folyam.info.s3.amazonaws.com/2013-02-17-weboldal-google-drive-bol/open-with-preview.png "Előnézet" %}

Itt megjelent egy Preview _(Előnézet)_ gomb, amit megnyomva megkapjuk a nyers fájlt.

{% img center http://dev.folyam.info.s3.amazonaws.com/2013-02-17-weboldal-google-drive-bol/check-the-output.png "Nyers fájl" %}

Innentől kezdve már csak az URL-t kell kimásolni és kész is.

{% img center http://dev.folyam.info.s3.amazonaws.com/2013-02-17-weboldal-google-drive-bol/copy-the-url.png "Elérési út" %}

Viszonylag egyszerű. A legnagyobb buktatója, ahol én is elvéreztem először, az a tartalmazó
könyvtár. Annak is publikusnak kell lennie, különben 404 hibát kaptam.

Ezek után mellé raktam egy `main.css`-t és simán megadtam az `index.html`-ben a relatív
hivatkozást rá.

``` html
<link rel="stylesheet" href="main.css">
```

A teljes "kész" mű elérhető itt: [Yeah!](https://googledrive.com/host/0ByeYB4CMClbLNy1TSDk0a1hJREk/index.html)

### Biztonsági kérdés

SSL-es URL-t kapunk. Mindezt a `googledrive.com` domain alatt. Ötletek?