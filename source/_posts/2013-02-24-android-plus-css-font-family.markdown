---
layout: post
title: "Android + css:font-family"
date: 2013-02-24 00:03
comments: true
categories: [css, sucks]
image: http://dev-folyam-info.storage.googleapis.com/2013-02-24-android-plus-css-font-family/pt_sans.jpeg
---

{% img left http://dev-folyam-info.storage.googleapis.com/2013-02-24-android-plus-css-font-family/pt_sans.jpeg 190 "PT Sans" %}

Hogyan is működik a CSS-ben a `font-family`? Megadsz jópár fontot, amit használni szeretnél.
Ha az első, amit megadtál, nem jó, akkor a böngésző használja a másodikat, és ha az sem jó,
akkor a harmadikat. Legalábbis így kellene, hogy működjon. A legtöbb böngészőben már évek
óta így oldható meg az, hogy ha egy betűtípus nem elérhető, akkor használjon mást.
Az Android beépített böngészője is így gondolja?

<!--more-->

_<del><small>A nagy lófa</small></del>_ Nem. Az alap Android böngésző, ha az első fontot
megtalálja, és egy karakter nincs benne annak a karakterkészletében, akkor nem jeleníti
meg. Így jártam a [+Folyam.info](https://plus.google.com/u/0/105853491239853198987)
és a [+[Dev] Folyam.info](https://plus.google.com/u/0/105613682641367710983)
oldalaknál is, ahol `PT Sans` és `PT Serif` volt használva. Mivel ezekben alapértelmezetten
nincs `ő` és `ű` betű, így ebben a böngészőben nem jelentek meg ezek a betűk. Más böngészőnél
nem biztos ezen hiba, például a
[Chrome for Android](https://play.google.com/store/apps/details?id=com.android.chrome)
normálisan kezeli.

Mi lett a következmény? Kiszedtem ezeket a betűtípusokat és hagytam a többit, ami
`Helvetica Neue` és `Georgia`.

A hiba felfedezéséért külön köszönet jár
[+Ágoston Péter](https://plus.google.com/u/0/104970190473967264780)nek. :)