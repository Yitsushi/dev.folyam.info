var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  var now = new Date();

  // Friday
  if (now.getDay() == 5) {
    return res.end("Igen! Ma péntek van.");
  }

  // Weekend
  if (now.getDay() == 0 || now.getDay() == 6) {
    return res.end("Mit számít? Hiszen hétvége van.");
  }

  // Sad days
  return res.end("Nem, nincs péntek. De nyugi már csak "
                 + (5 - now.getDay())
                 + " napot kell túlélni.")
}).listen(3000);
