---
layout: post
title: "Röviden tömören"
date: 2013-02-15 15:09
comments: true
categories: general
image: http://s3-dev.folyam.info/2013-02-15-roviden-tomoren/where-everything-begins.jpeg
---

{% img left http://s3-dev.folyam.info/2013-02-15-roviden-tomoren/where-everything-begins.jpeg 240 "Valahol újra kell kezdeni" %}

Sokkal tartozom nektek, mert jó pár dolog volt, amire mondtam, hogy írok róla, csak majd később.
Erőt vettem magamon és miután rájöttem, hogy soha nem lesz időm ennyi videótartalom legyártásához,
úgy döntöttem inkább megosztom, mint szöveges tartalom. Aztán majd egyszer lesz hozzá videó is. Vagy nem.
Ez a poszt meg csak azért van, hogy lássam egyáltalán működik-e így :)

Tehát kell először is egy `inline: code`, mert azt gyakran használom.

    Kell egy pre :) Egyszerű dolgokhoz.

De ugye ez nem elég, ha programozni akarok ^^.

<!--more-->

```
Ez ilyen egy
számozott kód
nyelv megadása nélkül
```

Jó volna megadni, hogy mi a nyelv, hogy tudja hogyan kell kiemelni a kódot.

``` javascript Egy egyszerű alap
var App = {
  core: {},
  utils: {},
  modules: {}
};
```

``` php Simán egy funkció, ami kvázi semmit se csinál
<?php
function myFirstMethod() {
  return true;
}
```

De akár file is megadható?

{% include_code Alap struktúra 2013-02-15-roviden-tomoren/index.html %}
