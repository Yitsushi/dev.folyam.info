---
layout: post
title: "CSS-ben :target?"
date: 2013-02-15 17:56
comments: true
categories: css
image: http://dev.folyam.info.s3.amazonaws.com/2013-02-15-css-ben-target/gold.png
---

{% img center http://dev.folyam.info.s3.amazonaws.com/2013-02-15-css-ben-target/gold.png %}

Egy css tulajdonság... Ami megváltoztat mindent?
Mi is ez? Egészen pontosan a böngésző `location.hash` részét vizsgálja.
Ha elhelyezünk horgonyokat, akkor állíthatunk be #css tulajdonságot arra,
ha az éppen célozva van.

<!--more-->

### Mikor lehet jó?

Csinálsz egy GYIK részt az oldalon, ahova sokminden mutat, de csak adott részekre.
Ha van aktív cél, akkor mindent picit elszürkítesz és csak azt erősíted meg,
ami éppen ki van választva vagy akár a többit össze is csukhatod, hogy csak a címe
látszódjon.

Persze sok más helyen is hasznos tud lenni, de itt különösképpen :)

### Egy gyors példa

Vegyünk akkor egy egyszerű oldalt, amin van 4 fejezetünk.

{% include_code 2013-02-15-css-ben-target/index.html %}

Most jön a lényegi rész. Először is a CSS-ben megadunk pár alap dolgot, amit
ami csak annyit tesz, hogy ki is nézzen valahogy. Nem a legszebb, de legalább van arca.

{% include_code 2013-02-15-css-ben-target/app.css %}

A lényegi rész pedig az alja _(hol máshol lenne)_, ahol megadtuk a tulajdonságokat
`:target` esetén.

``` css A fontos rész, azaz a :target használata
section article:target header {
    color: black;
    font-size: 1.3em;
}

section article:target header a {
    color: black;
}

section article:target header h2:before {
    color: #777;
}

section article:target p {
    display: block;
}

section article:target + article p {
    display: block;
}

section article:target + article {
    -webkit-transform: scale(1.04);
    -moz-transform: scale(1.04);
    -o-transform: scale(1.04);
    transform: scale(1.04);
}
```

A teljes kód működés közben: [Merre?](/downloads/code/2013-02-15-css-ben-target/index.html#a3)

### Milyen lehet egy ilyen Popup megoldás?

Gondolok itt arra, hogy van egy div-ed ami display none tulajdonságú, ha targetelve van
akkor pedig modal-al együtt display block, a bezáró gomb meg simán csak kiszedi a
hash-ből :) Így tulajdonképpen, ha a linket nyitja _(vagy valamelyik link hivatkozik a
hash-re)_, akkor feljön a popup css-ből, de be bírja zárni.

### Lehetőségek?

Te milyen felhasználási területet látsz benne?
Milyen eset volt már, amikor ez nagyon hasznos lett volna?

{% blockquote Robert Cartman https://plus.google.com/u/0/104695723888883478740/posts/DnFkp5RJqPP Google+ %}
Ez jó! Pl: ha egy adott kommentetre mutató linkre érkezik valaki,
azt ki lehet emelni vele. Eddig ehhez js kellett.
{% endblockquote %}