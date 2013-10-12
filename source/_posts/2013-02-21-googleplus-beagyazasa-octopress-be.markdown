---
layout: post
comments: true
date: 2013-02-21 00:48
title: Google+ beágyazása Octopress-be
categories: [ google+, octopress, plugin ]
image: http://dev-folyam-info.storage.googleapis.com/2013-02-21-googleplus-beagyazasa-octopress-be/octopress.png
---

{% img right http://dev-folyam-info.storage.googleapis.com/2013-02-21-googleplus-beagyazasa-octopress-be/octopress.png "Octopress" %}

Ezzel a bejegyzéssel tesztelem, az [Octopress](http://octopress.org/) kiegészítőmet
[Google+](https://plus.google.com/)-hoz. A lényege az, hogy a bejegyzésbe beraksz
egy `googleplus_post` blokkot a bejegyzésbe és a rendszer begenerálja a kívánt tartalmat.

A forrás, amint minden hibáját kigyomláltam publikus lesz,
ahogyan eddig is minden más. Ha van rá kereslet, akkor akár végig is magyarázom egy cikk
keretében a működését, illetve miként tudsz te is ilyet írni.

### Működés

Mivel simán beágyazni nem tudom élőben, így a poszt generálásakor egy `Liquid::Tag`
kiegészítő letölti az adott bejegyzést a Google+ API használatával. A legnagyobb probléma,
hogy nem lehet értelmesen lekérdezni egy adott bejegyzést, mert a bejegyzés azonosítója
nem egyenlő az oldalon lévő URL-ben szereplő karakterlánccal. Az egyetlen mód jelenleg amit
találtam, hogy lekérdezem a bejegyzéseit az adott embernek vagy oldalnak és megnézem
melyiknek az URL-jeben szerepel a megadott `post_id`. Remélem Azért erre később találok
értelmes megoldást. Minden megtalált bejegyzés adatát fájlrendszeren elraktározom, hogy
ne kelljen minden alkalommal megkérdezni a szervert :) Nagyjából ennyi a működése.

<!--more-->

### Használat

    {% raw %}{% googleplus_post page_id post_id %}{% endraw %}

    page_id: Az oldal vagy személy Google+ ID-ja
    post_id: Az adott bejegyzés ID-ja

Tehát, ha ezt a bejegyzést szeretném megosztani, akkor megnézem ennek az címét, ami nem
más, mint `https://plus.google.com/u/0/105613682641367710983/posts/DWc2TZgCtuS`.

Ezek alapján `page_id: 105613682641367710983` és `post_id: DWc2TZgCtuS`. Jöhet a cikk és
berakható `{% raw %}{% googleplus_post 105613682641367710983 DWc2TZgCtuS %}{% endraw %}`
tag elhelyezéssel.

### Végeredmény

{% googleplus_post 105613682641367710983 DWc2TZgCtuS %}

### Mi a következő lépés?

Kommentek betöltése. Mivel normális embed még nincs, ezért marad az a megoldás jelenleg
_(mivel mindenféle gányolásos megoldásokat nem szeretem)_, hogy felállítok időkorlátokat.
Az időkorlátokon belül pedig adott időintervallumban frissítem a megjegyzéseket.
