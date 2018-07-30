var express      = require('express');
var querystring  = require('querystring');
var cookieParser = require('cookie-parser');
var compression  = require('compression');

var app  = express();
var port = process.env.PORT || 3000;
var environment = process.env.NODE_ENV;

var routes = require('./routes');
routes(app);

var assets = "/assets";
if (environment === "production") {
	assets = "/dist";
}

app.use(express.static(__dirname + assets));
app.use(cookieParser());
app.use(compression());

console.log('Listening on port ' + port);
app.listen(port);