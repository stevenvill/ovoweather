var express 		  = require('express'); // Express web server framework
var querystring 	= require('querystring');
var cookieParser 	= require('cookie-parser');

var app  = express();

var routes = require('./routes');
routes(app);

app.use(express.static(__dirname + '/app'))
   .use(cookieParser());

console.log('Listening on 8888');
app.listen(8888);