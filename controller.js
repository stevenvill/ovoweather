'use strict';

const axios 		= require('axios');
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
	var config = {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
		}
	};
	var data = {
		grant_type: 'refresh_token',
		refresh_token: refresh_token
	}

	axios.post('https://accounts.spotify.com/api/token', data, config).then(function (response) {
		if (response.status === 200) {
			access_token = response.data.access_token;
		}
	}).catch(function (error) {
  	console.log(error);
	});
};

exports.weatherReport = function(req, res) {
	var latitude  = req.query.lat;
	var longitude = req.query.long;

	var apiKey       = '06ftug1lQSephN2RcdwXk4bIXUDYX4aG',
			url          = 'https://api.pirateweather.net/forecast/', // URL IS DIFFERENT FOR UT SERVER, ADDED (https://crossorigin.me/) TO BEGINNING
			lati         = latitude,
			longi        = longitude,
			url          = url + apiKey + "/" + lati + "," + longi;

	axios.get(url).then(function (response) {
		var data = response.data;

		var date     = new Date(data.daily.data[0].time * 1000),
				day      = days[date.getDay()],
				skicons  = data.currently.icon,
				time     = data.currently.time,
				humidity = data.currently.humidity,
				summary  = data.currently.summary,
				temp     = Math.round(data.currently.temperature);

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
	}).catch(function (error) {
  	console.log(error);
	});
};

// Helper functions

function createSpotifyPlaylist(skicon, temp, callback) {
	var url = "https://api.spotify.com/v1/users/" + spotify_id + "/playlists"
	var config = {
		headers: {
			"Authorization": "Bearer " + access_token,
			"Content-Type": "application/json"
		}
	}
	var data = {
		"name": "My OVO Weather Playlist",
		"public": false,
		"collaborative": false,
		"description": "Enjoy the weather."
	}

	axios.post(url, data, config).then(function (response) {
		var data = response.data;
		addTracks(skicon, temp, data.id, callback);
	}).catch(function (error) {
  	console.log(error);
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

	var url = "https://api.spotify.com/v1/users/" + spotify_id + "/playlists/" + playlistId + "/tracks"
	var config = {
		headers: {
			"Authorization": "Bearer " + access_token,
			"Content-Type": "application/json"
		}
	}
	var data = {
		"uris": uris
	}

	axios.post(url, data, config).then(function (response) {
		callback(playlistId);
	}).catch(function (error) {
  	console.log(error);
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

