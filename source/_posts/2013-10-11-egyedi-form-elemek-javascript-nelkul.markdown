---
layout: post
title: "Egyedi form elemek JavaScript nélkül"
date: 2013-10-11 16:20
comments: true
categories: [css, form, tricks]
image: http://dev-folyam-info.storage.googleapis.com/2013-10-11-egyedi-form-elemek-javascript-nelkul/css-bitches.jpg
---

{% img left http://dev-folyam-info.storage.googleapis.com/2013-10-11-egyedi-form-elemek-javascript-nelkul/css-bitches.jpg CSS, Please bitches %}

Bizonyára mindenki találkozott már azzal, hogy egy kedves munkatárs úgy dönt, hogy az
oldalon minden form legyen egyedi megjelenésű. Ez minden programozó álma, főleg, amikor
a formunk `checkbox`, `radio` és `select` elemekkel van tarkítva. Van pár trükk, amiket
jobb ha tud az ember ilyen esetekben. De a legjobb, ha nem kerülünk ebbe a helyzetbe.

A fentebb felsoroltakat leszámítva a többit egyszerű módosítani
[CSS](/blog/categories/css)-el. A legtöbb esetben JavaScript használata kerül előtérbe.
van ahol jogosan. Mint később látható lesz van amit nagyon egyszerűen meg lehet oldani,
de persze van amit meg lehet, ám nem biztos, hogy van értelme :)

<!-- more -->

#### Checkbox és Radiobutton

Először is tudni kell, hogy a sima `width`, `height`, `padding` és társai nem igazán
működnek ezzel a két elemmel. Sokra legalábbis nem megyünk vele. A `label` elem viszont
nagyon hasznos tud lenni, mert ha az össze van kötve egy form elemmel, akkor a `label`-re
kattintva aktiválódik a formelemünk is. Ez a checkboxnál és a radiogomboknál a státuszváltást
jelenti.

``` html
<form>
  <label class='custom-form-element'>
    <span>Szeretsz dolgozni?</span>
    <input type="checkbox" />
    <div class='answer'></div>
  </label>
  <label class="custom-form-element">
    <span>Kérsz hírlevelet?</span>
    <input type="checkbox" />
    <div class='answer'></div>
  </label>
</form>
<hr />
<form>
  <strong>Szeretsz dolgozni?</strong>
  <label class='custom-form-element radio-element'>
    <span>Igen</span>
    <input type="radio" name="stuff" value="1" />
    <div class='answer'></div>
  </label>
  <label class="custom-form-element radio-element">
    <span>Nem</span>
    <input type="radio" name="stuff" value="0" />
    <div class='answer'></div>
  </label>
  <label class="custom-form-element radio-element">
    <span>Talán</span>
    <input type="radio" name="stuff" value="-1" />
    <div class='answer'></div>
  </label>
</form>
```

Nagyjából így néz ki egy form. Az `.answer` elemek azok, amiket mi most fel fogunk
használni. Van egy olyan CSS tulajdonság, ami az ilyen elemek `checked` állapota alapján
szűr.

Ehhez most akkor adjunk egy kis sminket.

``` css
.custom-form-element {
  display: block;
  font-size: 32px;
}

.radio-element span {
  width: 100px;
}

.custom-form-element span {
  display: inline-block;
  vertical-align: top;
  font-size: 0.8em;
  line-height: 35px;
}

.custom-form-element input {
  display: none;
}

.custom-form-element input + div.answer {
  display: inline-block;
  background-image: url(cross.png);
}
.custom-form-element input:checked + div.answer
{
  background-image: url(accept.png);
}

div.answer {
  width: 32px;
  height: 32px;
}
```

{% include post/adsense_right.html %}

Így máris jobban néz ki. Mit is csináltunk? Minden formelemet elrejtettünk, ami jelen
esetben ugyebár a radio és a checkbox elemekre vonatkozik. Ezek után az `.answer` háttérképe
legyen az a kép, ami akkor jelenik meg, ha nincs kijelölve az adott formelem. És most jön
a lényeg. Ha egy `.answer` elem egy olyan `input` után van, ami `checked` állapotú, akkor
legyen a háttérképe egy zöld pipa :)

A label miatt, ha a képre vagy a szövegre kattintunk a formelemünk aktiválódik.

#### Select

Először is leszögezném, hogy elég gánynak tűnik. Őszintén szólva az is :) De nem ez a
lényeg. Sokkal inkább az, hogy [JavaScript](/blog/categories/javascript) nélkül is működik.

``` html
<form>
  <div class="custom-form-element select-element">
    <label class="selector">
      <span>V</span>
    </label>
    <label class="custom-form-element option-element">
      <input type="radio" name="stuff" checked />
      <span>-- válassz egyet --</span>
    </label>
    <label class="custom-form-element option-element">
      <input type="radio" name="stuff" value="1" />
      <span>Igen</span>
    </label>
    <label class="custom-form-element option-element">
      <input type="radio" name="stuff" value="0" />
      <span>Nem</span>
    </label>
    <label class="custom-form-element option-element">
      <input type="radio" name="stuff" value="-1" />
      <span>Talán</span>
    </label>
  </div>
</form>
```

Adjuk hozzá a css-hez az alábbi sorokat:

``` css
.custom-form-element.select-element {
  border: 1px solid;
  padding: 5px;
}

.custom-form-element.select-element:hover label span {
  display: block;
}

.custom-form-element.select-element:hover input:checked + span {
  background-color: #afa;
}

.custom-form-element.select-element:hover input + span:hover {
  background-color: #ffa;
}
.custom-form-element.select-element .selector {
  float: right;
}

.option-element input + span {
  display: none;
  cursor: pointer;
}

.option-element input:checked + span {
  display: block;
}
```

Lényegében `hover` eseményre megjelenítűnk egy radiobutton listát, amiből választhat
a kedves delikvensünk :)

{% include post/adsense_right.html %}

Természetesen egyszerűbb megoldás valami jó kis JavaScript segítséget kérni, mert rengeteg
ilyen lib van, ami hasznos. Van ezek között szép is, meg van talán optimális is. :)
Ez inkább csak érdekesség volt, de annak elég elmebeteg. A radio és a checkbox valós és
nagyon is használható. A selectbox-os megoldás az már csak ilyen _"Akkor is megcsinálom"_
kategória. De sikerült és ez a lényeg.

Az itt elkészültek
[demó oldala itt érhető el](/downloads/code/2013-10-11-egyedi-form-elemek-javascript-nelkul/index.html)
vagy [jsFiddle](http://jsfiddle.net/yitsushi/s82zj/)-n
