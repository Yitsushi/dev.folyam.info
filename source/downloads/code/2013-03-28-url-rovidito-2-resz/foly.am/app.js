// Betöltjük az express-t, http-t és a path-t
var express = require('express'),
    http = require('http'),
    path = require('path');

// Betöltjük a routokat.
// Kvázi kontrollereket vagy nevezd,
// aminek akarod
var routes = require('./routes');

// Inicializáljuk az express alkalmazást
var app = express();

// Ide jönnek az express alkalmazás beállításai
app.configure(function() {
  // használjuk portnak a PORT környezeti változót,
  // ha nincs, akkor a 3000-es portot
  app.set('port', process.env.PORT || 3000);
  // A view-k helyét megadjuk
  app.set('views', __dirname + '/views');
  // A view-knál használt template motorként a jade-et
  // szeretnénk használni
  app.set('view engine', 'jade');
  // Használja az express favicon-ját, ha nincs más
  app.use(express.favicon());
  // Gzip tömörítés mindig jól jön
  app.use(express.compress());
  // A rendszer végezzen minden kérésnél elemzést és
  // bontsa fel nekünk a kérések body részét, ami a POST
  // kéréseknél hasznos
  app.use(express.bodyParser());
  // Ha szeretnénk használni (márpedig szeretnénk)
  // a PUT és DELETE megnevezésű HTTP metódusokat
  // akkor ez elengethetetlen
  app.use(express.methodOverride());
  // A cookie-k használatát is engedélyezzük
  // és állítsunk be hozzá valami véletlenszerűen generált
  // salt-ot
  app.use(express.cookieParser('pramboshnypDicOmLertevNocgocUn'));
  // A stíluslapokhoz stylus-t használunk, amit a public
  // könyvtárban használunk
  app.use(require('stylus').middleware(__dirname + '/public'));
  // A statikus részek, mint javascript-ek, css-ek, képek
  // mind a public könyvtárban lesznek
  app.use(express.static(path.join(__dirname, 'public')));
  // alkalmazzuk a routokat (lentebbről)
  app.use(app.router);
});

// Ha a NODE_ENV környezeti változó nincs definiálva, akkor
// alapértelmezetten development env-ként értelmezi
// itt be tudjuk állítani, hogy mi legyen akkor,
// ha dev módban vagyunk
app.configure('development', function(){
  // jelen esetben logoljunk minden kérést,
  // hogy milyen metódussal, milyen URL-t kértek,
  // mennyi ideig tartott és milyen status-t kapott
  app.use(express.logger({ format: ':method :url :response-time ms [:status]' }));
  // hiba esetén mindent kérünk
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Production módban nem akatunk minden kérést console.log-olni.
app.configure('production', function() {
  app.use(express.errorHandler());
});

// Most akkor állítsuk be a routokat
// Ezt most nem definiáljuk, mert
// jelen esetben szeretnénk, ha az index.html lenne használva
// a public-ból, amikor betöltjük az oldalt.
//app.get("/", routes.index);


// Ha egyik fentebbi route sem volt jó, akkor
// dobjunk egy 404-es oldalt
app.use(function(req, res, next){
  res.status(404);
  res.render(
    'error/404',
    {
      method: req.method,
      path: req.path
    }
  );
});

// Indítsuk el úgy, hogy csinálunk egy új HTTP szervert, aminek megadjuk
// paraméterben az express alkalmazásunkat, majd beállítjuk, hogy
// az express-nek megadott porton figyeljen, ha pedig elindult, akkor
// irjuk ki a console-ra eme csodás pillanatot, milyen portot kapott
// és milyen NODE_ENV-ben fut
var httpServer = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port "
               + app.get('port')
               + " (" + app.settings.env + ")");
});
