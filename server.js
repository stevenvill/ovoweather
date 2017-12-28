var express 		  = require('express'); // Express web server framework
var querystring 	= require('querystring');
var cookieParser 	= require('cookie-parser');
var compression   = require('compression');

var app  = express();
var port = process.env.PORT || 80;

var routes = require('./routes');
routes(app);

app.use(express.static(__dirname + '/app'))
   .use(cookieParser());

app.use(compression());

console.log('Listening on port ' + port);
app.listen(port);