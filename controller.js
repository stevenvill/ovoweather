'use strict';

var request 		= require('request'); // "Request" library

var client_id 		= '39ee9f57bb3f41d99983c1784ac0e154';
var client_secret 	= 'abe7ecd919614b7a8a2057817e8359a2';
var redirect_uri 	= 'http://localhost:8888/callback';
let refresh_token 	= 'AQB8U24fbu9SDvmG5Tix7xlBYgNy3jG_TPAK9Kxu69w-s0rwYm0Xn-vuFOBDKa5-QOA53BaHDI2W4xfkFlABG4MEQPMNK7MdtbPhyZL3nCOqiPwrfWGuurZ6sTIca1AjUxE';
let access_token	= '';

var days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];

exports.authenticate = function(req, res) {
	// Requesting access token from refresh token
	var rr = refresh_token;
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
		form: {
			grant_type: 'refresh_token',
			refresh_token: refresh_token
		},
		json: true
	};

	request.post(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			access_token = body.access_token;
		}
	});
};

exports.weatherReport = function(req, res) {
	var latitude = req.query.lat;
	var longitude = req.query.long;

	var apiKey       = '803124776bdc3b6d21073e97812ba316',
		url          = 'https://api.darksky.net/forecast/', // URL IS DIFFERENT FOR UT SERVER, ADDED (https://crossorigin.me/) TO BEGINNING
		lati         = latitude,
		longi        = longitude,
		api_call     = url + apiKey + "/" + lati + "," + longi;

	request.get(api_call, function(error, response, body) {
		let json = JSON.parse(body);

		var date     = new Date(json.daily.data[0].time * 1000),
				day      = days[date.getDay()],
				skicons  = json.currently.icon,
				time     = json.currently.time,
				humidity = json.currently.humidity,
				summary  = json.currently.summary,
				temp     = Math.round(json.currently.temperature);

		res.send({
			'date': date,
			'day': day,
			'skicons': skicons,
			'time': time,
			'humidity': humidity,
			'summary': summary,
			'temp': temp
		});
	});
};