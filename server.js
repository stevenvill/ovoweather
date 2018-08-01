var express      = require('express');
var querystring  = require('querystring');
var cookieParser = require('cookie-parser');
var compression  = require('compression');

var app  = express();
var port = process.env.PORT || 3000;

var routes = require('./routes');
routes(app);

app.use(express.static(__dirname + "/dist"));
app.use(cookieParser());
app.use(compression());

console.log('Listening on port ' + port);
app.listen(port);