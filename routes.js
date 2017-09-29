'use strict';

module.exports = function(app) {
  var controller = require('./controller.js');

  app.route('/weather')
    .get(controller.weatherReport);

  app.route('/')
  	.get(controller.authenticate);

};