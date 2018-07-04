'use strict';

module.exports = function(app) {
  var controller = require('./controller');

  app.route('/authenticate')
  	.get(controller.authenticate);

  app.route('/weather')
    .get(controller.weatherReport);
};