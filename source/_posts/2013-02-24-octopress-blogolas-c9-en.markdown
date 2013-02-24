---
layout: post
title: "Octopress blogolás c9-en"
date: 2013-02-24 08:35
comments: true
categories: [octopress, cloud, hogyan]
image: http://folyam.info.s3.amazonaws.com/2013-02-24-octopress-blogolas-c9-en/c9-cloud.jpeg
---

{% img left http://folyam.info.s3.amazonaws.com/2013-02-24-octopress-blogolas-c9-en/c9-cloud.jpeg 200 "C9.io - Cloud" %}

A felhő alapú társadalom már viszonylag jól ki tudja szolgálni az igényeket.
A legnagyobb ellenérvem mindig is a szakmám volt, mert nehéz volt elképzelni,
hogy lesz normális felhő alapú IDE. Hogy őszinte legyek még most sincs, de már
alakul. Mivel a [blogmotor](http://octopress.org/), amit használok, elsősorban
a gépemet igényli. Nem olyan, mint mondjuk a [Blogger](http://www.blogger.com/)
vagy a [Wordpress](http://wordpress.com/), viszont előfodult már, hogy nem volt a
közelemben a gépem, de írtam volna egy cikket. Hogy lehet ezt megoldani?

<!--more-->

### Mi az a c9.io?

A [c9.io](https://c9.io/) egy olyan webes megoldás, ahol kapsz a böngésződbe
egy szép szerkesztőt. Ha nem is szép, akkor legalább szerkesztő. Tud
kódkiegészítést, sok nyelvet támogat, [Github](https://github.com) és
[Bitbucket](https://bitbucket.org/) kapcsolattal rendelkezik, de beránthatsz
saját [git](http://git-scm.com/) repot is.

### Akkor jöjjön a reszelés

Mivel alapértelmezetten tudod futtatni dev módban, amit csinálsz, így végképp
kényelmes. Természetesen nem simán a megszokott `PORT` környezeti változót használja,
így kicsit módosítani kell a rendszeren. Jelen esetben egyetlen fájlt kell módosítani,
ami nem más mint a `Rakefile`.

``` diff
diff --git a/Rakefile b/Rakefile
index 471b227..06aa580 100644
--- a/Rakefile
+++ b/Rakefile
@@ -25,7 +25,9 @@ posts_dir       = "_posts"    # directory for blog files
 themes_dir      = ".themes"   # directory for blog files
 new_post_ext    = "markdown"  # default new post file extension when using the new_post task
 new_page_ext    = "markdown"  # default new page file extension when using the new_page task
-server_port     = "4000"      # port for preview server eg. localhost:4000
+#server_port     = "4000"      # port for preview server eg. localhost:4000
+server_host     = ENV["IP"] ||= "0.0.0.0"
+server_port     = ENV["port"] ||= ENV["C9_PORT"] ||= "4000"
 
 
 desc "Initial setup for Octopress: copies the default theme into the path of Jekyll's generator. Rake install defaults to rake install[classic] to install a different theme run rake install[some_theme_name]"
@@ -79,7 +81,7 @@ task :preview do
   system "compass compile --css-dir #{source_dir}/stylesheets" unless File.exist?("#{source_dir}/stylesheets/screen.css")
   jekyllPid = Process.spawn({"OCTOPRESS_ENV"=>"preview"}, "jekyll --auto")
   compassPid = Process.spawn("compass watch")
-  rackupPid = Process.spawn("rackup --port #{server_port}")
+  rackupPid = Process.spawn("rackup --host #{server_host} --port #{server_port}")
 
   trap("INT") {
     [jekyllPid, compassPid, rackupPid].each { |pid| Process.kill(9, pid) rescue Errno::ESRCH }

```

Erre azért van szükség, mert mint említettem a c9 nem a megszokott `ENV["PORT"]`
változót használja, hanem az `ENV["C9_PORT"]`-al dolgozik. A `server_host` megadása
is azért kell, mert simán a `0.0.0.0`-ra nem engedi bindelni.

### Előnézet

Már csak be kell írni a termináljába, hogy `bundle install`, majd pedig `rake preview`.
Nem túl bonyolult, ám annál hasznosabb, mert így csak belépsz a c9-re, megnyitod
a projektet és már írhatod is az új bejegyzést. Ha kész, akkor simán kezeled
git-el. Generálsz, hozzáadod a fájlokat, hogy kommitolj, majd kommitolsz,
majd feltolod a szerverre. Ezt a bejegyzést is így írom.