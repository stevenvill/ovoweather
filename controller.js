'use strict';

var request 		= require('request'); // "Request" library

var client_id 		= '39ee9f57bb3f41d99983c1784ac0e154';
var client_secret 	= 'abe7ecd919614b7a8a2057817e8359a2';
var redirect_uri 	= 'http://localhost:8888/callback';
let refresh_token 	= 'AQB8U24fbu9SDvmG5Tix7xlBYgNy3jG_TPAK9Kxu69w-s0rwYm0Xn-vuFOBDKa5-QOA53BaHDI2W4xfkFlABG4MEQPMNK7MdtbPhyZL3nCOqiPwrfWGuurZ6sTIca1AjUxE';
let access_token	= '';

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
			res.send({
				'access_token': access_token
			});
		}
	});
};

exports.weatherReport = function(req, res) {
	res.send({});
};