const express = require('express');
const clientApp = require('../clientapp');
const config = require('./lib/config');
const nunjucks = require('nunjucks');
const path = require('path');
const middleware = require('./middleware');

var app = express();

require('express-monkey-patch')(app);

var staticDir = path.join(__dirname, '/static');
var staticRoot = '/static';

app.use(function (req, res, next) {
  res.locals.static = function static (staticPath) {
    return path.join(app.mountPoint, staticRoot, staticPath);
  }
  next();
});

app.use(express.compress());
app.use(express.bodyParser());
app.use(middleware.session());
app.use(middleware.csrf({ whitelist: [] }));

app.use(staticRoot, express.static(staticDir));

var cApp = clientApp(app);
app.get('*', cApp.html());

if (!module.parent) {
  const port = config('PORT', 3000);

  app.listen(port, function(err) {
    if (err) {
      throw err;
    }

    console.log('Listening on port ' + port + '.');
  });
} else {
  module.exports = http.createServer(app);
}
