'use strict';

var request 		= require('request');
var model 			= require('./model');

var spotify_id		= "ovoweather";
var client_id 		= '39ee9f57bb3f41d99983c1784ac0e154';
var client_secret 	= 'abe7ecd919614b7a8a2057817e8359a2';
var redirect_uri 	= 'http://localhost:8888/callback';
var refresh_token 	= 'AQB8U24fbu9SDvmG5Tix7xlBYgNy3jG_TPAK9Kxu69w-s0rwYm0Xn-vuFOBDKa5-QOA53BaHDI2W4xfkFlABG4MEQPMNK7MdtbPhyZL3nCOqiPwrfWGuurZ6sTIca1AjUxE';
var access_token	= '';

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
	var latitude  = req.query.lat;
	var longitude = req.query.long;

	var apiKey       = '803124776bdc3b6d21073e97812ba316',
		url          = 'https://api.darksky.net/forecast/', // URL IS DIFFERENT FOR UT SERVER, ADDED (https://crossorigin.me/) TO BEGINNING
		lati         = latitude,
		longi        = longitude,
		apiCall      = url + apiKey + "/" + lati + "," + longi;

	request.get(apiCall, function(error, response, body) {
		var json = JSON.parse(body);

		var date     = new Date(json.daily.data[0].time * 1000),
			day      = days[date.getDay()],
			skicons  = json.currently.icon,
			time     = json.currently.time,
			humidity = json.currently.humidity,
			summary  = json.currently.summary,
			temp     = Math.round(json.currently.temperature);

		createSpotifyPlaylist(skicons, temp, function(playlistURI) {
			res.header('Access-Control-Allow-Origin', 'http://ovoweather.com');
			res.send({
				'date': date,
				'day': day,
				'skicons': skicons,
				'time': time,
				'humidity': humidity,
				'summary': summary,
				'temp': temp,
				'playlistURI': playlistURI
			});
		});
	});
};

// Helper functions

function createSpotifyPlaylist(skicon, temp, callback) {
	var requestParams = {
		"url": "https://api.spotify.com/v1/users/" + spotify_id + "/playlists",
		"headers": {
			"Authorization": "Bearer " + access_token,
			"Content-Type": "application/json"
		},
		"json": true,
		"body": {
			"name": "My OVO Weather Playlist",
			"public": false,
			"collaborative": false,
			"description": "Enjoy the weather."
		}
	};

	request.post(requestParams, function(error, response, body) {
		addTracks(skicon, temp, body.id, callback);
	});
}

function addTracks(skicon, temp, playlistId, callback) {
	var playlist = [];

	if (skicon === "rain" || skicon === "sleet") {
		playlist = model.RAINY;
	} else if (skicon === "clear-night" || skicon === "partly-cloudy-night") {
		playlist = model.NIGHT;
	} else if (skicon === "partly-cloudy-day") {
		playlist = model.SUNNY_COLD;
	} else if (skicon === "clear-day") {
		if (temp > 59) {
			playlist = model.SUNNY_WARM;
		} else {
			playlist = model.SUNNY_COLD;
		}
	} else {
		playlist = model.COLD;
	}

	// Populate an array from 0 to length of playlist
	var randArr = [];
	for (var i = 0; i < playlist.length; i++) {
		randArr.push(i);
	}

	// Shuffle array
	randArr = shuffle(randArr);

	// Take first 15 elements of randArray to populate uris and prevent duplication of tracks
	var uris = [];
	for (var i = 0; i < 15; i++) {
		var rand = randArr[i];
		uris[i] = "spotify:track:" + playlist[rand];
	}

	var requestParams = {
		"url": "https://api.spotify.com/v1/users/" + spotify_id + "/playlists/" + playlistId + "/tracks",
		"headers": {
			"Authorization": "Bearer " + access_token,
			"Content-Type": "application/json"
		},
		"json": true,
		"body": {
			"uris": uris
		}
	};

	request.post(requestParams, function(error, response, body) {
		callback(playlistId);
	});
}

// Fisher–Yates shuffle

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

